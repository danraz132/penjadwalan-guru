import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = Number(id);
    const mapel = await prisma.matpel.findMany({
      where: { guruId },
    });
    return NextResponse.json(mapel);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch mapel" },
      { status: 500 }
    );
  }
}
