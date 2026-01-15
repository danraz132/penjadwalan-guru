import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    return NextResponse.json(absensi)
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
