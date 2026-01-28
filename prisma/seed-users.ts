// prisma/seed-users.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedUsers() {
  console.log('🔐 Seeding users...');

  // Hapus semua user yang ada (opsional, untuk development)
  await prisma.user.deleteMany({});

  // Hash password untuk semua user
  const adminPassword = await hashPassword('admin123');
  const guruPassword = await hashPassword('guru123');
  const siswaPassword = await hashPassword('siswa123');

  // Buat user admin
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.username);

  // Ambil semua guru untuk dibuatkan akun
  const gurus = await prisma.guru.findMany();
  
  for (const guru of gurus) {
    const username = `guru_${guru.nip}`;
    try {
      const guruUser = await prisma.user.create({
        data: {
          username,
          password: guruPassword,
          role: Role.GURU,
          guruId: guru.id,
        },
      });
      console.log(`✅ Guru user created: ${guruUser.username} (${guru.nama})`);
    } catch (error) {
      console.log(`⚠️  User ${username} sudah ada atau error`);
    }
  }

  // Ambil semua siswa untuk dibuatkan akun
  const siswas = await prisma.siswa.findMany();
  
  for (const siswa of siswas) {
    const username = `siswa_${siswa.nis}`;
    try {
      const siswaUser = await prisma.user.create({
        data: {
          username,
          password: siswaPassword,
          role: Role.SISWA,
          siswaId: siswa.id,
        },
      });
      console.log(`✅ Siswa user created: ${siswaUser.username} (${siswa.nama})`);
    } catch (error) {
      console.log(`⚠️  User ${username} sudah ada atau error`);
    }
  }

  console.log('\n📝 Login credentials:');
  console.log('================================');
  console.log('Admin:');
  console.log('  Username: admin');
  console.log('  Password: admin123');
  console.log('\nGuru:');
  console.log('  Username: guru_[NIP]');
  console.log('  Password: guru123');
  console.log('\nSiswa:');
  console.log('  Username: siswa_[NIS]');
  console.log('  Password: siswa123');
  console.log('================================\n');
}

seedUsers()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
