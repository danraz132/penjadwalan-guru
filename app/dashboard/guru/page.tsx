"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import ModalForm from "@/components/ModalForm";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function GuruPage() {
  const [guru, setGuru] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", nip: "" });
  const [search, setSearch] = useState("");
  const [selectedGuru, setSelectedGuru] = useState<any>(null);
  const [mapelGuru, setMapelGuru] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    guruId: 0,
    guruNama: "",
  });

  async function fetchGuru() {
    try {
      const res = await fetch("/api/guru");
      if (!res.ok) throw new Error("Gagal mengambil data guru");
      setGuru(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  useEffect(() => {
    fetchGuru();
  }, []);

  async function saveGuru(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const method = form.id > 0 ? "PUT" : "POST";
      const payload =
        method === "PUT"
          ? { id: Number(form.id), nama: form.nama, nip: form.nip }
          : { nama: form.nama, nip: form.nip };

      const response = await fetch("/api/guru", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan guru");
      }

      setMessage(form.id > 0 ? "✅ Guru berhasil diperbarui" : "✅ Guru berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", nip: "" });
      fetchGuru();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(guruItem: any) {
    setDeleteModal({
      open: true,
      guruId: Number(guruItem.id),
      guruNama: String(guruItem.nama || ""),
    });
  }

  function closeDeleteModal() {
    setDeleteModal({ open: false, guruId: 0, guruNama: "" });
  }

  async function submitDeleteGuru() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/guru?id=${deleteModal.guruId}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus guru");
      }

      setMessage("✅ Guru berhasil dihapus");
      closeDeleteModal();
      fetchGuru();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function deleteGuru(id: number) {
    const selectedGuru = guru.find((item) => Number(item.id) === Number(id));
    if (!selectedGuru) {
      setMessage("❌ Error: Data guru tidak ditemukan.");
      return;
    }

    openDeleteModal(selectedGuru);
  }

  const filteredGuru = guru.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.nip.toLowerCase().includes(search.toLowerCase())
  );

  async function viewMapel(g: any) {
    setSelectedGuru(g);
    try {
      const res = await fetch(`/api/guru/${g.id}/mapel`);
      if (!res.ok) throw new Error("Gagal mengambil data mapel");
      setMapelGuru(await res.json());
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  }

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">👩‍🏫 Data Guru</h1>
        <Button onClick={() => { setForm({ id: 0, nama: "", nip: "" }); setMessage(""); setOpen(true); }}>
          <PlusCircle size={18} /> Tambah Guru
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
          placeholder="🔍 Cari berdasarkan nama atau NIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded focus:ring focus:ring-indigo-200"
        />
      </div>

      <TableCard
        title="Daftar Guru"
        columns={["Nama", "NIP"]}
        data={filteredGuru.map((g) => ({ Nama: g.nama, NIP: g.nip, _rawData: g }))}
        actions={(row: any) => (
          <div className="flex justify-center gap-3">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                viewMapel(row._rawData);
              }} 
              className="text-green-600 hover:scale-110 transition"
              title="Lihat Mapel"
              type="button"
            >
              📚
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const guruData = row._rawData;
                setForm({
                  id: Number(guruData.id),
                  nama: String(guruData.nama),
                  nip: String(guruData.nip),
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
                deleteGuru(row._rawData.id);
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
        <ModalForm open={open} onClose={() => setOpen(false)} title="Form Guru">
          <form onSubmit={saveGuru} className="space-y-3">
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Guru"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
              placeholder="NIP"
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
          title="Konfirmasi Hapus Guru"
        >
          <div className="space-y-4">
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm">
              Anda akan menghapus guru <b>{deleteModal.guruNama || "ini"}</b>. Lanjutkan?
            </div>
            <p className="text-sm text-gray-600">
              Data guru yang dihapus tidak dapat dikembalikan.
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
                onClick={submitDeleteGuru}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Hapus Guru"}
              </button>
            </div>
          </div>
        </ModalForm>
      )}

      {selectedGuru && (
        <ModalForm open={!!selectedGuru} onClose={() => setSelectedGuru(null)} title={`Mata Pelajaran - ${selectedGuru.nama}`}>
          <div className="space-y-3">
            {mapelGuru.length > 0 ? (
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Nama Mapel</th>
                    <th className="border p-2">Jam/Minggu</th>
                  </tr>
                </thead>
                <tbody>
                  {mapelGuru.map((m) => (
                    <tr key={m.id}>
                      <td className="border p-2">{m.nama}</td>
                      <td className="border p-2 text-center">{m.jamPerMinggu} jam</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">Guru ini belum mengajar mata pelajaran apapun</p>
            )}
          </div>
        </ModalForm>
      )}
    </main>
  );
}
