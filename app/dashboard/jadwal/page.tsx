"use client";

import { useState, useEffect } from "react";

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [guru, setGuru] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [matpel, setMatpel] = useState<any[]>([]);
  const [ruangan, setRuangan] = useState<any[]>([]);

  const [filterGuru, setFilterGuru] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterMatpel, setFilterMatpel] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [jadwalRes, guruRes, kelasRes, matpelRes, ruanganRes] =
          await Promise.all([
            fetch("/api/jadwal"),
            fetch("/api/guru"),
            fetch("/api/kelas"),
            fetch("/api/mapel"),
            fetch("/api/ruangan"),
          ]);

        setJadwal(await jadwalRes.json());
        setGuru(await guruRes.json());
        setKelas(await kelasRes.json());
        setMatpel(await matpelRes.json());
        setRuangan(await ruanganRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const filteredJadwal = jadwal.filter((j) => {
    if (filterGuru && j.guru?.id !== Number(filterGuru)) return false;
    if (filterKelas && j.kelas?.id !== Number(filterKelas)) return false;
    if (filterMatpel && j.matpel?.id !== Number(filterMatpel)) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        j.guru?.nama?.toLowerCase().includes(searchLower) ||
        j.kelas?.nama?.toLowerCase().includes(searchLower) ||
        j.matpel?.nama?.toLowerCase().includes(searchLower) ||
        j.ruangan?.nama?.toLowerCase().includes(searchLower) ||
        j.hari?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  async function addJadwal(formData: FormData) {
    const kelasId = Number(formData.get("kelasId"));
    const matpelId = Number(formData.get("matpelId"));
    const guruId = Number(formData.get("guruId"));
    const ruanganId = Number(formData.get("ruanganId"));
    const hari = formData.get("hari") as string;
    const jamMulai = formData.get("jamMulai") as string;
    const jamSelesai = formData.get("jamSelesai") as string;

    try {
      const res = await fetch("/api/jadwal", {
        method: "POST",
        body: JSON.stringify({
          kelasId,
          matpelId,
          guruId,
          ruanganId,
          hari,
          jamMulai,
          jamSelesai,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setJadwal([...jadwal, data]);
      }
    } catch (error) {
      console.error("Error adding jadwal:", error);
    }
  }

  async function generateJadwalOtomatis() {
    if (!confirm("Ini akan menghapus jadwal lama dan membuat jadwal baru otomatis. Lanjutkan?")) return;
    
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/jadwal/generate", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`✅ Jadwal berhasil dibuat! Total: ${data.totalJadwal} jadwal`);
        // Refresh data
        const jadwalRes = await fetch("/api/jadwal");
        setJadwal(await jadwalRes.json());
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Gagal membuat jadwal otomatis");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">🗓️ Jadwal Mengajar</h1>
        <button
          onClick={generateJadwalOtomatis}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "⏳ Generate..." : "🤖 Generate Otomatis"}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <form action={addJadwal} className="grid grid-cols-3 gap-4 mb-6">
        <select name="guruId" required className="border p-2 rounded">
          <option value="">-- Pilih Guru --</option>
          {guru.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nama}
            </option>
          ))}
        </select>

        <select name="kelasId" required className="border p-2 rounded">
          <option value="">-- Pilih Kelas --</option>
          {kelas.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </select>

        <select name="matpelId" required className="border p-2 rounded">
          <option value="">-- Pilih Mata Pelajaran --</option>
          {matpel.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nama}
            </option>
          ))}
        </select>

        <select name="ruanganId" required className="border p-2 rounded">
          <option value="">-- Pilih Ruangan --</option>
          {ruangan.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nama}
            </option>
          ))}
        </select>

        <select name="hari" required className="border p-2 rounded">
          <option value="">-- Pilih Hari --</option>
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <input
          type="time"
          name="jamMulai"
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="jamSelesai"
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white rounded p-2 col-span-3">
          Tambah Jadwal
        </button>
      </form>

      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <h2 className="text-lg font-semibold mb-3">🔍 Pencarian & Filter</h2>
        <input
          type="text"
          placeholder="🔍 Cari jadwal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-3 focus:ring focus:ring-indigo-200"
        />
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filterGuru}
            onChange={(e) => setFilterGuru(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Semua Guru --</option>
            {guru.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama}
              </option>
            ))}
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Semua Kelas --</option>
            {kelas.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>

          <select
            value={filterMatpel}
            onChange={(e) => setFilterMatpel(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Semua Mata Pelajaran --</option>
            {matpel.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Hari</th>
            <th>Guru</th>
            <th>Kelas</th>
            <th>Mata Pelajaran</th>
            <th>Ruangan</th>
            <th>Jam</th>
          </tr>
        </thead>
        <tbody>
          {filteredJadwal.map((j) => (
            <tr key={j.id} className="border-t">
              <td className="border p-2">{j.hari}</td>
              <td className="border p-2">{j.guru?.nama}</td>
              <td className="border p-2">{j.kelas?.nama}</td>
              <td className="border p-2">{j.matpel?.nama}</td>
              <td className="border p-2">{j.ruangan?.nama}</td>
              <td className="border p-2">
                {j.jamMulai} - {j.jamSelesai}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
