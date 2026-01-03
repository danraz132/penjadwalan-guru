import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.guru.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.guru.create({ data: body });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = await prisma.guru.update({
    where: { id: body.id },
    data: { nama: body.nama, nip: body.nip },
  });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await prisma.guru.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
