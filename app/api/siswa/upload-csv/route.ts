import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Data CSV tidak valid atau kosong" },
        { status: 400 }
      );
    }

    // Validasi format data
    const validationErrors: string[] = [];
    const validData: any[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // +2 karena index 0 dan header di row 1

      // Validasi field required
      if (!row.nama || !row.nis || !row.kelas) {
        validationErrors.push(`Baris ${rowNum}: Nama, NIS, dan Kelas harus diisi`);
        continue;
      }

      // Cari kelas berdasarkan nama
      const kelas = await prisma.kelas.findFirst({
        where: {
          nama: row.kelas.trim()
        }
      });

      if (!kelas) {
        validationErrors.push(`Baris ${rowNum}: Kelas "${row.kelas}" tidak ditemukan`);
        continue;
      }

      // Cek apakah NIS sudah ada
      const existingSiswa = await prisma.siswa.findUnique({
        where: { nis: row.nis.trim() }
      });

      if (existingSiswa) {
        validationErrors.push(`Baris ${rowNum}: NIS "${row.nis}" sudah terdaftar`);
        continue;
      }

      validData.push({
        nama: row.nama.trim(),
        nis: row.nis.trim(),
        kelasId: kelas.id
      });
    }

    // Jika ada error validasi, kembalikan error
    if (validationErrors.length > 0 && validData.length === 0) {
      return NextResponse.json(
        { 
          error: "Semua data gagal divalidasi", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Insert data yang valid
    let successCount = 0;
    let failCount = 0;
    const insertErrors: string[] = [];

    for (const siswaData of validData) {
      try {
        await prisma.siswa.create({ data: siswaData });
        successCount++;
      } catch (error: any) {
        failCount++;
        insertErrors.push(`Gagal menyimpan ${siswaData.nama}: ${error.message}`);
      }
    }

    const response: any = {
      message: `Berhasil mengupload ${successCount} siswa`,
      successCount,
      failCount,
      totalProcessed: data.length
    };

    if (validationErrors.length > 0) {
      response.validationErrors = validationErrors;
    }

    if (insertErrors.length > 0) {
      response.insertErrors = insertErrors;
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/siswa/upload-csv error:", error);
    return NextResponse.json(
      { error: "Gagal memproses file CSV: " + error.message },
      { status: 500 }
    );
  }
}
