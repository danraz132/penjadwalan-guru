// app/api/guru-pengganti/laporan/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get('bulan'); // Format: YYYY-MM

    if (!bulan) {
      return NextResponse.json(
        { error: 'Parameter bulan (YYYY-MM) diperlukan' },
        { status: 400 }
      );
    }

    // Parse bulan dan tahun
    const [tahun, bulanNum] = bulan.split('-').map(Number);
    
    // Hitung tanggal awal dan akhir bulan
    const startDate = new Date(tahun, bulanNum - 1, 1);
    const endDate = new Date(tahun, bulanNum, 0, 23, 59, 59);

    // Ambil data guru pengganti
    const guruPenggantiData = await prisma.guruPengganti.findMany({
      where: {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        guruAsli: true,
        guruPengganti: true,
        jadwal: {
          include: {
            kelas: true,
            matpel: true,
            ruangan: true,
          },
        },
        absensi: true,
      },
      orderBy: [
        { tanggal: 'asc' },
        { guruPengganti: { nama: 'asc' } },
      ],
    });

    // Ambil semua guru yang pernah menjadi pengganti
    const guruPenggantiIds = [...new Set(guruPenggantiData.map(gp => gp.guruPenggantiId))];
    const allGuruPengganti = await prisma.guru.findMany({
      where: {
        id: {
          in: guruPenggantiIds,
        },
      },
      orderBy: { nama: 'asc' },
    });

    // Group data by guru pengganti
    const laporanByGuru = allGuruPengganti.map((guru) => {
      const dataGuru = guruPenggantiData.filter((gp) => gp.guruPenggantiId === guru.id);
      
      // Hitung statistik per status
      const menunggu = dataGuru.filter((gp) => gp.status === 'Menunggu').length;
      const diterima = dataGuru.filter((gp) => gp.status === 'Diterima').length;
      const ditolak = dataGuru.filter((gp) => gp.status === 'Ditolak').length;
      const selesai = dataGuru.filter((gp) => gp.status === 'Selesai').length;
      
      const totalPermintaan = dataGuru.length;
      const totalBertugas = diterima + selesai;
      
      // Hitung persentase penerimaan
      const persentasePenerimaan = totalPermintaan > 0 
        ? ((totalBertugas / totalPermintaan) * 100).toFixed(1) 
        : '0.0';

      // Group detail penggantian by mata pelajaran
      const mapelCount: { [key: string]: number } = {};
      dataGuru.forEach((gp) => {
        const mapelNama = gp.jadwal.matpel.nama;
        mapelCount[mapelNama] = (mapelCount[mapelNama] || 0) + 1;
      });

      return {
        guru: {
          id: guru.id,
          nama: guru.nama,
          nip: guru.nip,
        },
        statistik: {
          totalPermintaan,
          menunggu,
          diterima,
          ditolak,
          selesai,
          totalBertugas,
          persentasePenerimaan: parseFloat(persentasePenerimaan),
        },
        mapelDiajar: mapelCount,
        detailPenggantian: dataGuru.map((gp) => ({
          tanggal: gp.tanggal,
          status: gp.status,
          guruAsli: gp.guruAsli.nama,
          kelas: gp.jadwal.kelas.nama,
          matpel: gp.jadwal.matpel.nama,
          jamMulai: gp.jadwal.jamMulai,
          jamSelesai: gp.jadwal.jamSelesai,
          catatan: gp.catatan,
        })),
      };
    });

    // Hitung total statistik
    const totalStatistik = {
      totalGuruPengganti: allGuruPengganti.length,
      totalPermintaan: guruPenggantiData.length,
      totalMenunggu: guruPenggantiData.filter((gp) => gp.status === 'Menunggu').length,
      totalDiterima: guruPenggantiData.filter((gp) => gp.status === 'Diterima').length,
      totalDitolak: guruPenggantiData.filter((gp) => gp.status === 'Ditolak').length,
      totalSelesai: guruPenggantiData.filter((gp) => gp.status === 'Selesai').length,
    };

    // Guru yang paling sering menggantikan
    const topGuruPengganti = laporanByGuru
      .sort((a, b) => b.statistik.totalBertugas - a.statistik.totalBertugas)
      .slice(0, 5);

    // Mata pelajaran yang paling sering digantikan
    const mapelCount: { [key: string]: number } = {};
    guruPenggantiData.forEach((gp) => {
      const mapelNama = gp.jadwal.matpel.nama;
      mapelCount[mapelNama] = (mapelCount[mapelNama] || 0) + 1;
    });

    const topMapel = Object.entries(mapelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nama, jumlah]) => ({ nama, jumlah }));

    return NextResponse.json({
      periode: {
        bulan: bulanNum,
        tahun,
        namaBulan: new Date(tahun, bulanNum - 1).toLocaleString('id-ID', { month: 'long' }),
        startDate,
        endDate,
      },
      totalStatistik,
      topGuruPengganti,
      topMapel,
      dataGuru: laporanByGuru,
    });
  } catch (error) {
    console.error('Error generating laporan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat laporan' },
      { status: 500 }
    );
  }
}
