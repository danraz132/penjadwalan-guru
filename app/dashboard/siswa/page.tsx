"use client";
import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, PlusCircle, Upload, Download } from "lucide-react";
import ModalForm from "@/components/ModalForm";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";
import Papa from "papaparse";

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", nis: "", kelasId: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchSiswa() {
    try {
      const res = await fetch("/api/siswa");
      if (!res.ok) throw new Error("Gagal mengambil data siswa");
      setSiswa(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  async function fetchKelas() {
    try {
      const res = await fetch("/api/kelas");
      if (!res.ok) throw new Error("Gagal mengambil data kelas");
      setKelas(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  useEffect(() => {
    fetchSiswa();
    fetchKelas();
  }, []);

  async function saveSiswa(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/siswa", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan siswa");
      }

      setMessage(form.id ? "✅ Siswa berhasil diperbarui" : "✅ Siswa berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", nis: "", kelasId: "" });
      fetchSiswa();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSiswa(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/siswa?id=${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus siswa");
      }

      setMessage("✅ Siswa berhasil dihapus");
      fetchSiswa();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function downloadTemplateCSV() {
    const csvContent = "nama,nis,kelas\nJohn Doe,12345,X IPA 1\nJane Smith,12346,X IPA 2";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_siswa.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await fetch("/api/siswa/upload-csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: results.data }),
          });

          const result = await response.json();

          if (!response.ok) {
            let errorMessage = result.error || "Gagal mengupload CSV";
            if (result.details && Array.isArray(result.details)) {
              errorMessage += ":\n" + result.details.slice(0, 5).join("\n");
              if (result.details.length > 5) {
                errorMessage += `\n... dan ${result.details.length - 5} error lainnya`;
              }
            }
            throw new Error(errorMessage);
          }

          let successMessage = `✅ ${result.message}`;
          
          if (result.validationErrors && result.validationErrors.length > 0) {
            successMessage += `\n⚠️ ${result.validationErrors.length} baris gagal validasi`;
          }
          
          if (result.insertErrors && result.insertErrors.length > 0) {
            successMessage += `\n⚠️ ${result.insertErrors.length} gagal disimpan`;
          }

          setMessage(successMessage);
          setUploadModalOpen(false);
          fetchSiswa();
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          setMessage("❌ " + (error as Error).message);
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setMessage("❌ Error parsing CSV: " + error.message);
        setLoading(false);
      },
    });
  }

  const filteredSiswa = siswa.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.toLowerCase().includes(search.toLowerCase()) ||
    s.kelas?.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 Data Siswa</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload size={18} /> Upload CSV
          </Button>
          <Button onClick={() => { setForm({ id: 0, nama: "", nis: "", kelasId: "" }); setOpen(true); }}>
            <PlusCircle size={18} /> Tambah Siswa
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded whitespace-pre-line ${message.startsWith("❌") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan nama, NIS, atau kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard
        title="Daftar Siswa"
        columns={["Nama", "NIS", "Kelas"]}
        data={filteredSiswa.map((s) => ({ 
          Nama: s.nama, 
          NIS: s.nis,
          Kelas: s.kelas?.nama || "-"
        }))}
        actions={(s: any) => (
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => { 
                const siswaData = siswa.find(item => item.nama === s.Nama && item.nis === s.NIS);
                if (siswaData) {
                  setForm({
                    id: siswaData.id,
                    nama: siswaData.nama,
                    nis: siswaData.nis,
                    kelasId: siswaData.kelasId.toString()
                  });
                  setOpen(true);
                }
              }} 
              className="text-blue-600 hover:scale-110 transition"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => {
                const siswaData = siswa.find(item => item.nama === s.Nama && item.nis === s.NIS);
                if (siswaData) deleteSiswa(siswaData.id);
              }} 
              className="text-red-600 hover:scale-110 transition" 
              disabled={loading}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      {open && (
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Siswa">
          <form onSubmit={saveSiswa} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Siswa"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              value={form.nis}
              onChange={(e) => setForm({ ...form, nis: e.target.value })}
              placeholder="NIS"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <select
              value={form.kelasId}
              onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            >
              <option value="">Pilih Kelas</option>
              {kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
            <Button disabled={loading}>{form.id ? "Perbarui" : "Simpan"}</Button>
          </form>
        </ModalForm>
      )}

      {uploadModalOpen && (
        <ModalForm open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload CSV Siswa">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Format CSV:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>nama</strong>: Nama lengkap siswa</li>
                <li>• <strong>nis</strong>: Nomor Induk Siswa (harus unik)</li>
                <li>• <strong>kelas</strong>: Nama kelas (contoh: X IPA 1)</li>
              </ul>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={downloadTemplateCSV}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Download size={16} /> Download Template CSV
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih File CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none p-2"
              />
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-sm text-gray-600">Memproses file...</p>
              </div>
            )}
          </div>
        </ModalForm>
      )}
    </main>
  );
}
