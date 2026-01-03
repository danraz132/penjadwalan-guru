import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

interface TimeSlot {
  hari: string
  jamMulai: string
  jamSelesai: string
}

// Fungsi untuk convert jam ke menit (untuk perbandingan)
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Fungsi untuk convert menit ke jam
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

// Cek apakah dua slot waktu bertabrakan
function isTimeConflict(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)

  return s1 < e2 && s2 < e1
}

// Slot waktu yang tersedia
const availableSlots: TimeSlot[] = [
  { hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:30' },
  { hari: 'Senin', jamMulai: '08:30', jamSelesai: '10:00' },
  { hari: 'Senin', jamMulai: '10:00', jamSelesai: '11:30' },
  { hari: 'Senin', jamMulai: '11:30', jamSelesai: '13:00' },
  { hari: 'Senin', jamMulai: '13:00', jamSelesai: '14:30' },

  { hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:30' },
  { hari: 'Selasa', jamMulai: '08:30', jamSelesai: '10:00' },
  { hari: 'Selasa', jamMulai: '10:00', jamSelesai: '11:30' },
  { hari: 'Selasa', jamMulai: '11:30', jamSelesai: '13:00' },
  { hari: 'Selasa', jamMulai: '13:00', jamSelesai: '14:30' },

  { hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:30' },
  { hari: 'Rabu', jamMulai: '08:30', jamSelesai: '10:00' },
  { hari: 'Rabu', jamMulai: '10:00', jamSelesai: '11:30' },
  { hari: 'Rabu', jamMulai: '11:30', jamSelesai: '13:00' },
  { hari: 'Rabu', jamMulai: '13:00', jamSelesai: '14:30' },

  { hari: 'Kamis', jamMulai: '07:00', jamSelesai: '08:30' },
  { hari: 'Kamis', jamMulai: '08:30', jamSelesai: '10:00' },
  { hari: 'Kamis', jamMulai: '10:00', jamSelesai: '11:30' },
  { hari: 'Kamis', jamMulai: '11:30', jamSelesai: '13:00' },
  { hari: 'Kamis', jamMulai: '13:00', jamSelesai: '14:30' },

  { hari: 'Jumat', jamMulai: '07:00', jamSelesai: '08:30' },
  { hari: 'Jumat', jamMulai: '08:30', jamSelesai: '10:00' },
  { hari: 'Jumat', jamMulai: '10:00', jamSelesai: '11:30' },
  { hari: 'Jumat', jamMulai: '11:30', jamSelesai: '13:00' },
  { hari: 'Jumat', jamMulai: '13:00', jamSelesai: '14:30' },
]

export async function POST() {
  try {
    // Hapus jadwal lama
    await prisma.jadwal.deleteMany({})

    // Ambil semua data
    const [matpels, kelas, ruangan] = await Promise.all([
      prisma.matpel.findMany({ include: { guru: true } }),
      prisma.kelas.findMany(),
      prisma.ruangan.findMany(),
    ])

    if (kelas.length === 0 || matpels.length === 0 || ruangan.length === 0) {
      return NextResponse.json(
        { error: 'Data master (kelas, mapel, ruangan) harus ada terlebih dahulu' },
        { status: 400 }
      )
    }

    // Track penggunaan: guru dan ruangan di setiap slot
    const scheduledJadwal: any[] = []
    const guruSchedule: Map<number, TimeSlot[]> = new Map() // guru -> slot yang sudah dipakai
    const kelasSchedule: Map<number, TimeSlot[]> = new Map() // kelas -> slot yang sudah dipakai
    const ruanganSchedule: Map<number, TimeSlot[]> = new Map() // ruangan -> slot yang sudah dipakai
    const matpelHours: Map<number, number> = new Map() // matpel -> jam yang sudah dijadwalkan

    // Inisialisasi maps
    for (const m of matpels) {
      matpelHours.set(m.id, 0)
    }

    // Urutkan matpel berdasarkan jam per minggu (ascending) untuk prioritas scheduling
    const sortedMatpels = [...matpels].sort((a, b) => b.jamPerMinggu - a.jamPerMinggu)

    // Coba schedule setiap mata pelajaran
    for (const matpel of sortedMatpels) {
      const hoursNeeded = matpel.jamPerMinggu
      let hoursScheduled = matpelHours.get(matpel.id) || 0

      // Assign ke kelas yang berbeda-beda
      const selectedKelas = kelas.slice(0, Math.min(hoursNeeded, kelas.length))

      for (const k of selectedKelas) {
        if (hoursScheduled >= hoursNeeded) break

        // Cari slot yang tersedia
        let slotFound = false
        for (const slot of availableSlots) {
          // Cek konflik guru
          const guruSlots = guruSchedule.get(matpel.guruId) || []
          const guruConflict = guruSlots.some(
            (s) =>
              s.hari === slot.hari &&
              isTimeConflict(s.jamMulai, s.jamSelesai, slot.jamMulai, slot.jamSelesai)
          )

          if (guruConflict) continue

          // Cek konflik kelas
          const kelasSlots = kelasSchedule.get(k.id) || []
          const kelasConflict = kelasSlots.some(
            (s) =>
              s.hari === slot.hari &&
              isTimeConflict(s.jamMulai, s.jamSelesai, slot.jamMulai, slot.jamSelesai)
          )

          if (kelasConflict) continue

          // Cek konflik ruangan
          const ruanganSlots = ruanganSchedule.get(ruangan[0].id) || []
          const ruanganConflict = ruanganSlots.some(
            (s) =>
              s.hari === slot.hari &&
              isTimeConflict(s.jamMulai, s.jamSelesai, slot.jamMulai, slot.jamSelesai)
          )

          if (ruanganConflict) continue

          // Slot valid, tambahkan jadwal
          scheduledJadwal.push({
            kelasId: k.id,
            matpelId: matpel.id,
            guruId: matpel.guruId,
            ruanganId: ruangan[0].id,
            hari: slot.hari,
            jamMulai: slot.jamMulai,
            jamSelesai: slot.jamSelesai,
          })

          // Update tracking
          guruSchedule.set(matpel.guruId, [...guruSlots, slot])
          kelasSchedule.set(k.id, [...(kelasSchedule.get(k.id) || []), slot])
          ruanganSchedule.set(ruangan[0].id, [...ruanganSlots, slot])
          matpelHours.set(matpel.id, hoursScheduled + 1)

          hoursScheduled += 1
          slotFound = true
          break
        }

        if (!slotFound) {
          console.warn(
            `Tidak bisa schedule ${matpel.nama} untuk kelas ${k.nama} - tidak ada slot tersedia`
          )
        }
      }
    }

    // Simpan ke database
    const created = await prisma.jadwal.createMany({
      data: scheduledJadwal,
    })

    return NextResponse.json({
      message: 'Jadwal berhasil dibuat secara otomatis',
      totalJadwal: created.count,
      jadwal: scheduledJadwal,
    })
  } catch (error) {
    console.error('Error generating schedule:', error)
    return NextResponse.json({ error: 'Gagal membuat jadwal' }, { status: 500 })
  }
}
