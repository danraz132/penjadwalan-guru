"use client";
import { useEffect, useState } from "react";
import ModalForm from "@/components/ModalForm";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function KelasPage() {
  const [kelas, setKelas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", tingkat: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch("/api/kelas");
      if (!res.ok) throw new Error("Gagal mengambil data kelas");
      setKelas(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function saveKelas(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/kelas", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tingkat: Number(form.tingkat) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan kelas");
      }

      setMessage(form.id ? "✅ Kelas berhasil diperbarui" : "✅ Kelas berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", tingkat: "" });
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteKelas(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;
    
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/kelas?id=${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus kelas");
      }

      setMessage("✅ Kelas berhasil dihapus");
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const filteredKelas = kelas.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase()) ||
    k.tingkat.toString().includes(search.toLowerCase())
  );

  return (
    <main>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">📚 Data Kelas</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", tingkat: "" }); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Kelas
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded mb-4 ${message.startsWith("❌") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan nama atau tingkat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard 
        title="Daftar Kelas"
        columns={["Nama", "Tingkat"]}
        data={filteredKelas.map((k) => ({ Nama: k.nama, Tingkat: k.tingkat }))}
        actions={(k: any) => (
          <div className="flex justify-center gap-3">
            <button onClick={() => { setForm(k); setOpen(true); }} className="text-blue-600 hover:scale-110 transition">
              <Pencil size={18} />
            </button>
            <button onClick={() => deleteKelas(k.id)} className="text-red-600 hover:scale-110 transition" disabled={loading}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      {open && (
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Kelas">
          <form onSubmit={saveKelas} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Kelas"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              type="number"
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              placeholder="Tingkat"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <Button disabled={loading}>{form.id ? "Perbarui" : "Simpan"}</Button>
          </form>
        </ModalForm>
      )}
    </main>
  );
}

  return (
    <main>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">📚 Data Kelas</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", tingkat: "" }); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Kelas
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan nama atau tingkat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard 
        title="Daftar Kelas"
        columns={["Nama", "Tingkat"]}
        data={filteredKelas.map((k) => ({ Nama: k.nama, Tingkat: k.tingkat }))}
        actions={(k: any) => (
          <div className="flex justify-center gap-3">
            <button onClick={() => { setForm(k); setOpen(true); }} className="text-blue-600 hover:scale-110 transition">
              <Pencil size={18} />
            </button>
            <button onClick={() => deleteKelas(k.id)} className="text-red-600 hover:scale-110 transition">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      {open && (
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Kelas">
          <form onSubmit={saveKelas} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Kelas"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              placeholder="Tingkat"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <Button color="indigo">Simpan</Button>
          </form>
        </ModalForm>
      )}
    </main>
  );
}
