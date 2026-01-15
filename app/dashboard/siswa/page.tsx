"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import ModalForm from "@/components/ModalForm";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", nis: "", kelasId: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const filteredSiswa = siswa.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.toLowerCase().includes(search.toLowerCase()) ||
    s.kelas?.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 Data Siswa</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", nis: "", kelasId: "" }); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Siswa
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded ${message.startsWith("❌") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
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
    </main>
  );
}
