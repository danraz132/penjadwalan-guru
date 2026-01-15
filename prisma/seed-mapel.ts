import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Menambahkan mata pelajaran untuk guru...')

  // Ambil semua guru
  const allGuru = await prisma.guru.findMany()
  console.log(`Total guru: ${allGuru.length}`)

  if (allGuru.length < 12) {
    console.log('❌ Guru belum lengkap, jalankan seed-guru.ts dulu')
    return
  }

  // Map guru berdasarkan NIP untuk mudah diakses
  const guruMap: { [key: string]: any } = {}
  allGuru.forEach(g => {
    guruMap[g.nip] = g
  })

  // Daftar mata pelajaran
  const matpelList = [
    // Matematika - 3 guru
    { nama: 'Matematika', jamPerMinggu: 4, nip: '19870314202301' }, // Budi
    { nama: 'Matematika', jamPerMinggu: 4, nip: '19850920202304' }, // Rina
    { nama: 'Matematika', jamPerMinggu: 4, nip: '19910525202307' }, // Rizal
    
    // Bahasa Indonesia - 3 guru
    { nama: 'Bahasa Indonesia', jamPerMinggu: 3, nip: '19890512202302' }, // Siti
    { nama: 'Bahasa Indonesia', jamPerMinggu: 3, nip: '19920715202305' }, // Dedi
    { nama: 'Bahasa Indonesia', jamPerMinggu: 3, nip: '19930618202308' }, // Lina
    
    // IPA - 3 guru
    { nama: 'IPA', jamPerMinggu: 4, nip: '19900605202303' }, // Ahmad
    { nama: 'IPA', jamPerMinggu: 4, nip: '19880308202306' }, // Wati
    { nama: 'IPA', jamPerMinggu: 4, nip: '19860401202309' }, // Hadi
    
    // IPS - 2 guru
    { nama: 'IPS', jamPerMinggu: 2, nip: '19940822202310' }, // Maya
    { nama: 'IPS', jamPerMinggu: 2, nip: '19891109202311' }, // Agus
    
    // Bahasa Inggris - 2 guru
    { nama: 'Bahasa Inggris', jamPerMinggu: 3, nip: '19920214202312' }, // Fitri
    { nama: 'Bahasa Inggris', jamPerMinggu: 3, nip: '19920715202305' }, // Dedi
  ]

  let added = 0
  let skipped = 0

  for (const mp of matpelList) {
    const guru = guruMap[mp.nip]
    
    if (!guru) {
      console.log(`❌ Guru dengan NIP ${mp.nip} tidak ditemukan`)
      continue
    }

    // Cek apakah mapel sudah ada untuk guru ini
    const exists = await prisma.matpel.findFirst({
      where: {
        nama: mp.nama,
        guruId: guru.id
      }
    })

    if (exists) {
      console.log(`⏭ Skip: ${mp.nama} - ${guru.nama} (sudah ada)`)
      skipped++
    } else {
      await prisma.matpel.create({
        data: {
          nama: mp.nama,
          jamPerMinggu: mp.jamPerMinggu,
          guruId: guru.id
        }
      })
      console.log(`✓ Added: ${mp.nama} - ${guru.nama}`)
      added++
    }
  }

  console.log(`\n✅ Selesai! Added: ${added}, Skipped: ${skipped}`)
  
  const totalMapel = await prisma.matpel.count()
  console.log(`Total mata pelajaran di database: ${totalMapel}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
