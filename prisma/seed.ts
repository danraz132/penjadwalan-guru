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

  // --- SISWA ---
  await prisma.siswa.createMany({
    data: [
      // Siswa Kelas VII A
      { nama: 'Andi Wijaya', nis: '2024001', kelasId: kelasA.id },
      { nama: 'Bella Putri', nis: '2024002', kelasId: kelasA.id },
      { nama: 'Candra Pratama', nis: '2024003', kelasId: kelasA.id },
      { nama: 'Dina Anggraini', nis: '2024004', kelasId: kelasA.id },
      { nama: 'Eko Saputra', nis: '2024005', kelasId: kelasA.id },
      { nama: 'Farah Amalia', nis: '2024006', kelasId: kelasA.id },
      { nama: 'Galih Permana', nis: '2024007', kelasId: kelasA.id },
      { nama: 'Hana Nurhaliza', nis: '2024008', kelasId: kelasA.id },
      { nama: 'Irfan Maulana', nis: '2024009', kelasId: kelasA.id },
      { nama: 'Julia Kartika', nis: '2024010', kelasId: kelasA.id },
      
      // Siswa Kelas VII B
      { nama: 'Kevin Ahmad', nis: '2024011', kelasId: kelasB.id },
      { nama: 'Luna Salsabila', nis: '2024012', kelasId: kelasB.id },
      { nama: 'Muhammad Rizki', nis: '2024013', kelasId: kelasB.id },
      { nama: 'Nabila Zahira', nis: '2024014', kelasId: kelasB.id },
      { nama: 'Omar Firdaus', nis: '2024015', kelasId: kelasB.id },
      { nama: 'Putri Maharani', nis: '2024016', kelasId: kelasB.id },
      { nama: 'Qori Syahputra', nis: '2024017', kelasId: kelasB.id },
      { nama: 'Rina Andriani', nis: '2024018', kelasId: kelasB.id },
      { nama: 'Satria Bagaskara', nis: '2024019', kelasId: kelasB.id },
      { nama: 'Tika Melati', nis: '2024020', kelasId: kelasB.id },
      
      // Siswa Kelas VIII A
      { nama: 'Umar Hadi', nis: '2023001', kelasId: kelasC.id },
      { nama: 'Vina Septiani', nis: '2023002', kelasId: kelasC.id },
      { nama: 'Wahyu Pradana', nis: '2023003', kelasId: kelasC.id },
      { nama: 'Xena Kusuma', nis: '2023004', kelasId: kelasC.id },
      { nama: 'Yoga Aditya', nis: '2023005', kelasId: kelasC.id },
      { nama: 'Zahra Cantika', nis: '2023006', kelasId: kelasC.id },
      { nama: 'Arya Wardana', nis: '2023007', kelasId: kelasC.id },
      { nama: 'Bunga Lestari', nis: '2023008', kelasId: kelasC.id },
      { nama: 'Cahya Ramadhan', nis: '2023009', kelasId: kelasC.id },
      { nama: 'Dewi Safitri', nis: '2023010', kelasId: kelasC.id },
    ]
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
