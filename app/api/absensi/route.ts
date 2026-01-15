import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fungsi untuk konversi waktu ke menit
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Fungsi untuk cek konflik jadwal
function isTimeConflict(time1Start: string, time1End: string, time2Start: string, time2End: string): boolean {
  const start1 = timeToMinutes(time1Start)
  const end1 = timeToMinutes(time1End)
  const start2 = timeToMinutes(time2Start)
  const end2 = timeToMinutes(time2End)
  
  return (start1 < end2 && end1 > start2)
}

// Fungsi untuk mencari guru pengganti otomatis
async function cariGuruPengganti(guruId: number, tanggal: Date) {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const hari = dayNames[tanggal.getDay()]
  
  // Ambil semua jadwal guru yang tidak masuk di hari tersebut
  const jadwalGuruTidakMasuk = await prisma.jadwal.findMany({
    where: {
      guruId: guruId,
      hari: hari
    },
    include: {
      matpel: {
        include: {
          guru: true
        }
      },
      kelas: true,
      ruangan: true
    }
  })
  
  const guruPenggantiList = []
  
  for (const jadwal of jadwalGuruTidakMasuk) {
    // Cari guru lain yang mengajar mata pelajaran yang sama
    const guruSamaMapel = await prisma.matpel.findMany({
      where: {
        nama: jadwal.matpel.nama,
        guruId: {
          not: guruId // Bukan guru yang tidak masuk
        }
      },
      include: {
        guru: true,
        jadwal: {
          where: {
            hari: hari
          }
        }
      }
    })
    
    // Cari guru yang jadwalnya tidak bentrok
    for (const mapel of guruSamaMapel) {
      let isBentrok = false
      
      // Cek apakah guru ini sudah memiliki jadwal di jam yang sama
      for (const jadwalGuru of mapel.jadwal) {
        if (isTimeConflict(
          jadwal.jamMulai, 
          jadwal.jamSelesai, 
          jadwalGuru.jamMulai, 
          jadwalGuru.jamSelesai
        )) {
          isBentrok = true
          break
        }
      }
      
      // Jika tidak bentrok, tambahkan sebagai kandidat
      if (!isBentrok) {
        guruPenggantiList.push({
          jadwalId: jadwal.id,
          guruAsliId: guruId,
          guruPenggantiId: mapel.guruId,
          guruPengganti: mapel.guru,
          jadwal: jadwal
        })
        break // Ambil guru pertama yang cocok untuk jadwal ini
      }
    }
  }
  
  return guruPenggantiList
}

// GET - Ambil semua absensi guru
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tanggal = searchParams.get('tanggal')
    const guruId = searchParams.get('guruId')

    const where: any = {}
    
    if (tanggal) {
      const date = new Date(tanggal)
      where.tanggal = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999))
      }
    }
    
    if (guruId) {
      where.guruId = parseInt(guruId)
    }

    const absensi = await prisma.absensiGuru.findMany({
      where,
      include: {
        guru: true,
        penggantiSchedule: {
          include: {
            jadwal: {
              include: {
                kelas: true,
                matpel: true
              }
            },
            guruPengganti: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    })

    return NextResponse.json(absensi)
  } catch (error) {
    console.error('Error fetching absensi:', error)
    return NextResponse.json({ error: 'Failed to fetch absensi' }, { status: 500 })
  }
}

// POST - Catat guru tidak masuk
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guruId, tanggal, status, keterangan } = body

    // Validasi
    if (!guruId || !tanggal || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Cek apakah sudah ada absensi untuk guru di tanggal tersebut
    const existingAbsensi = await prisma.absensiGuru.findFirst({
      where: {
        guruId: parseInt(guruId),
        tanggal: new Date(tanggal)
      }
    })

    if (existingAbsensi) {
      return NextResponse.json({ error: 'Absensi sudah dicatat untuk tanggal ini' }, { status: 400 })
    }

    // Buat absensi baru
    const absensi = await prisma.absensiGuru.create({
      data: {
        guruId: parseInt(guruId),
        tanggal: new Date(tanggal),
        status,
        keterangan
      },
      include: {
        guru: true
      }
    })

    // Jika guru tidak hadir (Sakit/Izin/Alpa), cari guru pengganti otomatis
    const guruPenggantiCreated = []
    if (status !== 'Hadir') {
      const kandidatPengganti = await cariGuruPengganti(parseInt(guruId), new Date(tanggal))
      
      // Buat record guru pengganti untuk setiap jadwal yang perlu diganti
      for (const kandidat of kandidatPengganti) {
        try {
          const guruPengganti = await prisma.guruPengganti.create({
            data: {
              absensiId: absensi.id,
              jadwalId: kandidat.jadwalId,
              guruAsliId: kandidat.guruAsliId,
              guruPenggantiId: kandidat.guruPenggantiId,
              tanggal: new Date(tanggal),
              status: 'Menunggu',
              catatan: `Otomatis ditugaskan karena ${kandidat.guruPengganti.nama} mengajar mata pelajaran yang sama dan jadwal kosong`
            },
            include: {
              guruPengganti: true,
              jadwal: {
                include: {
                  kelas: true,
                  matpel: true
                }
              }
            }
          })
          guruPenggantiCreated.push(guruPengganti)
        } catch (error) {
          console.error('Error creating guru pengganti:', error)
        }
      }
    }

    return NextResponse.json({
      absensi,
      guruPengganti: guruPenggantiCreated,
      message: guruPenggantiCreated.length > 0 
        ? `${guruPenggantiCreated.length} guru pengganti berhasil ditugaskan`
        : status === 'Hadir' ? 'Absensi dicatat' : 'Tidak ada guru pengganti yang tersedia'
    })
  } catch (error) {
    console.error('Error creating absensi:', error)
    return NextResponse.json({ error: 'Failed to create absensi' }, { status: 500 })
  }
}

// PUT - Update absensi
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, keterangan } = body

    const absensi = await prisma.absensiGuru.update({
      where: { id: parseInt(id) },
      data: {
        status,
        keterangan
      },
      include: {
        guru: true
      }
    })

    return NextResponse.json(absensi)
  } catch (error) {
    console.error('Error updating absensi:', error)
    return NextResponse.json({ error: 'Failed to update absensi' }, { status: 500 })
  }
}

// DELETE - Hapus absensi
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Hapus guru pengganti yang terkait
    await prisma.guruPengganti.deleteMany({
      where: { absensiId: parseInt(id) }
    })

    // Hapus absensi
    await prisma.absensiGuru.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Absensi deleted successfully' })
  } catch (error) {
    console.error('Error deleting absensi:', error)
    return NextResponse.json({ error: 'Failed to delete absensi' }, { status: 500 })
  }
}
