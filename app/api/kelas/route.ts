import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.kelas.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/kelas error:", error);
    return NextResponse.json(
      { error: "Failed to fetch kelas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.tingkat) {
      return NextResponse.json(
        { error: "Nama dan Tingkat harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.kelas.create({ 
      data: { nama: body.nama, tingkat: Number(body.tingkat) } 
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/kelas error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Kelas sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat kelas" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.nama || !body.tingkat) {
      return NextResponse.json(
        { error: "ID, Nama dan Tingkat harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.kelas.update({
      where: { id: body.id },
      data: { nama: body.nama, tingkat: Number(body.tingkat) },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT /api/kelas error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Kelas sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal mengubah kelas" },
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

    await prisma.kelas.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/kelas error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}
