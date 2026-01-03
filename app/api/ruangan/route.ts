import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json(await prisma.ruangan.findMany())
}

export async function POST(req: Request) {
  const body = await req.json()
  const ruangan = await prisma.ruangan.create({ data: body })
  return NextResponse.json(ruangan)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const ruangan = await prisma.ruangan.update({
    where: { id: body.id },
    data: { nama: body.nama, kapasitas: body.kapasitas },
  })
  return NextResponse.json(ruangan)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get('id'))
  await prisma.ruangan.delete({ where: { id } })
  return NextResponse.json({ success: true })
}