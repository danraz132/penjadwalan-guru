// app/dashboard/guru-pengganti/laporan/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Calendar, FileText, TrendingUp } from 'lucide-react';

interface LaporanData {
  periode: {
    bulan: number;
    tahun: number;
    namaBulan: string;
  };
  totalStatistik: {
    totalGuruPengganti: number;
    totalPermintaan: number;
    totalMenunggu: number;
    totalDiterima: number;
    totalDitolak: number;
    totalSelesai: number;
  };
  topGuruPengganti: Array<{
    guru: {
      nama: string;
      nip: string;
    };
    statistik: {
      totalBertugas: number;
      persentasePenerimaan: number;
    };
  }>;
  topMapel: Array<{
    nama: string;
    jumlah: number;
  }>;
  dataGuru: Array<{
    guru: {
      id: number;
      nama: string;
      nip: string;
    };
    statistik: {
      totalPermintaan: number;
      menunggu: number;
      diterima: number;
      ditolak: number;
      selesai: number;
      totalBertugas: number;
      persentasePenerimaan: number;
    };
    mapelDiajar: { [key: string]: number };
  }>;
}

export default function LaporanGuruPenggantiPage() {
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

  const tahunOptions = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  const handleGenerateLaporan = async () => {
    setLoading(true);
    try {
      const bulanFormatted = `${selectedTahun}-${String(selectedBulan).padStart(2, '0')}`;
      const res = await fetch(`/api/guru-pengganti/laporan?bulan=${bulanFormatted}`);
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
      window.location.reload();
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
          Laporan Guru Pengganti Bulanan
        </h1>
        <p className="text-gray-600 mt-2">
          Generate dan cetak laporan guru pengganti per bulan
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
                LAPORAN GURU PENGGANTI
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Guru Pengganti</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {laporan.totalStatistik.totalGuruPengganti}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Permintaan</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {laporan.totalStatistik.totalPermintaan}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Diterima</p>
                  <p className="text-2xl font-bold text-green-600">
                    {laporan.totalStatistik.totalDiterima}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {laporan.totalStatistik.totalSelesai}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {laporan.totalStatistik.totalMenunggu}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">
                    {laporan.totalStatistik.totalDitolak}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            {laporan.topGuruPengganti.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-600" />
                  Top 5 Guru Pengganti Teraktif
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                          Peringkat
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                          Nama Guru
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                          NIP
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                          Total Bertugas
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                          Tingkat Penerimaan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporan.topGuruPengganti.map((data, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                              {index + 1}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm">
                            {data.guru.nama}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm">
                            {data.guru.nip}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-green-600">
                            {data.statistik.totalBertugas}x
                          </td>
                          <td className={`border border-gray-300 px-4 py-3 text-center text-sm ${getStatusColor(data.statistik.persentasePenerimaan)}`}>
                            {data.statistik.persentasePenerimaan}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Mata Pelajaran */}
            {laporan.topMapel.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  Mata Pelajaran yang Sering Digantikan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laporan.topMapel.map((mapel, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium">{mapel.nama}</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
                        {mapel.jumlah}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabel Detail per Guru */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Detail per Guru Pengganti
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
                        Total Permintaan
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Diterima
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Selesai
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Ditolak
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Total Bertugas
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                        Tingkat Penerimaan
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
                          {data.statistik.totalPermintaan}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.diterima}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.selesai}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {data.statistik.ditolak}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-green-600">
                          {data.statistik.totalBertugas}
                        </td>
                        <td className={`border border-gray-300 px-4 py-3 text-center text-sm ${getStatusColor(data.statistik.persentasePenerimaan)}`}>
                          {data.statistik.persentasePenerimaan}%
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
