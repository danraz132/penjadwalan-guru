"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import ModalForm from "@/components/ModalForm";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function RuanganPage() {
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", kapasitas: 0 });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    ruanganId: 0,
    ruanganNama: "",
  });

  async function fetchRuangan() {
    try {
      const res = await fetch("/api/ruangan");
      if (!res.ok) throw new Error("Gagal mengambil data ruangan");
      setRuangan(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  useEffect(() => {
    fetchRuangan();
  }, []);

  async function saveRuangan(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        id: Number(form.id),
        nama: form.nama,
        kapasitas: Number(form.kapasitas),
      };

      const response = await fetch("/api/ruangan", {
        method: form.id > 0 ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan ruangan");
      }

      setMessage(form.id > 0 ? "✅ Ruangan berhasil diperbarui" : "✅ Ruangan berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", kapasitas: 0 });
      fetchRuangan();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(ruanganItem: any) {
    setDeleteModal({
      open: true,
      ruanganId: Number(ruanganItem.id),
      ruanganNama: String(ruanganItem.nama || ""),
    });
  }

  function closeDeleteModal() {
    setDeleteModal({ open: false, ruanganId: 0, ruanganNama: "" });
  }

  async function submitDeleteRuangan() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/ruangan?id=${deleteModal.ruanganId}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus ruangan");
      }

      setMessage("✅ Ruangan berhasil dihapus");
      closeDeleteModal();
      fetchRuangan();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function deleteRuangan(id: number) {
    const selectedRuangan = ruangan.find((item) => Number(item.id) === Number(id));
    if (!selectedRuangan) {
      setMessage("❌ Error: Data ruangan tidak ditemukan.");
      return;
    }

    openDeleteModal(selectedRuangan);
  }

  const filteredRuangan = ruangan.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🏫 Data Ruangan</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", kapasitas: 0 }); setMessage(""); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Ruangan
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
          placeholder="🔍 Cari berdasarkan nama ruangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard
        title="Daftar Ruangan"
        columns={["Nama", "Kapasitas"]}
        data={filteredRuangan.map((r) => ({ Nama: r.nama, Kapasitas: r.kapasitas, _rawData: r }))}
        actions={(row: any) => (
          <div className="flex justify-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const ruanganData = row._rawData;
                setForm({
                  id: Number(ruanganData.id),
                  nama: String(ruanganData.nama),
                  kapasitas: Number(ruanganData.kapasitas),
                });
                setOpen(true);
              }}
              className="text-blue-600 hover:scale-110 transition"
              type="button"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteRuangan(row._rawData.id);
              }}
              className="text-red-600 hover:scale-110 transition"
              disabled={loading}
              type="button"
            >
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
              value={form.kapasitas || ""}
              onChange={(e) => setForm({ ...form, kapasitas: Number(e.target.value) })}
              placeholder="Kapasitas"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <Button disabled={loading}>{form.id > 0 ? "Perbarui" : "Simpan"}</Button>
          </form>
        </ModalForm>
      )}

      {deleteModal.open && (
        <ModalForm
          open={deleteModal.open}
          onClose={() => {
            if (!loading) closeDeleteModal();
          }}
          title="Konfirmasi Hapus Ruangan"
        >
          <div className="space-y-4">
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm">
              Anda akan menghapus ruangan <b>{deleteModal.ruanganNama || "ini"}</b>. Lanjutkan?
            </div>
            <p className="text-sm text-gray-600">
              Data ruangan yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitDeleteRuangan}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Hapus Ruangan"}
              </button>
            </div>
          </div>
        </ModalForm>
      )}
    </main>
  );
}
