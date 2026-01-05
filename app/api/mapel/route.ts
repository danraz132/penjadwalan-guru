import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.matpel.findMany({
      include: { guru: true },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/mapel error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mapel" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.jamPerMinggu || !body.guruId) {
      return NextResponse.json(
        { error: "Nama, Jam Per Minggu dan Guru harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.matpel.create({ 
      data: { 
        nama: body.nama, 
        jamPerMinggu: Number(body.jamPerMinggu), 
        guruId: Number(body.guruId) 
      },
      include: { guru: true }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/mapel error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Mapel sudah terdaftar" },
        { status: 400 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat mapel" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.nama || !body.jamPerMinggu || !body.guruId) {
      return NextResponse.json(
        { error: "ID, Nama, Jam Per Minggu dan Guru harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.matpel.update({
      where: { id: body.id },
      data: { 
        nama: body.nama, 
        jamPerMinggu: Number(body.jamPerMinggu), 
        guruId: Number(body.guruId) 
      },
      include: { guru: true }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT /api/mapel error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Mapel tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Mapel sudah terdaftar" },
        { status: 400 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gagal mengubah mapel" },
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

    await prisma.matpel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/mapel error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Mapel tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus mapel" },
      { status: 500 }
    );
  }
}
