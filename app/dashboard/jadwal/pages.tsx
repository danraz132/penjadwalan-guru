'use client'
import { useState } from 'react'

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    const res = await fetch('/api/jadwal', { method: 'POST' })
    const data = await res.json()
    setJadwal(data.jadwalBaru)
    setLoading(false)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Jadwal Otomatis</h1>
      <button
        onClick={generate}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Buat Jadwal'}
      </button>

      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr><th>Hari</th><th>Kelas</th><th>Guru</th><th>Mapel</th><th>Ruangan</th><th>Jam</th></tr>
        </thead>
        <tbody>
          {jadwal.map((j, i) => (
            <tr key={i} className="border-t">
              <td>{j.hari}</td>
              <td>{j.kelasId}</td>
              <td>{j.guruId}</td>
              <td>{j.matpelId}</td>
              <td>{j.ruanganId}</td>
              <td>{j.jamMulai} - {j.jamSelesai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
