'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { FileText } from 'lucide-react'

interface Guru {
  id: number
  nama: string
  nip: string
}

interface Jadwal {
  id: number
  hari: string
  jamMulai: string
  jamSelesai: string
  kelas: { nama: string }
  matpel: { nama: string }
  ruangan: { nama: string }
}

interface GuruPengganti {
  id: number
  tanggal: string
  status: string
  catatan?: string
  guruAsli: Guru
  guruPengganti: Guru
  jadwal: Jadwal
}

export default function GuruPenggantiPage() {
  const [penggantiList, setPenggantiList] = useState<GuruPengganti[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: 0,
    guruAsliNama: '',
    guruPenggantiNama: '',
  })
  const [deleting, setDeleting] = useState(false)
  const [statusModal, setStatusModal] = useState<{
    open: boolean
    id: number
    status: '' | 'Diterima' | 'Ditolak'
    guruAsliNama: string
    guruPenggantiNama: string
  }>({
    open: false,
    id: 0,
    status: '',
    guruAsliNama: '',
    guruPenggantiNama: '',
  })
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  const [formData, setFormData] = useState({
    absensiId: '',
    jadwalId: '',
    guruAsliId: '',
    guruPenggantiId: '',
    tanggal: new Date().toISOString().split('T')[0],
    catatan: ''
  })

  useEffect(() => {
    fetchPengganti()
    fetchGuru()
    fetchJadwal()
    
    // Check if there's an absensiId in URL params
    const params = new URLSearchParams(window.location.search)
    const absensiId = params.get('absensiId')
    if (absensiId) {
      setFormData(prev => ({ ...prev, absensiId }))
      setShowForm(true)
    }
  }, [])

  const fetchPengganti = async () => {
    try {
      const res = await fetch('/api/guru-pengganti')
      const data = await res.json()
      setPenggantiList(data)
    } catch (error) {
      console.error('Error fetching guru pengganti:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGuru = async () => {
    try {
      const res = await fetch('/api/guru')
      const data = await res.json()
      setGuruList(data)
    } catch (error) {
      console.error('Error fetching guru:', error)
    }
  }

  const fetchJadwal = async () => {
    try {
      const res = await fetch('/api/jadwal')
      const data = await res.json()
      setJadwalList(data)
    } catch (error) {
      console.error('Error fetching jadwal:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/guru-pengganti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Guru pengganti berhasil ditambahkan!')
        setShowForm(false)
        setFormData({
          absensiId: '',
          jadwalId: '',
          guruAsliId: '',
          guruPenggantiId: '',
          tanggal: new Date().toISOString().split('T')[0],
          catatan: ''
        })
        fetchPengganti()
      } else {
        const error = await res.json()
        alert(error.error || 'Gagal menambahkan guru pengganti')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menambahkan guru pengganti')
    }
  }

  const openStatusModal = (item: GuruPengganti, status: 'Diterima' | 'Ditolak') => {
    setStatusModal({
      open: true,
      id: item.id,
      status,
      guruAsliNama: item.guruAsli.nama,
      guruPenggantiNama: item.guruPengganti.nama,
    })
  }

  const closeStatusModal = () => {
    if (updatingStatus) return
    setStatusModal({
      open: false,
      id: 0,
      status: '',
      guruAsliNama: '',
      guruPenggantiNama: '',
    })
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/guru-pengganti', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        alert('Status berhasil diupdate!')
        fetchPengganti()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal update status')
    }
  }

  const handleConfirmUpdateStatus = async () => {
    if (!statusModal.id || !statusModal.status) return

    try {
      setUpdatingStatus(true)
      const res = await fetch('/api/guru-pengganti', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: statusModal.id, status: statusModal.status })
      })

      if (res.ok) {
        alert('Status berhasil diupdate!')
        closeStatusModal()
        fetchPengganti()
      } else {
        const error = await res.json()
        alert(error.error || 'Gagal update status')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const openDeleteModal = (item: GuruPengganti) => {
    setDeleteModal({
      open: true,
      id: item.id,
      guruAsliNama: item.guruAsli.nama,
      guruPenggantiNama: item.guruPengganti.nama,
    })
  }

  const closeDeleteModal = () => {
    if (deleting) return
    setDeleteModal({
      open: false,
      id: 0,
      guruAsliNama: '',
      guruPenggantiNama: '',
    })
  }

  const handleDelete = async () => {
    if (!deleteModal.id) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/guru-pengganti?id=${deleteModal.id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Data berhasil dihapus')
        closeDeleteModal()
        fetchPengganti()
      } else {
        const error = await res.json()
        alert(error.error || 'Gagal menghapus data')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Menunggu': 'bg-yellow-100 text-yellow-800',
      'Diterima': 'bg-green-100 text-green-800',
      'Ditolak': 'bg-red-100 text-red-800',
      'Selesai': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Guru Pengganti</h1>
          <p className="text-sm text-gray-500 mt-2">
            🤖 Sistem otomatis mencarikan guru pengganti berdasarkan mata pelajaran yang sama dan jadwal kosong
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/guru-pengganti/laporan">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText size={18} />
              Laporan Bulanan
            </Button>
          </Link>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Tutup Form' : '+ Tentukan Manual'}
          </Button>
        </div>
      </div>

      {penggantiList.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Cara Kerja Sistem Otomatis:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ketika ada guru tidak masuk, sistem otomatis mencari guru pengganti</li>
            <li>• Guru pengganti dipilih yang mengajar <strong>mata pelajaran yang sama</strong></li>
            <li>• Hanya guru dengan <strong>jadwal kosong</strong> di jam tersebut yang dipilih</li>
            <li>• Status awal: Menunggu → Admin dapat menerima/menolak penugasan</li>
          </ul>
        </Card>
      )}

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Tentukan Guru Pengganti</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jadwal yang Perlu Diganti *</label>
              <select
                value={formData.jadwalId}
                onChange={(e) => {
                  const jadwal = jadwalList.find(j => j.id === parseInt(e.target.value))
                  setFormData({ 
                    ...formData, 
                    jadwalId: e.target.value,
                  })
                }}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Jadwal</option>
                {jadwalList.map((jadwal) => (
                  <option key={jadwal.id} value={jadwal.id}>
                    {jadwal.hari} | {jadwal.jamMulai}-{jadwal.jamSelesai} | {jadwal.kelas.nama} | {jadwal.matpel.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Guru Asli (Yang Tidak Masuk) *</label>
              <select
                value={formData.guruAsliId}
                onChange={(e) => setFormData({ ...formData, guruAsliId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Guru</option>
                {guruList.map((guru) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.nama} ({guru.nip})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Guru Pengganti *</label>
              <select
                value={formData.guruPenggantiId}
                onChange={(e) => setFormData({ ...formData, guruPenggantiId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Guru Pengganti</option>
                {guruList
                  .filter(g => g.id !== parseInt(formData.guruAsliId))
                  .map((guru) => (
                    <option key={guru.id} value={guru.id}>
                      {guru.nama} ({guru.nip})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tanggal *</label>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catatan</label>
              <textarea
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Catatan tambahan (opsional)"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Asli</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Pengganti</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {penggantiList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data guru pengganti
                  </td>
                </tr>
              ) : (
                penggantiList.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      {new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">{item.guruAsli.nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{item.guruPengganti.nama}</span>
                        {item.catatan?.includes('Otomatis') && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            🤖 Otomatis
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{item.jadwal.kelas.nama} - {item.jadwal.matpel.nama}</div>
                        <div className="text-gray-500">
                          {item.jadwal.hari}, {item.jadwal.jamMulai}-{item.jadwal.jamSelesai}
                        </div>
                        {item.catatan && (
                          <div className="text-xs text-gray-400 mt-1 italic">
                            {item.catatan}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {item.status === 'Menunggu' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openStatusModal(item, 'Diterima')}
                            >
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openStatusModal(item, 'Ditolak')}
                            >
                              Tolak
                            </Button>
                          </>
                        )}
                        {item.status === 'Diterima' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                          >
                            Selesai
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteModal(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={deleteModal.open} onOpenChange={(open) => !open && closeDeleteModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Guru Pengganti</DialogTitle>
            <DialogDescription>
              Anda akan menghapus penugasan guru pengganti dari{' '}
              <strong>{deleteModal.guruAsliNama || '-'}</strong> ke{' '}
              <strong>{deleteModal.guruPenggantiNama || '-'}</strong>. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDeleteModal} disabled={deleting}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Memproses...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusModal.open} onOpenChange={(open) => !open && closeStatusModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Konfirmasi {statusModal.status === 'Diterima' ? 'Terima' : 'Tolak'} Penugasan
            </DialogTitle>
            <DialogDescription>
              Anda akan mengubah status penugasan dari{' '}
              <strong>{statusModal.guruAsliNama || '-'}</strong> ke{' '}
              <strong>{statusModal.guruPenggantiNama || '-'}</strong> menjadi{' '}
              <strong>{statusModal.status || '-'}</strong>. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeStatusModal} disabled={updatingStatus}>
              Batal
            </Button>
            <Button type="button" onClick={handleConfirmUpdateStatus} disabled={updatingStatus}>
              {updatingStatus ? 'Memproses...' : 'Ya, Lanjutkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
