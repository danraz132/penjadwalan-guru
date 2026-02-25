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

    // Track penggunaan: guru, kelas, dan ruangan di setiap slot
    const scheduledJadwal: any[] = []
    const guruSchedule: Map<number, TimeSlot[]> = new Map() // guru -> slot yang sudah dipakai
    const kelasSchedule: Map<number, TimeSlot[]> = new Map() // kelas -> slot yang sudah dipakai
    const ruanganSchedule: Map<number, TimeSlot[]> = new Map() // ruangan -> slot yang sudah dipakai
    const kelasLoad: Map<number, number> = new Map() // kelas -> total slot yang sudah dijadwalkan
    const matpelHours: Map<number, number> = new Map() // matpel -> slot yang sudah dijadwalkan
    const kelasMatpelCount: Map<string, number> = new Map() // `${kelasId}-${matpelId}` -> total slot

    // Inisialisasi maps
    for (const m of matpels) {
      matpelHours.set(m.id, 0)
    }

    for (const k of kelas) {
      kelasLoad.set(k.id, 0)
    }

    const tikRegex = /\btik\b/i
    const labKomputer = ruangan.find((r) => /lab\s*komputer/i.test(String(r.nama || '')))

    function isTIKSubject(namaMapel: string): boolean {
      return tikRegex.test(namaMapel || '')
    }

    function allowedRoomsForSubject(matpel: (typeof matpels)[number]) {
      const isTIK = isTIKSubject(matpel.nama)

      if (!labKomputer) {
        return ruangan
      }

      if (isTIK) {
        return [labKomputer]
      }

      return ruangan.filter((r) => r.id !== labKomputer.id)
    }

    function canUseSlot(existingSlots: TimeSlot[], slot: TimeSlot): boolean {
      return !existingSlots.some(
        (s) =>
          s.hari === slot.hari &&
          isTimeConflict(s.jamMulai, s.jamSelesai, slot.jamMulai, slot.jamSelesai)
      )
    }

    function tryAssign(matpel: (typeof matpels)[number]): boolean {
      const kelasSorted = [...kelas].sort((a, b) => {
        const loadA = kelasLoad.get(a.id) || 0
        const loadB = kelasLoad.get(b.id) || 0
        if (loadA !== loadB) return loadA - loadB

        const pairA = kelasMatpelCount.get(`${a.id}-${matpel.id}`) || 0
        const pairB = kelasMatpelCount.get(`${b.id}-${matpel.id}`) || 0
        return pairA - pairB
      })

      for (const k of kelasSorted) {
        const kelasSlots = kelasSchedule.get(k.id) || []
        const guruSlots = guruSchedule.get(matpel.guruId) || []

        for (const slot of availableSlots) {
          if (!canUseSlot(kelasSlots, slot)) continue
          if (!canUseSlot(guruSlots, slot)) continue

          const allowedRooms = allowedRoomsForSubject(matpel)
          for (const r of allowedRooms) {
            const ruanganSlots = ruanganSchedule.get(r.id) || []
            if (!canUseSlot(ruanganSlots, slot)) continue

            scheduledJadwal.push({
              kelasId: k.id,
              matpelId: matpel.id,
              guruId: matpel.guruId,
              ruanganId: r.id,
              hari: slot.hari,
              jamMulai: slot.jamMulai,
              jamSelesai: slot.jamSelesai,
            })

            guruSchedule.set(matpel.guruId, [...guruSlots, slot])
            kelasSchedule.set(k.id, [...kelasSlots, slot])
            ruanganSchedule.set(r.id, [...ruanganSlots, slot])
            kelasLoad.set(k.id, (kelasLoad.get(k.id) || 0) + 1)
            matpelHours.set(matpel.id, (matpelHours.get(matpel.id) || 0) + 1)

            const pairKey = `${k.id}-${matpel.id}`
            kelasMatpelCount.set(pairKey, (kelasMatpelCount.get(pairKey) || 0) + 1)
            return true
          }
        }
      }

      return false
    }

    // Fase 1: pastikan setiap mapel minimal mendapat 1 slot terlebih dahulu
    const coverageOrder = [...matpels].sort((a, b) => b.jamPerMinggu - a.jamPerMinggu)
    for (const matpel of coverageOrder) {
      tryAssign(matpel)
    }

    // Fase 2: penuhi sisa kebutuhan jam mapel secara bertahap dan merata
    let progress = true
    while (progress) {
      progress = false

      const remaining = [...matpels]
        .filter((m) => (matpelHours.get(m.id) || 0) < m.jamPerMinggu)
        .sort((a, b) => {
          const ratioA = (matpelHours.get(a.id) || 0) / Math.max(a.jamPerMinggu, 1)
          const ratioB = (matpelHours.get(b.id) || 0) / Math.max(b.jamPerMinggu, 1)
          if (ratioA !== ratioB) return ratioA - ratioB
          return b.jamPerMinggu - a.jamPerMinggu
        })

      for (const matpel of remaining) {
        const assigned = tryAssign(matpel)
        if (assigned) {
          progress = true
        }
      }
    }

    const notScheduledMapel = matpels.filter((m) => (matpelHours.get(m.id) || 0) === 0)
    if (notScheduledMapel.length > 0) {
      return NextResponse.json(
        {
          error: 'Gagal membuat jadwal: ada mata pelajaran yang belum mendapat hari/jam',
          detail: notScheduledMapel.map((m) => m.nama),
        },
        { status: 400 }
      )
    }

    // Simpan ke database secara aman (replace jadwal lama hanya jika generate sukses)
    const created = await prisma.$transaction(async (tx) => {
      await tx.guruPengganti.deleteMany({})
      await tx.jadwal.deleteMany({})

      return tx.jadwal.createMany({
        data: scheduledJadwal,
      })
    })

    return NextResponse.json({
      message: 'Jadwal berhasil dibuat secara otomatis',
      totalJadwal: created.count,
      totalMapelTerjadwal: [...matpelHours.values()].filter((value) => value > 0).length,
      jadwal: scheduledJadwal,
    })
  } catch (error) {
    console.error('Error generating schedule:', error)
    if ((error as any)?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Gagal menghapus jadwal lama karena masih dipakai data lain' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat jadwal' }, { status: 500 })
  }
}
