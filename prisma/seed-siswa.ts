import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Menambahkan data siswa...')

  // Ambil kelas yang sudah ada
  const kelas = await prisma.kelas.findMany()
  
  if (kelas.length === 0) {
    console.log('❌ Tidak ada kelas! Jalankan seed utama dulu.')
    return
  }

  // Cek apakah siswa sudah ada
  const existingSiswa = await prisma.siswa.count()
  if (existingSiswa > 0) {
    console.log(`✓ Sudah ada ${existingSiswa} siswa di database`)
    return
  }

  const kelasA = kelas.find(k => k.nama === 'VII A')
  const kelasB = kelas.find(k => k.nama === 'VII B')
  const kelasC = kelas.find(k => k.nama === 'VIII A')

  if (!kelasA || !kelasB || !kelasC) {
    console.log('❌ Kelas tidak lengkap, gunakan kelas yang ada')
    // Gunakan 3 kelas pertama yang ada
    const [k1, k2, k3] = kelas
    
    await prisma.siswa.createMany({
      data: [
        // Siswa Kelas 1
        { nama: 'Andi Wijaya', nis: '2024001', kelasId: k1.id },
        { nama: 'Bella Putri', nis: '2024002', kelasId: k1.id },
        { nama: 'Candra Pratama', nis: '2024003', kelasId: k1.id },
        { nama: 'Dina Anggraini', nis: '2024004', kelasId: k1.id },
        { nama: 'Eko Saputra', nis: '2024005', kelasId: k1.id },
        { nama: 'Farah Amalia', nis: '2024006', kelasId: k1.id },
        { nama: 'Galih Permana', nis: '2024007', kelasId: k1.id },
        { nama: 'Hana Nurhaliza', nis: '2024008', kelasId: k1.id },
        { nama: 'Irfan Maulana', nis: '2024009', kelasId: k1.id },
        { nama: 'Julia Kartika', nis: '2024010', kelasId: k1.id },
        
        // Siswa Kelas 2
        { nama: 'Kevin Ahmad', nis: '2024011', kelasId: k2.id },
        { nama: 'Luna Salsabila', nis: '2024012', kelasId: k2.id },
        { nama: 'Muhammad Rizki', nis: '2024013', kelasId: k2.id },
        { nama: 'Nabila Zahira', nis: '2024014', kelasId: k2.id },
        { nama: 'Omar Firdaus', nis: '2024015', kelasId: k2.id },
        { nama: 'Putri Maharani', nis: '2024016', kelasId: k2.id },
        { nama: 'Qori Syahputra', nis: '2024017', kelasId: k2.id },
        { nama: 'Rina Andriani', nis: '2024018', kelasId: k2.id },
        { nama: 'Satria Bagaskara', nis: '2024019', kelasId: k2.id },
        { nama: 'Tika Melati', nis: '2024020', kelasId: k2.id },
        
        // Siswa Kelas 3
        { nama: 'Umar Hadi', nis: '2023001', kelasId: k3.id },
        { nama: 'Vina Septiani', nis: '2023002', kelasId: k3.id },
        { nama: 'Wahyu Pradana', nis: '2023003', kelasId: k3.id },
        { nama: 'Xena Kusuma', nis: '2023004', kelasId: k3.id },
        { nama: 'Yoga Aditya', nis: '2023005', kelasId: k3.id },
        { nama: 'Zahra Cantika', nis: '2023006', kelasId: k3.id },
        { nama: 'Arya Wardana', nis: '2023007', kelasId: k3.id },
        { nama: 'Bunga Lestari', nis: '2023008', kelasId: k3.id },
        { nama: 'Cahya Ramadhan', nis: '2023009', kelasId: k3.id },
        { nama: 'Dewi Safitri', nis: '2023010', kelasId: k3.id },
      ]
    })
    
    console.log('✓ 30 siswa berhasil ditambahkan!')
    return
  }

  // Jika kelas lengkap, gunakan kelas spesifik
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

  console.log('✓ 30 siswa berhasil ditambahkan!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
