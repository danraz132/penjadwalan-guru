import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.siswa.findMany({
      include: {
        kelas: true,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/siswa error:", error);
    return NextResponse.json(
      { error: "Failed to fetch siswa" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.nis || !body.kelasId) {
      return NextResponse.json(
        { error: "Nama, NIS, dan Kelas harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.siswa.create({ 
      data: {
        nama: body.nama,
        nis: body.nis,
        kelasId: parseInt(body.kelasId),
      },
      include: {
        kelas: true,
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/siswa error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "NIS sudah terdaftar" },
        { status: 400 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat siswa" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.nama || !body.nis || !body.kelasId) {
      return NextResponse.json(
        { error: "ID, Nama, NIS, dan Kelas harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.siswa.update({
      where: { id: body.id },
      data: { 
        nama: body.nama, 
        nis: body.nis,
        kelasId: parseInt(body.kelasId),
      },
      include: {
        kelas: true,
      },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT /api/siswa error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "NIS sudah terdaftar" },
        { status: 400 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal mengubah siswa" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID harus diisi" },
        { status: 400 }
      );
    }

    await prisma.siswa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/siswa error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus siswa" },
      { status: 500 }
    );
  }
}
