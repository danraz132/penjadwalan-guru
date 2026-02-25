"use client";

import { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printFilterGuru, setPrintFilterGuru] = useState("");
  const [printFilterKelas, setPrintFilterKelas] = useState("");
  const [printFilterMatpel, setPrintFilterMatpel] = useState("");
  const [printFilterRuangan, setPrintFilterRuangan] = useState("");
  const [printFilterHari, setPrintFilterHari] = useState("");
  const [printSearch, setPrintSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: "hari" | "guru" | "kelas" | "matpel" | "ruangan" | "jam";
    direction: "asc" | "desc";
  } | null>(null);

  const hariOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

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

  function handleSort(key: "hari" | "guru" | "kelas" | "matpel" | "ruangan" | "jam") {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }

      return {
        key,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  }

  const sortedJadwal = [...filteredJadwal].sort((a, b) => {
    if (!sortConfig) return 0;

    let valueA = "";
    let valueB = "";

    if (sortConfig.key === "hari") {
      valueA = a.hari || "";
      valueB = b.hari || "";
    } else if (sortConfig.key === "guru") {
      valueA = a.guru?.nama || "";
      valueB = b.guru?.nama || "";
    } else if (sortConfig.key === "kelas") {
      valueA = a.kelas?.nama || "";
      valueB = b.kelas?.nama || "";
    } else if (sortConfig.key === "matpel") {
      valueA = a.matpel?.nama || "";
      valueB = b.matpel?.nama || "";
    } else if (sortConfig.key === "ruangan") {
      valueA = a.ruangan?.nama || "";
      valueB = b.ruangan?.nama || "";
    } else if (sortConfig.key === "jam") {
      valueA = `${a.jamMulai || ""}-${a.jamSelesai || ""}`;
      valueB = `${b.jamMulai || ""}-${b.jamSelesai || ""}`;
    }

    const compareResult = valueA.localeCompare(valueB, "id", { numeric: true, sensitivity: "base" });
    return sortConfig.direction === "asc" ? compareResult : -compareResult;
  });

  function sortIndicator(key: "hari" | "guru" | "kelas" | "matpel" | "ruangan" | "jam") {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }

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

  function getPrintFilteredJadwal() {
    return sortedJadwal.filter((j) => {
      if (printFilterGuru && j.guru?.id !== Number(printFilterGuru)) return false;
      if (printFilterKelas && j.kelas?.id !== Number(printFilterKelas)) return false;
      if (printFilterMatpel && j.matpel?.id !== Number(printFilterMatpel)) return false;
      if (printFilterRuangan && j.ruangan?.id !== Number(printFilterRuangan)) return false;
      if (printFilterHari && j.hari !== printFilterHari) return false;

      if (printSearch.trim()) {
        const searchLower = printSearch.trim().toLowerCase();
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
  }

  function handleOpenPrintModal() {
    setPrintFilterGuru(filterGuru);
    setPrintFilterKelas(filterKelas);
    setPrintFilterMatpel(filterMatpel);
    setPrintSearch(search);
    setIsPrintModalOpen(true);
  }

  function escapeHtml(value: string) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function handlePrintJadwal() {
    const dataToPrint = getPrintFilteredJadwal();

    if (dataToPrint.length === 0) {
      setMessage("❌ Tidak ada data jadwal sesuai filter cetak");
      return;
    }

    const getSelectedName = (items: any[], selectedId: string, fallback = "Semua") => {
      if (!selectedId) return fallback;
      return items.find((item) => String(item.id) === selectedId)?.nama || fallback;
    };

    const filterLabels = [
      `Guru: ${getSelectedName(guru, printFilterGuru)}`,
      `Kelas: ${getSelectedName(kelas, printFilterKelas)}`,
      `Mata Pelajaran: ${getSelectedName(matpel, printFilterMatpel)}`,
      `Ruangan: ${getSelectedName(ruangan, printFilterRuangan)}`,
      `Hari: ${printFilterHari || "Semua"}`,
      `Kata Kunci: ${printSearch.trim() || "-"}`,
    ];

    const printedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const rowsHtml = dataToPrint
      .map(
        (j: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(j.hari || "-")}</td>
            <td>${escapeHtml(j.guru?.nama || "-")}</td>
            <td>${escapeHtml(j.kelas?.nama || "-")}</td>
            <td>${escapeHtml(j.matpel?.nama || "-")}</td>
            <td>${escapeHtml(j.ruangan?.nama || "-")}</td>
            <td>${escapeHtml(`${j.jamMulai || "-"} - ${j.jamSelesai || "-"}`)}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) {
      setMessage("❌ Gagal membuka jendela cetak. Izinkan pop-up browser.");
      return;
    }

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cetak Jadwal Mengajar</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 10px; }
            .header h1 { margin: 0; font-size: 22px; }
            .header p { margin: 4px 0 0 0; font-size: 13px; color: #4b5563; }
            .meta { margin-bottom: 12px; font-size: 13px; }
            .meta p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #9ca3af; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .summary { margin-top: 10px; font-size: 12px; color: #374151; }
            .signature { margin-top: 48px; display: flex; justify-content: flex-end; }
            .signature-box { text-align: center; width: 240px; font-size: 13px; }
            .signature-name { margin-top: 72px; font-weight: 600; }
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LAPORAN JADWAL MENGAJAR</h1>
            <p>Sistem Penjadwalan Guru</p>
          </div>

          <div class="meta">
            ${filterLabels.map((label) => `<p>${escapeHtml(label)}</p>`).join("")}
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Hari</th>
                <th>Guru</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Ruangan</th>
                <th>Jam</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <p class="summary">Total jadwal tercetak: ${dataToPrint.length}</p>

          <div class="signature">
            <div class="signature-box">
              <p>................, ${printedDate}</p>
              <p>Kepala Sekolah,</p>
              <p class="signature-name">(_________________________)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    setIsPrintModalOpen(false);
    setMessage(`✅ Cetak jadwal siap (${dataToPrint.length} data)`);
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">🗓️ Jadwal Mengajar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPrintModal}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded font-semibold transition inline-flex items-center gap-2"
          >
            <Printer size={16} /> Cetak Jadwal
          </button>
          <button
            onClick={generateJadwalOtomatis}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
          >
            {loading ? "⏳ Generate..." : "🤖 Generate Otomatis"}
          </button>
        </div>
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
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("hari")}>
                Hari {sortIndicator("hari")}
              </button>
            </th>
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("guru")}>
                Guru {sortIndicator("guru")}
              </button>
            </th>
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("kelas")}>
                Kelas {sortIndicator("kelas")}
              </button>
            </th>
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("matpel")}>
                Mata Pelajaran {sortIndicator("matpel")}
              </button>
            </th>
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("ruangan")}>
                Ruangan {sortIndicator("ruangan")}
              </button>
            </th>
            <th className="p-2">
              <button type="button" className="font-semibold" onClick={() => handleSort("jam")}>
                Jam {sortIndicator("jam")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedJadwal.map((j) => (
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

      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cetak Jadwal dengan Filter</DialogTitle>
            <DialogDescription>
              Pilih filter jadwal yang ingin dicetak.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
            <select
              value={printFilterGuru}
              onChange={(e) => setPrintFilterGuru(e.target.value)}
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
              value={printFilterKelas}
              onChange={(e) => setPrintFilterKelas(e.target.value)}
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
              value={printFilterMatpel}
              onChange={(e) => setPrintFilterMatpel(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Semua Mata Pelajaran --</option>
              {matpel.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>

            <select
              value={printFilterRuangan}
              onChange={(e) => setPrintFilterRuangan(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Semua Ruangan --</option>
              {ruangan.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama}
                </option>
              ))}
            </select>

            <select
              value={printFilterHari}
              onChange={(e) => setPrintFilterHari(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Semua Hari --</option>
              {hariOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={printSearch}
              onChange={(e) => setPrintSearch(e.target.value)}
              placeholder="Kata kunci"
              className="border p-2 rounded"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handlePrintJadwal}>Cetak Sekarang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
