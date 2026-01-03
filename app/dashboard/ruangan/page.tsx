"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import ModalForm from "@/components/ModalForm";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function RuanganPage() {
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", kapasitas: "" });
  const [search, setSearch] = useState("");

  async function fetchRuangan() {
    const res = await fetch("/api/ruangan");
    setRuangan(await res.json());
  }

  useEffect(() => { fetchRuangan(); }, []);

  async function saveRuangan(e: any) {
    e.preventDefault();
    await fetch("/api/ruangan", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, kapasitas: Number(form.kapasitas) }),
    });
    setOpen(false);
    fetchRuangan();
  }

  async function deleteRuangan(id: number) {
    await fetch(`/api/ruangan?id=${id}`, { method: "DELETE" });
    fetchRuangan();
  }

  const filteredRuangan = ruangan.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🏫 Data Ruangan</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", kapasitas: "" }); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Ruangan
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan nama ruangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard
        title="Daftar Ruangan"
        columns={["Nama", "Kapasitas"]}
        data={filteredRuangan.map((r) => ({ Nama: r.nama, Kapasitas: r.kapasitas }))}
        actions={(r: any) => (
          <div className="flex justify-center gap-3">
            <button onClick={() => { setForm(r); setOpen(true); }} className="text-blue-600 hover:scale-110 transition">
              <Pencil size={18} />
            </button>
            <button onClick={() => deleteRuangan(r.id)} className="text-red-600 hover:scale-110 transition">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      {open && (
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Ruangan">
          <form onSubmit={saveRuangan} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Ruangan"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              type="number"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              placeholder="Kapasitas"
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
