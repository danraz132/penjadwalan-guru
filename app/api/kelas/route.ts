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
    
    console.log("POST /api/kelas received body:", body);

    if (!body.nama || !body.tingkat) {
      return NextResponse.json(
        { error: "Nama dan Tingkat harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.kelas.create({ 
      data: { nama: body.nama, tingkat: Number(body.tingkat) } 
    });
    
    console.log("POST /api/kelas success:", data);
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
    
    console.log("PUT /api/kelas received body:", body);
    console.log("Body ID type:", typeof body.id, "Value:", body.id);
    console.log("Body nama:", body.nama);
    console.log("Body tingkat:", body.tingkat);

    if (!body.id || !body.nama || !body.tingkat) {
      console.log("Validation failed - Missing fields");
      return NextResponse.json(
        { error: "ID, Nama dan Tingkat harus diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.kelas.update({
      where: { id: Number(body.id) },
      data: { nama: body.nama, tingkat: Number(body.tingkat) },
    });
    
    console.log("PUT /api/kelas success:", data);
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

    let deleteOptions: {
      force?: boolean;
      siswaAction?: "MOVE" | "DELETE";
      targetKelasId?: number;
    } = {};

    try {
      deleteOptions = await req.json();
    } catch {
      deleteOptions = {};
    }

    const forceDelete = deleteOptions.force === true;

    const [kelas, jumlahSiswa, jumlahJadwal, kelasLain] = await Promise.all([
      prisma.kelas.findUnique({ where: { id } }),
      prisma.siswa.count({ where: { kelasId: id } }),
      prisma.jadwal.count({ where: { kelasId: id } }),
      prisma.kelas.findMany({
        where: { id: { not: id } },
        select: { id: true, nama: true, tingkat: true },
        orderBy: [{ tingkat: "asc" }, { nama: "asc" }],
      }),
    ]);

    if (!kelas) {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    if (!forceDelete && (jumlahSiswa > 0 || jumlahJadwal > 0)) {
      const detail = [];
      if (jumlahSiswa > 0) detail.push(`${jumlahSiswa} siswa`);
      if (jumlahJadwal > 0) detail.push(`${jumlahJadwal} jadwal`);

      return NextResponse.json(
        {
          error: `Kelas tidak bisa dihapus karena masih digunakan oleh ${detail.join(
            " dan "
          )}. Hapus data terkait terlebih dahulu.`,
          requiresAction: true,
          dependencies: {
            siswaCount: jumlahSiswa,
            jadwalCount: jumlahJadwal,
          },
          availableTargetKelas: kelasLain,
        },
        { status: 409 }
      );
    }

    if (forceDelete) {
      if (jumlahSiswa > 0) {
        if (!deleteOptions.siswaAction) {
          return NextResponse.json(
            {
              error:
                "Pilih aksi untuk data siswa: pindahkan ke kelas lain atau hapus data siswa.",
            },
            { status: 400 }
          );
        }

        if (deleteOptions.siswaAction === "MOVE") {
          const targetKelasId = Number(deleteOptions.targetKelasId);
          if (!targetKelasId || targetKelasId === id) {
            return NextResponse.json(
              {
                error:
                  "Kelas tujuan tidak valid. Pilih kelas lain sebagai tujuan pemindahan siswa.",
              },
              { status: 400 }
            );
          }

          const targetKelas = await prisma.kelas.findUnique({
            where: { id: targetKelasId },
            select: { id: true },
          });

          if (!targetKelas) {
            return NextResponse.json(
              { error: "Kelas tujuan tidak ditemukan." },
              { status: 404 }
            );
          }
        }

        if (
          deleteOptions.siswaAction !== "MOVE" &&
          deleteOptions.siswaAction !== "DELETE"
        ) {
          return NextResponse.json(
            { error: "Aksi siswa tidak dikenali." },
            { status: 400 }
          );
        }
      }

      await prisma.$transaction(async (tx) => {
        if (jumlahSiswa > 0 && deleteOptions.siswaAction === "MOVE") {
          await tx.siswa.updateMany({
            where: { kelasId: id },
            data: { kelasId: Number(deleteOptions.targetKelasId) },
          });
        }

        if (jumlahSiswa > 0 && deleteOptions.siswaAction === "DELETE") {
          await tx.siswa.deleteMany({ where: { kelasId: id } });
        }

        const kelasJadwal = await tx.jadwal.findMany({
          where: { kelasId: id },
          select: { id: true },
        });

        const jadwalIds = kelasJadwal.map((item) => item.id);

        if (jadwalIds.length > 0) {
          await tx.guruPengganti.deleteMany({
            where: { jadwalId: { in: jadwalIds } },
          });
        }

        await tx.jadwal.deleteMany({ where: { kelasId: id } });
        await tx.kelas.delete({ where: { id } });
      });

      return NextResponse.json({
        success: true,
        message: "Kelas dan data terkait berhasil dihapus.",
      });
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
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Kelas tidak bisa dihapus karena masih memiliki data terkait (siswa/jadwal).",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}
