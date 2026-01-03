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

  async function fetchData() {
    const [mapelRes] = await Promise.all([
      fetch("/api/mapel"),

    ]);
    setMapel(await mapelRes.json());

  }

  useEffect(() => { fetchData(); }, []);

  async function saveMapel(e: any) {
    e.preventDefault();
    await fetch("/api/mapel", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, guruId: Number(form.guruId) }),
    });
    setOpen(false);
    fetchData();
  }

  async function deleteMapel(id: number) {
    await fetch(`/api/mapel?id=${id}`, { method: "DELETE" });
    fetchData();
  }

  const filteredMapel = mapel.filter((m) =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.guru?.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📘 Data Mata Pelajaran</h1>
        <button
          onClick={() => { setForm({ id: 0, nama: "", jamPerMinggu: "", guruId: 0 }); setOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle size={18} /> Tambah Mapel
        </button>
      </div>

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
      data={filteredMapel.map((m) => ({ Nama: m.nama, Guru: m.guru?.nama, "Jam/Minggu": m.jamPerMinggu }))}
      actions={(m: any) => (
        <div className="flex justify-center gap-3">
          <button onClick={() => { setForm(m); setOpen(true); }} className="text-blue-600 hover:scale-110 transition">
            <Pencil size={18} />
          </button>
          <button onClick={() => deleteMapel(m.id)} className="text-red-600 hover:scale-110 transition">
            <Trash2 size={18} />
          </button>
        </div>
      )}/>
    


      {open && (
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Mapel">
          <form onSubmit={saveMapel} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Mapel"
              className="border p-2 w-full rounded"
            />
            <input
              value={form.jamPerMinggu}
              onChange={(e) => setForm({ ...form, jamPerMinggu: e.target.value })}
              placeholder="Jam per Minggu"
              className="border p-2 w-full rounded"
            />
            <select
              value={form.guruId}
              onChange={(e) => setForm({ ...form, guruId: Number(e.target.value) })}
              className="border p-2 w-full rounded"
            >
              <option value={0}>Pilih Guru</option>
              {guru.map((g) => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>
            <button className="bg-indigo-600 text-white w-full py-2 rounded">Simpan</button>
          </form>
        </ModalForm>
      )}
    </main>
  );
}
