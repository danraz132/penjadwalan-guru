import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.guru.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/guru error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gurus" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nama = body?.nama;
    const nip = body?.nip;

    if (!nama || !nip) {
      return NextResponse.json(
        { error: "Nama dan NIP harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.guru.create({ data: { nama, nip } });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/guru error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "NIP sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat guru" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.nama || !body.nip) {
      return NextResponse.json(
        { error: "ID, Nama dan NIP harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.guru.update({
      where: { id: body.id },
      data: { nama: body.nama, nip: body.nip },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT /api/guru error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "NIP sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal mengubah guru" },
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

    await prisma.guru.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/guru error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus guru" },
      { status: 500 }
    );
  }
}
