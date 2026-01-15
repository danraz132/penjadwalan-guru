'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Guru {
  id: number
  nama: string
  nip: string
}

interface Absensi {
  id: number
  guruId: number
  tanggal: string
  status: string
  keterangan?: string
  guru: Guru
}

export default function AbsensiPage() {
  const [absensiList, setAbsensiList] = useState<Absensi[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const [formData, setFormData] = useState({
    guruId: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Sakit',
    keterangan: ''
  })

  useEffect(() => {
    fetchAbsensi()
    fetchGuru()
  }, [selectedDate])

  const fetchAbsensi = async () => {
    try {
      const res = await fetch(`/api/absensi?tanggal=${selectedDate}`)
      const data = await res.json()
      setAbsensiList(data)
    } catch (error) {
      console.error('Error fetching absensi:', error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Absensi berhasil dicatat!')
        setShowForm(false)
        setFormData({
          guruId: '',
          tanggal: new Date().toISOString().split('T')[0],
          status: 'Sakit',
          keterangan: ''
        })
        fetchAbsensi()
      } else {
        const error = await res.json()
        alert(error.error || 'Gagal mencatat absensi')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal mencatat absensi')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus absensi ini?')) return

    try {
      const res = await fetch(`/api/absensi?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Absensi berhasil dihapus')
        fetchAbsensi()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus absensi')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Hadir': 'bg-green-100 text-green-800',
      'Sakit': 'bg-yellow-100 text-yellow-800',
      'Izin': 'bg-blue-100 text-blue-800',
      'Alpa': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Absensi Guru</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Tutup Form' : '+ Catat Absensi'}
        </Button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter Tanggal:</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Catat Absensi Guru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Guru *</label>
              <select
                value={formData.guruId}
                onChange={(e) => setFormData({ ...formData, guruId: e.target.value })}
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
              <label className="block text-sm font-medium mb-2">Tanggal *</label>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Hadir">Hadir</option>
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin</option>
                <option value="Alpa">Alpa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Keterangan</label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Keterangan tambahan (opsional)"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {absensiList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data absensi untuk tanggal {new Date(selectedDate).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ) : (
                absensiList.map((absensi, index) => (
                  <tr key={absensi.id}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{absensi.guru.nama}</td>
                    <td className="px-6 py-4">{absensi.guru.nip}</td>
                    <td className="px-6 py-4">
                      {new Date(absensi.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(absensi.status)}`}>
                        {absensi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{absensi.keterangan || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {absensi.status !== 'Hadir' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.href = `/dashboard/guru-pengganti?absensiId=${absensi.id}`}
                          >
                            Cari Pengganti
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(absensi.id)}
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
    </div>
  )
}
