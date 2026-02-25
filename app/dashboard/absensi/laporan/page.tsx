// app/dashboard/absensi/laporan/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Download, Calendar, FileText } from 'lucide-react';

interface LaporanData {
  periode: {
    bulan: number;
    tahun: number;
    namaBulan: string;
    hariKerja: number;
  };
  totalStatistik: {
    totalGuru: number;
    totalHariKerja: number;
    totalHadir: number;
    totalSakit: number;
    totalIzin: number;
    totalAlpa: number;
    rataRataKehadiran: number;
  };
  dataGuru: Array<{
    guru: {
      id: number;
      nama: string;
      nip: string;
    };
    statistik: {
      totalHariKerja: number;
      hadir: number;
      sakit: number;
      izin: number;
      alpa: number;
      persentaseKehadiran: number;
    };
  }>;
}

export default function LaporanAbsensiPage() {
  const now = new Date();
  const [selectedBulan, setSelectedBulan] = useState(now.getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(now.getFullYear());
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Generate tahun options (5 tahun ke belakang sampai tahun sekarang)
  const tahunOptions = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  const handleGenerateLaporan = async () => {
    setLoading(true);
    try {
      const bulanFormatted = `${selectedTahun}-${String(selectedBulan).padStart(2, '0')}`;
      const res = await fetch(`/api/absensi/laporan?bulan=${bulanFormatted}`);
      const data = await res.json();
      
      if (res.ok) {
        setLaporan(data);
      } else {
        alert(data.error || 'Gagal membuat laporan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat membuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Refresh untuk restore state
    }
  };

  const getStatusColor = (persentase: number) => {
    if (persentase >= 90) return 'text-green-600 font-semibold';
    if (persentase >= 75) return 'text-blue-600 font-semibold';
    if (persentase >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText size={32} className="text-indigo-600" />
          Laporan Absensi Bulanan
        </h1>
        <p className="text-gray-600 mt-2">
          Generate dan cetak laporan absensi guru per bulan
        </p>
      </div>

      {/* Filter Section */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Bulan
            </label>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {namaBulan.map((nama, index) => (
                <option key={index + 1} value={index + 1}>
                  {nama}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tahun
            </label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {tahunOptions.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleGenerateLaporan}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
          >
            {loading ? 'Membuat...' : 'Generate Laporan'}
          </Button>
          {laporan && (
            <Button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center gap-2"
            >
              <Printer size={18} />
              Cetak
            </Button>
          )}
        </div>
      </Card>

      {/* Laporan Preview */}
      {laporan && (
        <div ref={printRef}>
          {/* Print Styles */}
          <style jsx>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-area, .print-area * {
                visibility: visible;
              }
              .print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
              @page {
                margin: 1cm;
              }
            }
          `}</style>

          <div className="print-area bg-white p-8 rounded-lg shadow-lg">
            {/* Header Laporan */}
            <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                LAPORAN ABSENSI GURU
              </h2>
              <h3 className="text-xl text-gray-700 mb-1">
                Bulan {laporan.periode.namaBulan} {laporan.periode.tahun}
              </h3>
              <p className="text-sm text-gray-600">
                Sistem Penjadwalan Guru
              </p>
            </div>

            {/* Summary Statistik */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Ringkasan Statistik
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Guru</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {laporan.totalStatistik.totalGuru}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Hari Kerja</p>
                  <p className="text-2xl font-bold text-green-600">
                    {laporan.totalStatistik.totalHariKerja}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Hadir</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {laporan.totalStatistik.totalHadir}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Rata-rata Kehadiran</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {laporan.totalStatistik.rataRataKehadiran}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Sakit</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {laporan.totalStatistik.totalSakit}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Izin</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {laporan.totalStatistik.totalIzin}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Alpa</p>
                  <p className="text-2xl font-bold text-red-600">
                    {laporan.totalStatistik.totalAlpa}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabel Detail per Guru */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Detail Absensi per Guru
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                        No
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                        Nama Guru
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                        NIP
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Hadir
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Sakit
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Izin
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Alpa
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Kehadiran
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporan.dataGuru.map((data, index) => (
                      <tr key={data.guru.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {data.guru.nama}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {data.guru.nip}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.hadir}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.sakit}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.izin}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.alpa}
                        </td>
                        <td className={`border border-gray-300 px-4 py-3 text-center text-sm ${getStatusColor(data.statistik.persentaseKehadiran)}`}>
                          {data.statistik.persentaseKehadiran}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex justify-between items-start gap-8 text-sm text-gray-600">
                <p>
                  Dicetak pada: {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <div className="text-center min-w-[220px]">
                  <p>................, {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}</p>
                  <p className="mt-1">Kepala Sekolah,</p>
                  <p className="mt-16 font-medium">(_________________________)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!laporan && !loading && (
        <Card className="p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Laporan
          </h3>
          <p className="text-gray-600">
            Pilih bulan dan klik "Generate Laporan" untuk melihat data
          </p>
        </Card>
      )}
    </div>
  );
}
