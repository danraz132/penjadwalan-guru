import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const jadwal = await prisma.jadwal.findMany({
      include: { guru: true, kelas: true, matpel: true, ruangan: true },
    })
    return NextResponse.json(jadwal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jadwal' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const jadwal = await prisma.jadwal.create({
      data: body,
      include: { guru: true, kelas: true, matpel: true, ruangan: true },
    })
    return NextResponse.json(jadwal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create jadwal' }, { status: 500 })
  }
}
