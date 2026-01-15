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

// GET - Cari guru yang tersedia untuk menggantikan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jadwalId = searchParams.get('jadwalId')
    const tanggal = searchParams.get('tanggal')
    
    if (!jadwalId || !tanggal) {
      return NextResponse.json({ error: 'Missing jadwalId or tanggal' }, { status: 400 })
    }

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const date = new Date(tanggal)
    const hari = dayNames[date.getDay()]
    
    // Ambil jadwal yang perlu diganti
    const jadwalAsli = await prisma.jadwal.findUnique({
      where: { id: parseInt(jadwalId) },
      include: {
        matpel: true,
        kelas: true,
        ruangan: true,
        guru: true
      }
    })
    
    if (!jadwalAsli) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 })
    }
    
    // Cari guru lain yang mengajar mata pelajaran yang sama
    const guruSamaMapel = await prisma.matpel.findMany({
      where: {
        nama: jadwalAsli.matpel.nama,
        guruId: {
          not: jadwalAsli.guruId
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
    
    const guruTersedia = []
    
    for (const mapel of guruSamaMapel) {
      let isBentrok = false
      let alasanBentrok = null
      
      // Cek apakah guru ini sudah memiliki jadwal di jam yang sama
      for (const jadwalGuru of mapel.jadwal) {
        if (isTimeConflict(
          jadwalAsli.jamMulai, 
          jadwalAsli.jamSelesai, 
          jadwalGuru.jamMulai, 
          jadwalGuru.jamSelesai
        )) {
          isBentrok = true
          alasanBentrok = `Sudah mengajar di jam ${jadwalGuru.jamMulai}-${jadwalGuru.jamSelesai}`
          break
        }
      }
      
      guruTersedia.push({
        guru: mapel.guru,
        tersedia: !isBentrok,
        alasan: isBentrok ? alasanBentrok : 'Jadwal kosong',
        jadwalGuru: mapel.jadwal
      })
    }
    
    return NextResponse.json({
      jadwalAsli,
      guruTersedia,
      summary: {
        total: guruTersedia.length,
        tersedia: guruTersedia.filter(g => g.tersedia).length,
        bentrok: guruTersedia.filter(g => !g.tersedia).length
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to get available teachers' }, { status: 500 })
  }
}
