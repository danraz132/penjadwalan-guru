import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Ambil semua data guru pengganti
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tanggal = searchParams.get('tanggal')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (tanggal) {
      const date = new Date(tanggal)
      where.tanggal = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999))
      }
    }
    
    if (status) {
      where.status = status
    }

    const guruPengganti = await prisma.guruPengganti.findMany({
      where,
      include: {
        guruAsli: true,
        guruPengganti: true,
        jadwal: {
          include: {
            kelas: true,
            matpel: true,
            ruangan: true
          }
        },
        absensi: true
      },
      orderBy: {
        tanggal: 'desc'
      }
    })

    return NextResponse.json(guruPengganti)
  } catch (error) {
    console.error('Error fetching guru pengganti:', error)
    return NextResponse.json({ error: 'Failed to fetch guru pengganti' }, { status: 500 })
  }
}

// POST - Tentukan guru pengganti
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { absensiId, jadwalId, guruAsliId, guruPenggantiId, tanggal, catatan } = body

    const parsedAbsensiId = Number(absensiId)
    const parsedJadwalId = Number(jadwalId)
    const parsedGuruAsliId = Number(guruAsliId)
    const parsedGuruPenggantiId = Number(guruPenggantiId)
    const parsedTanggal = tanggal ? new Date(tanggal) : null

    // Validasi
    if (!parsedJadwalId || !parsedGuruAsliId || !parsedGuruPenggantiId || !parsedTanggal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Cek apakah guru pengganti sudah dijadwalkan di jam yang sama
    const jadwal = await prisma.jadwal.findUnique({
      where: { id: parsedJadwalId }
    })

    if (!jadwal) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 })
    }

    // Cek konflik jadwal guru pengganti
    const konflik = await prisma.jadwal.findFirst({
      where: {
        guruId: parsedGuruPenggantiId,
        hari: jadwal.hari,
        OR: [
          {
            AND: [
              { jamMulai: { lte: jadwal.jamMulai } },
              { jamSelesai: { gt: jadwal.jamMulai } }
            ]
          },
          {
            AND: [
              { jamMulai: { lt: jadwal.jamSelesai } },
              { jamSelesai: { gte: jadwal.jamSelesai } }
            ]
          }
        ]
      }
    })

    if (konflik) {
      return NextResponse.json({ 
        error: 'Guru pengganti sudah memiliki jadwal di jam yang sama',
        konflik 
      }, { status: 400 })
    }

    let finalAbsensiId = parsedAbsensiId

    if (!finalAbsensiId) {
      const startOfDay = new Date(parsedTanggal)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(parsedTanggal)
      endOfDay.setHours(23, 59, 59, 999)

      const existingAbsensi = await prisma.absensiGuru.findFirst({
        where: {
          guruId: parsedGuruAsliId,
          tanggal: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (existingAbsensi) {
        finalAbsensiId = existingAbsensi.id
      } else {
        const createdAbsensi = await prisma.absensiGuru.create({
          data: {
            guruId: parsedGuruAsliId,
            tanggal: parsedTanggal,
            status: 'Izin',
            keterangan: 'Dibuat otomatis dari penentuan guru pengganti manual',
          },
        })

        finalAbsensiId = createdAbsensi.id
      }
    }

    // Buat data guru pengganti
    const guruPengganti = await prisma.guruPengganti.create({
      data: {
        absensiId: finalAbsensiId,
        jadwalId: parsedJadwalId,
        guruAsliId: parsedGuruAsliId,
        guruPenggantiId: parsedGuruPenggantiId,
        tanggal: parsedTanggal,
        status: 'Menunggu',
        catatan
      },
      include: {
        guruAsli: true,
        guruPengganti: true,
        jadwal: {
          include: {
            kelas: true,
            matpel: true,
            ruangan: true
          }
        }
      }
    })

    return NextResponse.json(guruPengganti)
  } catch (error) {
    console.error('Error creating guru pengganti:', error)
    return NextResponse.json({ error: 'Failed to create guru pengganti' }, { status: 500 })
  }
}

// PUT - Update status guru pengganti
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, catatan } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const guruPengganti = await prisma.guruPengganti.update({
      where: { id: parseInt(id) },
      data: {
        status,
        catatan
      },
      include: {
        guruAsli: true,
        guruPengganti: true,
        jadwal: {
          include: {
            kelas: true,
            matpel: true,
            ruangan: true
          }
        }
      }
    })

    return NextResponse.json(guruPengganti)
  } catch (error) {
    console.error('Error updating guru pengganti:', error)
    return NextResponse.json({ error: 'Failed to update guru pengganti' }, { status: 500 })
  }
}

// DELETE - Hapus guru pengganti
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await prisma.guruPengganti.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Guru pengganti deleted successfully' })
  } catch (error) {
    console.error('Error deleting guru pengganti:', error)
    return NextResponse.json({ error: 'Failed to delete guru pengganti' }, { status: 500 })
  }
}
