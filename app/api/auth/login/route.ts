// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/lib/auth';
import { createSession } from '@/lib/session';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        guru: true,
        siswa: {
          include: {
            kelas: true
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Buat session
    const sessionUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      guruId: user.guruId || undefined,
      siswaId: user.siswaId || undefined,
      nama: user.guru?.nama || user.siswa?.nama || username,
    };

    await createSession(sessionUser);

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        nama: sessionUser.nama,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
