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
  const [form, setForm] = useState({ id: 0, nama: "", jamPerMinggu: 0, guruId: 0 });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    mapelId: 0,
    mapelNama: "",
  });

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
      const method = form.id > 0 ? "PUT" : "POST";
      const payload =
        method === "PUT"
          ? {
              id: Number(form.id),
              nama: form.nama,
              jamPerMinggu: Number(form.jamPerMinggu),
              guruId: Number(form.guruId),
            }
          : {
              nama: form.nama,
              jamPerMinggu: Number(form.jamPerMinggu),
              guruId: Number(form.guruId),
            };

      const response = await fetch("/api/mapel", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan mapel");
      }

      setMessage(form.id > 0 ? "✅ Mapel berhasil diperbarui" : "✅ Mapel berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", jamPerMinggu: 0, guruId: 0 });
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(mapelItem: any) {
    setDeleteModal({
      open: true,
      mapelId: Number(mapelItem.id),
      mapelNama: String(mapelItem.nama || ""),
    });
  }

  function closeDeleteModal() {
    setDeleteModal({ open: false, mapelId: 0, mapelNama: "" });
  }

  async function submitDeleteMapel() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/mapel?id=${deleteModal.mapelId}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus mapel");
      }

      setMessage("✅ Mapel berhasil dihapus");
      closeDeleteModal();
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function deleteMapel(id: number) {
    const selectedMapel = mapel.find((item) => Number(item.id) === Number(id));
    if (!selectedMapel) {
      setMessage("❌ Error: Data mapel tidak ditemukan.");
      return;
    }

    openDeleteModal(selectedMapel);
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
            setForm({ id: 0, nama: "", jamPerMinggu: 0, guruId: 0 });
            setMessage("");
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
          _rawData: m,
        }))}
        actions={(row: any) => (
          <div className="flex justify-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const mapelData = row._rawData;
                setForm({
                  id: Number(mapelData.id),
                  nama: String(mapelData.nama),
                  jamPerMinggu: Number(mapelData.jamPerMinggu),
                  guruId: Number(mapelData.guruId),
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
                deleteMapel(row._rawData.id);
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
              value={form.jamPerMinggu || ""}
              onChange={(e) =>
                setForm({ ...form, jamPerMinggu: Number(e.target.value) })
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
              {form.id > 0 ? "Perbarui" : "Simpan"}
            </Button>
          </form>
        </ModalForm>
      )}

      {deleteModal.open && (
        <ModalForm
          open={deleteModal.open}
          onClose={() => {
            if (!loading) closeDeleteModal();
          }}
          title="Konfirmasi Hapus Mata Pelajaran"
        >
          <div className="space-y-4">
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm">
              Anda akan menghapus mata pelajaran <b>{deleteModal.mapelNama || "ini"}</b>. Lanjutkan?
            </div>
            <p className="text-sm text-gray-600">
              Data mata pelajaran yang dihapus tidak dapat dikembalikan.
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
                onClick={submitDeleteMapel}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Hapus Mata Pelajaran"}
              </button>
            </div>
          </div>
        </ModalForm>
      )}
    </main>
  );
}
