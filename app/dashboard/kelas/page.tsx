"use client";
import { useEffect, useState } from "react";
import ModalForm from "@/components/ModalForm";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/Button";

export default function KelasPage() {
  const [kelas, setKelas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, nama: "", tingkat: 0 });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    kelasId: number;
    kelasNama: string;
    stage: "confirm" | "options";
    siswaCount: number;
    jadwalCount: number;
    availableTargetKelas: { id: number; nama: string; tingkat: number }[];
    siswaAction: "MOVE" | "DELETE";
    targetKelasId: number;
  }>({
    open: false,
    kelasId: 0,
    kelasNama: "",
    stage: "confirm",
    siswaCount: 0,
    jadwalCount: 0,
    availableTargetKelas: [],
    siswaAction: "MOVE",
    targetKelasId: 0,
  });

  async function fetchData() {
    try {
      const res = await fetch("/api/kelas");
      if (!res.ok) throw new Error("Gagal mengambil data kelas");
      const data = await res.json();
      setKelas(data);
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
      const payload = { 
        id: Number(form.id), 
        nama: form.nama, 
        tingkat: Number(form.tingkat) 
      };
      
      const method = form.id > 0 ? "PUT" : "POST";
      
      const response = await fetch("/api/kelas", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Gagal menyimpan kelas");
      }

      setMessage(form.id > 0 ? "✅ Kelas berhasil diperbarui" : "✅ Kelas berhasil ditambahkan");
      setOpen(false);
      setForm({ id: 0, nama: "", tingkat: 0 });
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(kelasItem: any) {
    setDeleteModal({
      open: true,
      kelasId: Number(kelasItem.id),
      kelasNama: String(kelasItem.nama || ""),
      stage: "confirm",
      siswaCount: 0,
      jadwalCount: 0,
      availableTargetKelas: [],
      siswaAction: "MOVE",
      targetKelasId: 0,
    });
  }

  function closeDeleteModal() {
    setDeleteModal({
      open: false,
      kelasId: 0,
      kelasNama: "",
      stage: "confirm",
      siswaCount: 0,
      jadwalCount: 0,
      availableTargetKelas: [],
      siswaAction: "MOVE",
      targetKelasId: 0,
    });
  }

  async function submitDeleteKelas() {
    setLoading(true);
    setMessage("");

    try {
      if (deleteModal.stage === "confirm") {
        const response = await fetch(`/api/kelas?id=${deleteModal.kelasId}`, {
          method: "DELETE",
        });
        const responseData = await response.json();

        if (response.ok) {
          setMessage("✅ Kelas berhasil dihapus");
          closeDeleteModal();
          fetchData();
          return;
        }

        if (response.status === 409 && responseData?.requiresAction) {
          const dependencies = responseData.dependencies || {
            siswaCount: 0,
            jadwalCount: 0,
          };
          const availableTargetKelas = responseData.availableTargetKelas || [];

          const defaultTargetKelasId = availableTargetKelas[0]?.id || 0;
          const defaultSiswaAction: "MOVE" | "DELETE" =
            dependencies.siswaCount > 0 && availableTargetKelas.length === 0
              ? "DELETE"
              : "MOVE";

          setDeleteModal((prev) => ({
            ...prev,
            stage: "options",
            siswaCount: Number(dependencies.siswaCount || 0),
            jadwalCount: Number(dependencies.jadwalCount || 0),
            availableTargetKelas,
            siswaAction: defaultSiswaAction,
            targetKelasId: defaultTargetKelasId,
          }));
          return;
        }

        throw new Error(responseData.error || "Gagal menghapus kelas");
      }

      if (
        deleteModal.siswaCount > 0 &&
        deleteModal.siswaAction === "MOVE" &&
        !deleteModal.targetKelasId
      ) {
        throw new Error("Pilih kelas tujuan untuk memindahkan siswa.");
      }

      const forceResponse = await fetch(`/api/kelas?id=${deleteModal.kelasId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          force: true,
          siswaAction:
            deleteModal.siswaCount > 0 ? deleteModal.siswaAction : undefined,
          targetKelasId:
            deleteModal.siswaCount > 0 && deleteModal.siswaAction === "MOVE"
              ? deleteModal.targetKelasId
              : undefined,
        }),
      });

      const forceData = await forceResponse.json();

      if (!forceResponse.ok) {
        throw new Error(forceData.error || "Gagal menghapus kelas");
      }

      setMessage("✅ Kelas dan data terkait berhasil diproses");
      closeDeleteModal();
      fetchData();
    } catch (error) {
      setMessage("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteKelas(id: number) {
    const selectedKelas = kelas.find((item) => Number(item.id) === Number(id));
    if (!selectedKelas) {
      setMessage("❌ Error: Data kelas tidak ditemukan.");
      return;
    }

    openDeleteModal(selectedKelas);
  }

  const filteredKelas = kelas.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase()) ||
    k.tingkat.toString().includes(search.toLowerCase())
  );
  
  return (
    <main>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">📚 Data Kelas</h1>
        <Button onClick={() => { 
          setForm({ id: 0, nama: "", tingkat: 0 }); 
          setMessage("");
          setOpen(true); 
        }}>
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
        columns={["ID", "Nama", "Tingkat"]}
        data={filteredKelas.map((k) => ({ 
          ID: k.id,
          Nama: k.nama, 
          Tingkat: k.tingkat,
          _rawData: k
        }))}
        actions={(row: any) => (
          <div className="flex justify-center gap-3">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const kelasData = row._rawData;
                
                const newForm = { 
                  id: Number(kelasData.id), 
                  nama: String(kelasData.nama), 
                  tingkat: Number(kelasData.tingkat)
                };
                
                setForm(newForm);
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
                deleteKelas(row._rawData.id);
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
          onClose={() => {
            setOpen(false);
            setForm({ id: 0, nama: "", tingkat: 0 });
          }} 
          title={form.id > 0 ? `Edit Kelas (ID: ${form.id})` : "Tambah Kelas"}
        >
          <form onSubmit={saveKelas} className="space-y-3">
            {form.id > 0 && (
              <div className="p-2 bg-blue-50 text-blue-800 rounded text-sm">
                ✏️ Mode Edit - ID: {form.id}
              </div>
            )}
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Kelas"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <input
              type="number"
              value={form.tingkat || ""}
              onChange={(e) => setForm({ ...form, tingkat: Number(e.target.value) })}
              placeholder="Tingkat"
              required
              className="border p-2 w-full rounded focus:ring focus:ring-indigo-200"
            />
            <Button type="submit" disabled={loading}>
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
          title="Konfirmasi Hapus Kelas"
        >
          <div className="space-y-4">
            {deleteModal.stage === "confirm" ? (
              <>
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm">
                  Anda akan menghapus kelas <b>{deleteModal.kelasNama || "ini"}</b>. Lanjutkan?
                </div>
                <p className="text-sm text-gray-600">
                  Sistem akan mengecek apakah kelas masih memiliki data siswa atau jadwal.
                </p>
              </>
            ) : (
              <>
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-1">
                  <p>
                    Kelas ini memiliki <b>{deleteModal.siswaCount}</b> siswa dan <b>{deleteModal.jadwalCount}</b> jadwal.
                  </p>
                  <p>
                    Pilih tindakan sebelum kelas dihapus.
                  </p>
                </div>

                {deleteModal.siswaCount > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-800">Data Siswa</p>
                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="siswaAction"
                        checked={deleteModal.siswaAction === "MOVE"}
                        onChange={() =>
                          setDeleteModal((prev) => ({ ...prev, siswaAction: "MOVE" }))
                        }
                        disabled={deleteModal.availableTargetKelas.length === 0}
                      />
                      <span>Pindahkan semua siswa ke kelas lain</span>
                    </label>

                    {deleteModal.siswaAction === "MOVE" && (
                      <select
                        value={deleteModal.targetKelasId || ""}
                        onChange={(e) =>
                          setDeleteModal((prev) => ({
                            ...prev,
                            targetKelasId: Number(e.target.value),
                          }))
                        }
                        className="w-full border rounded p-2 text-sm"
                      >
                        <option value="" disabled>
                          Pilih kelas tujuan
                        </option>
                        {deleteModal.availableTargetKelas.map((target) => (
                          <option key={target.id} value={target.id}>
                            {target.nama} (Tingkat {target.tingkat})
                          </option>
                        ))}
                      </select>
                    )}

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="siswaAction"
                        checked={deleteModal.siswaAction === "DELETE"}
                        onChange={() =>
                          setDeleteModal((prev) => ({ ...prev, siswaAction: "DELETE" }))
                        }
                      />
                      <span>Hapus semua data siswa pada kelas ini</span>
                    </label>
                  </div>
                )}

                {deleteModal.jadwalCount > 0 && (
                  <div className="text-sm text-gray-700 p-3 rounded border bg-gray-50">
                    Semua jadwal terkait kelas ini akan ikut dihapus.
                  </div>
                )}
              </>
            )}

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
                onClick={submitDeleteKelas}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading
                  ? "Memproses..."
                  : deleteModal.stage === "confirm"
                  ? "Lanjutkan"
                  : "Hapus Kelas"}
              </button>
            </div>
          </div>
        </ModalForm>
      )}
    </main>
  );
}
