"use client";
import { useEffect, useState } from "react";
import ModalForm from "@/components/ModalForm";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function MapelPage() {
  const [mapel, setMapel] = useState<any[]>([]);
  const [guru, setGuru] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", jamPerMinggu: "", guruId: 0 });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      const [mapelRes, guruRes] = await Promise.all([
        fetch("/api/mapel"),
        fetch("/api/guru"),
      ]);

      if (!mapelRes.ok || !guruRes.ok) {
        throw new Error("Gagal mengambil data");
      }

      setMapel(await mapelRes.json());
      setGuru(await guruRes.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function saveMapel(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/mapel", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          jamPerMinggu: Number(form.jamPerMinggu),
          guruId: Number(form.guruId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan mapel");
      }

      setMessage(form.id ? "✅ Mapel berhasil diperbarui" : "✅ Mapel berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", jamPerMinggu: "", guruId: 0 });
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMapel(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus mapel ini?")) return;
    
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/mapel?id=${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus mapel");
      }

      setMessage("✅ Mapel berhasil dihapus");
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const filteredMapel = mapel.filter((m) =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.guru?.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📘 Data Mata Pelajaran</h1>
        <Button
          onClick={() => {
            setForm({ id: 0, nama: "", jamPerMinggu: "", guruId: 0 });
            setOpen(true);
          }}
        >
          <PlusCircle size={18} /> Tambah Mapel
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
          placeholder="🔍 Cari berdasarkan nama atau guru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard
        title="Daftar Mata Pelajaran"
        columns={["Nama", "Guru", "Jam/Minggu"]}
        data={filteredMapel.map((m) => ({
          Nama: m.nama,
          Guru: m.guru?.nama || "-",
          "Jam/Minggu": m.jamPerMinggu,
        }))}
        actions={(m: any) => (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setForm(m);
                setOpen(true);
              }}
              className="text-blue-600 hover:scale-110 transition"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => deleteMapel(m.id)}
              className="text-red-600 hover:scale-110 transition"
              disabled={loading}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      {open && (
        <ModalForm
          open={open}
          onClose={() => setOpen(false)}
          title="Form Mapel"
        >
          <form onSubmit={saveMapel} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Mapel"
              required
              className="border p-2 w-full rounded"
            />
            <input
              type="number"
              value={form.jamPerMinggu}
              onChange={(e) =>
                setForm({ ...form, jamPerMinggu: e.target.value })
              }
              placeholder="Jam per Minggu"
              required
              className="border p-2 w-full rounded"
            />
            <select
              value={form.guruId}
              onChange={(e) =>
                setForm({ ...form, guruId: Number(e.target.value) })
              }
              className="border p-2 w-full rounded"
              required
            >
              <option value={0}>Pilih Guru</option>
              {guru.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
            <Button disabled={loading}>
              {form.id ? "Perbarui" : "Simpan"}
            </Button>
          </form>
        </ModalForm>
      )}
    </main>
  );
}
