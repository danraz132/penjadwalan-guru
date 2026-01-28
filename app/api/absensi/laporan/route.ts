// app/api/absensi/laporan/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get('bulan'); // Format: YYYY-MM
    const guruId = searchParams.get('guruId'); // Optional: filter by specific guru

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

    // Build query conditions
    const whereConditions: any = {
      tanggal: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (guruId) {
      whereConditions.guruId = parseInt(guruId);
    }

    // Ambil data absensi
    const absensiData = await prisma.absensiGuru.findMany({
      where: whereConditions,
      include: {
        guru: true,
      },
      orderBy: [
        { guru: { nama: 'asc' } },
        { tanggal: 'asc' },
      ],
    });

    // Ambil semua guru untuk summary
    const guruWhere = guruId ? { id: parseInt(guruId) } : {};
    const allGuru = await prisma.guru.findMany({
      where: guruWhere,
      orderBy: { nama: 'asc' },
    });

    // Hitung jumlah hari kerja dalam bulan (Senin-Jumat)
    const hariKerja = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Bukan Minggu (0) atau Sabtu (6)
        hariKerja.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    // Group absensi by guru
    const absensiByGuru = allGuru.map((guru) => {
      const guruAbsensi = absensiData.filter((a) => a.guruId === guru.id);
      
      // Hitung statistik
      const hadir = guruAbsensi.filter((a) => a.status === 'Hadir').length;
      const sakit = guruAbsensi.filter((a) => a.status === 'Sakit').length;
      const izin = guruAbsensi.filter((a) => a.status === 'Izin').length;
      const alpa = guruAbsensi.filter((a) => a.status === 'Alpa').length;
      
      // Hitung persentase kehadiran
      const totalHari = hariKerja.length;
      const persentaseKehadiran = totalHari > 0 
        ? ((hadir / totalHari) * 100).toFixed(1) 
        : '0.0';

      return {
        guru: {
          id: guru.id,
          nama: guru.nama,
          nip: guru.nip,
        },
        statistik: {
          totalHariKerja: totalHari,
          hadir,
          sakit,
          izin,
          alpa,
          persentaseKehadiran: parseFloat(persentaseKehadiran),
        },
        detailAbsensi: guruAbsensi.map((a) => ({
          tanggal: a.tanggal,
          status: a.status,
          keterangan: a.keterangan,
        })),
      };
    });

    // Hitung total statistik
    const totalStatistik = {
      totalGuru: allGuru.length,
      totalHariKerja: hariKerja.length,
      totalHadir: absensiByGuru.reduce((sum, g) => sum + g.statistik.hadir, 0),
      totalSakit: absensiByGuru.reduce((sum, g) => sum + g.statistik.sakit, 0),
      totalIzin: absensiByGuru.reduce((sum, g) => sum + g.statistik.izin, 0),
      totalAlpa: absensiByGuru.reduce((sum, g) => sum + g.statistik.alpa, 0),
    };

    // Hitung rata-rata kehadiran
    const avgKehadiran = absensiByGuru.length > 0
      ? absensiByGuru.reduce((sum, g) => sum + g.statistik.persentaseKehadiran, 0) / absensiByGuru.length
      : 0;

    return NextResponse.json({
      periode: {
        bulan: bulanNum,
        tahun,
        namaBulan: new Date(tahun, bulanNum - 1).toLocaleString('id-ID', { month: 'long' }),
        startDate,
        endDate,
        hariKerja: hariKerja.length,
      },
      totalStatistik: {
        ...totalStatistik,
        rataRataKehadiran: parseFloat(avgKehadiran.toFixed(1)),
      },
      dataGuru: absensiByGuru,
    });
  } catch (error) {
    console.error('Error generating laporan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat laporan' },
      { status: 500 }
    );
  }
}
