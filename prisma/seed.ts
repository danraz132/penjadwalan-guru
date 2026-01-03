import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // --- GURU ---
  const guru1 = await prisma.guru.create({
    data: { nama: 'Budi Santoso', nip: '19870314202301' }
  })
  const guru2 = await prisma.guru.create({
    data: { nama: 'Siti Rahmawati', nip: '19890512202302' }
  })
  const guru3 = await prisma.guru.create({
    data: { nama: 'Ahmad Fauzi', nip: '19900605202303' }
  })

  // --- KELAS ---
  const kelasA = await prisma.kelas.create({
    data: { nama: 'VII A', tingkat: 7 }
  })
  const kelasB = await prisma.kelas.create({
    data: { nama: 'VII B', tingkat: 7 }
  })
  const kelasC = await prisma.kelas.create({
    data: { nama: 'VIII A', tingkat: 8 }
  })

  // --- RUANGAN ---
  const r1 = await prisma.ruangan.create({
    data: { nama: 'Ruang 101', kapasitas: 30 }
  })
  const r2 = await prisma.ruangan.create({
    data: { nama: 'Ruang 102', kapasitas: 35 }
  })
  const r3 = await prisma.ruangan.create({
    data: { nama: 'Lab Komputer', kapasitas: 25 }
  })

  // --- MATA PELAJARAN ---
  const m1 = await prisma.matpel.create({
    data: { nama: 'Matematika', jamPerMinggu: 4, guruId: guru1.id }
  })
  const m2 = await prisma.matpel.create({
    data: { nama: 'Bahasa Indonesia', jamPerMinggu: 3, guruId: guru2.id }
  })
  const m3 = await prisma.matpel.create({
    data: { nama: 'IPA', jamPerMinggu: 4, guruId: guru3.id }
  })
  const m4 = await prisma.matpel.create({
    data: { nama: 'IPS', jamPerMinggu: 2, guruId: guru2.id }
  })

  // --- PREFERENSI GURU (opsional) ---
  await prisma.preferensi.createMany({
    data: [
      { guruId: guru1.id, hariSuka: 'Senin', jamSuka: '07:00-09:00' },
      { guruId: guru2.id, hariSuka: 'Rabu', jamSuka: '09:00-11:00' },
      { guruId: guru3.id, hariSuka: 'Kamis', jamSuka: '10:00-12:00' }
    ]
  })

  // --- JADWAL DUMMY ---
  await prisma.jadwal.createMany({
    data: [
      {
        kelasId: kelasA.id,
        matpelId: m1.id,
        guruId: guru1.id,
        ruanganId: r1.id,
        hari: 'Senin',
        jamMulai: '07:00',
        jamSelesai: '09:00'
      },
      {
        kelasId: kelasB.id,
        matpelId: m2.id,
        guruId: guru2.id,
        ruanganId: r2.id,
        hari: 'Selasa',
        jamMulai: '09:00',
        jamSelesai: '11:00'
      },
      {
        kelasId: kelasC.id,
        matpelId: m3.id,
        guruId: guru3.id,
        ruanganId: r3.id,
        hari: 'Rabu',
        jamMulai: '10:00',
        jamSelesai: '12:00'
      }
    ]
  })

  console.log('✅ Seeding selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
