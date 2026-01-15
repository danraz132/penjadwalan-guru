import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Menambahkan data guru...')

  // Cek jumlah guru yang ada
  const existingGuru = await prisma.guru.count()
  console.log(`Data guru yang ada: ${existingGuru}`)

  if (existingGuru >= 12) {
    console.log('✓ Data guru sudah lengkap (12 guru)')
    return
  }

  // Daftar guru yang akan ditambahkan
  const guruList = [
    { nama: 'Budi Santoso', nip: '19870314202301' },
    { nama: 'Siti Rahmawati', nip: '19890512202302' },
    { nama: 'Ahmad Fauzi', nip: '19900605202303' },
    { nama: 'Rina Kusuma', nip: '19850920202304' },
    { nama: 'Dedi Supriadi', nip: '19920715202305' },
    { nama: 'Wati Suryani', nip: '19880308202306' },
    { nama: 'Rizal Pratama', nip: '19910525202307' },
    { nama: 'Lina Marlina', nip: '19930618202308' },
    { nama: 'Hadi Wijaya', nip: '19860401202309' },
    { nama: 'Maya Sari', nip: '19940822202310' },
    { nama: 'Agus Setiawan', nip: '19891109202311' },
    { nama: 'Fitri Handayani', nip: '19920214202312' }
  ]

  let added = 0
  let skipped = 0

  for (const guru of guruList) {
    // Cek apakah NIP sudah ada
    const exists = await prisma.guru.findUnique({
      where: { nip: guru.nip }
    })

    if (exists) {
      console.log(`⏭ Skip: ${guru.nama} (NIP ${guru.nip} sudah ada)`)
      skipped++
    } else {
      await prisma.guru.create({
        data: guru
      })
      console.log(`✓ Added: ${guru.nama}`)
      added++
    }
  }

  console.log(`\n✅ Selesai! Added: ${added}, Skipped: ${skipped}`)
  
  const totalGuru = await prisma.guru.count()
  console.log(`Total guru di database: ${totalGuru}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
