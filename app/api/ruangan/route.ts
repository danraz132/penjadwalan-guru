import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    return NextResponse.json(await prisma.ruangan.findMany())
  } catch (error) {
    console.error("GET /api/ruangan error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ruangan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.nama || !body.kapasitas) {
      return NextResponse.json(
        { error: "Nama dan Kapasitas harus diisi" },
        { status: 400 }
      );
    }

    const ruangan = await prisma.ruangan.create({ 
      data: { nama: body.nama, kapasitas: Number(body.kapasitas) } 
    })
    return NextResponse.json(ruangan, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/ruangan error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ruangan sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat ruangan" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    if (!body.id || !body.nama || !body.kapasitas) {
      return NextResponse.json(
        { error: "ID, Nama dan Kapasitas harus diisi" },
        { status: 400 }
      );
    }

    const ruangan = await prisma.ruangan.update({
      where: { id: body.id },
      data: { nama: body.nama, kapasitas: Number(body.kapasitas) },
    })
    return NextResponse.json(ruangan)
  } catch (error: any) {
    console.error("PUT /api/ruangan error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Ruangan tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ruangan sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal mengubah ruangan" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))

    if (!id) {
      return NextResponse.json(
        { error: "ID harus diisi" },
        { status: 400 }
      );
    }

    await prisma.ruangan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE /api/ruangan error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Ruangan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus ruangan" },
      { status: 500 }
    );
  }
}