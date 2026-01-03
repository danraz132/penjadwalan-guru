"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalGuru: 0,
    totalKelas: 0,
    totalMapel: 0,
    totalRuangan: 0,
    totalJadwal: 0,
    guruWithoutMapel: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [guruRes, kelasRes, mapelRes, ruanganRes, jadwalRes] = await Promise.all([
          fetch("/api/guru"),
          fetch("/api/kelas"),
          fetch("/api/mapel"),
          fetch("/api/ruangan"),
          fetch("/api/jadwal"),
        ]);

        const guru = await guruRes.json();
        const kelas = await kelasRes.json();
        const mapel = await mapelRes.json();
        const ruangan = await ruanganRes.json();
        const jadwal = await jadwalRes.json();

        // Hitung guru yang tidak mengajar
        const guruIds = new Set(mapel.map((m: any) => m.guruId));
        const guruWithoutMapel = guru.filter((g: any) => !guruIds.has(g.id)).length;

        setStats({
          totalGuru: guru.length,
          totalKelas: kelas.length,
          totalMapel: mapel.length,
          totalRuangan: ruangan.length,
          totalJadwal: jadwal.length,
          guruWithoutMapel,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-8">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* Statistik Cards */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.totalGuru}</div>
          <div className="text-sm mt-2">👨‍🏫 Total Guru</div>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.totalKelas}</div>
          <div className="text-sm mt-2">📚 Total Kelas</div>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.totalMapel}</div>
          <div className="text-sm mt-2">📖 Total Mapel</div>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.totalRuangan}</div>
          <div className="text-sm mt-2">🏫 Total Ruangan</div>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.totalJadwal}</div>
          <div className="text-sm mt-2">🗓️ Total Jadwal</div>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl font-bold">{stats.guruWithoutMapel}</div>
          <div className="text-sm mt-2">⚠️ Guru Belum Ajar</div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">📈 Ringkasan Sistem</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Total Master Data</p>
            <p className="text-2xl font-bold">{stats.totalGuru + stats.totalKelas + stats.totalMapel + stats.totalRuangan}</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Jadwal Terjadwalkan</p>
            <p className="text-2xl font-bold">{stats.totalJadwal}</p>
          </div>
          {stats.guruWithoutMapel > 0 && (
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm text-gray-500">⚠️ Guru Belum Ajar</p>
              <p className="text-2xl font-bold text-red-600">{stats.guruWithoutMapel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">⚡ Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold mb-2">👨‍🏫 Kelola Guru</p>
            <p className="text-xs mb-3">Tambah, edit, atau lihat daftar guru dan mata pelajaran yang diajar.</p>
            <a href="/dashboard/guru" className="text-blue-600 hover:text-blue-800 font-semibold">Buka →</a>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="font-semibold mb-2">📚 Kelola Kelas</p>
            <p className="text-xs mb-3">Atur daftar kelas dan tingkat pendidikan di sekolah.</p>
            <a href="/dashboard/kelas" className="text-green-600 hover:text-green-800 font-semibold">Buka →</a>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="font-semibold mb-2">📖 Kelola Mata Pelajaran</p>
            <p className="text-xs mb-3">Tentukan mapel dan alokasi jam pelajaran per guru.</p>
            <a href="/dashboard/mapel" className="text-purple-600 hover:text-purple-800 font-semibold">Buka →</a>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="font-semibold mb-2">🏫 Kelola Ruangan</p>
            <p className="text-xs mb-3">Daftar ruangan kelas dengan kapasitas siswa.</p>
            <a href="/dashboard/ruangan" className="text-orange-600 hover:text-orange-800 font-semibold">Buka →</a>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 md:col-span-2">
            <p className="font-semibold mb-2">🗓️ Buat Jadwal</p>
            <p className="text-xs mb-3">Generate jadwal otomatis atau tambah jadwal secara manual tanpa ada tabrakan.</p>
            <a href="/dashboard/jadwal" className="text-red-600 hover:text-red-800 font-semibold">Buka →</a>
          </div>
        </div>
      </div>
    </main>
  );
}

