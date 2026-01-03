import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.kelas.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.kelas.create({ data: body });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = await prisma.kelas.update({
    where: { id: body.id },
    data: { nama: body.nama, tingkat: body.tingkat },
  });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await prisma.kelas.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
