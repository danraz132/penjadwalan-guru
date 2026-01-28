# Panduan Fitur Laporan Absensi Bulanan

## Overview

Fitur laporan absensi bulanan memungkinkan admin dan guru untuk:
- Generate laporan absensi guru per bulan
- Melihat statistik kehadiran lengkap
- Mencetak laporan dalam format yang rapi
- Menganalisis persentase kehadiran per guru

## Fitur yang Ditambahkan

### 1. API Endpoint: `/api/absensi/laporan`

**Method:** GET

**Query Parameters:**
- `bulan` (required): Format YYYY-MM (contoh: 2026-01)
- `guruId` (optional): Filter untuk guru tertentu

**Response:**
```json
{
  "periode": {
    "bulan": 1,
    "tahun": 2026,
    "namaBulan": "Januari",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-01-31T23:59:59.999Z",
    "hariKerja": 22
  },
  "totalStatistik": {
    "totalGuru": 10,
    "totalHariKerja": 22,
    "totalHadir": 210,
    "totalSakit": 5,
    "totalIzin": 3,
    "totalAlpa": 2,
    "rataRataKehadiran": 95.5
  },
  "dataGuru": [...]
}
```

### 2. Halaman Laporan: `/dashboard/absensi/laporan`

Fitur yang tersedia:
- **Filter Bulan:** Pilih bulan dan tahun yang ingin ditampilkan
- **Generate Laporan:** Klik untuk membuat laporan
- **Preview:** Lihat preview laporan sebelum cetak
- **Cetak:** Print laporan dengan format yang rapi

## Cara Menggunakan

### 1. Akses Halaman Laporan

Dari halaman Absensi Guru, klik tombol **"Laporan Bulanan"** di pojok kanan atas.

Atau akses langsung: `http://localhost:3000/dashboard/absensi/laporan`

### 2. Generate Laporan

1. Pilih bulan dan tahun menggunakan date picker
2. Klik tombol **"Generate Laporan"**
3. Tunggu beberapa saat hingga laporan ditampilkan

### 3. Melihat Statistik

Laporan menampilkan beberapa statistik:

#### Summary Statistik (Card Berwarna):
- **Total Guru**: Jumlah total guru dalam sistem
- **Hari Kerja**: Jumlah hari kerja (Senin-Jumat) dalam bulan tersebut
- **Total Hadir**: Total kehadiran semua guru
- **Rata-rata Kehadiran**: Persentase kehadiran rata-rata

#### Breakdown per Status:
- **Total Sakit**: Jumlah total guru yang sakit
- **Total Izin**: Jumlah total guru yang izin
- **Total Alpa**: Jumlah total guru yang alpa (tanpa keterangan)

#### Tabel Detail per Guru:
Menampilkan untuk setiap guru:
- Nama lengkap
- NIP
- Jumlah hadir
- Jumlah sakit
- Jumlah izin
- Jumlah alpa
- Persentase kehadiran (dengan color coding)

### 4. Mencetak Laporan

1. Setelah laporan ditampilkan, klik tombol **"Cetak"** (ikon printer)
2. Browser akan membuka dialog print
3. Pilih printer atau simpan sebagai PDF
4. Klik Print/Save

## Color Coding Persentase Kehadiran

Sistem menggunakan color coding untuk memudahkan identifikasi:

- 🟢 **Hijau (≥90%)**: Kehadiran sangat baik
- 🔵 **Biru (75-89%)**: Kehadiran baik
- 🟡 **Kuning (60-74%)**: Kehadiran cukup
- 🔴 **Merah (<60%)**: Kehadiran kurang

## Format Print

Laporan yang dicetak memiliki format khusus:

### Header Laporan:
```
LAPORAN ABSENSI GURU
Bulan [Nama Bulan] [Tahun]
Sistem Penjadwalan Guru
```

### Konten:
1. **Ringkasan Statistik** - Card dengan angka-angka penting
2. **Tabel Detail** - Tabel lengkap per guru
3. **Footer** - Tanggal cetak dan watermark

### Styling Print:
- Margin: 1cm di semua sisi
- Font: Optimized untuk print
- Warna: Disesuaikan untuk print hitam-putih
- Page breaks: Otomatis untuk tabel panjang

## Perhitungan Statistik

### Hari Kerja
Sistem menghitung hari kerja berdasarkan:
- Senin sampai Jumat (tidak termasuk Sabtu & Minggu)
- Dalam bulan yang dipilih

### Persentase Kehadiran
```
Persentase = (Jumlah Hadir / Total Hari Kerja) × 100%
```

Contoh:
- Total hari kerja dalam bulan: 22 hari
- Guru hadir: 20 hari
- Persentase: (20/22) × 100% = 90.9%

### Rata-rata Kehadiran
```
Rata-rata = Total Persentase Kehadiran Semua Guru / Jumlah Guru
```

## Use Cases

### 1. Evaluasi Bulanan
Admin dapat melihat performa kehadiran guru setiap bulan untuk evaluasi kinerja.

### 2. Laporan ke Kepala Sekolah
Print laporan untuk diserahkan ke pihak manajemen sekolah.

### 3. Identifikasi Masalah
Guru dengan kehadiran rendah dapat diidentifikasi dan ditindaklanjuti.

### 4. Dokumentasi
Simpan laporan sebagai PDF untuk arsip digital.

## Tips Penggunaan

1. **Generate Setiap Akhir Bulan**
   - Buat laporan di akhir bulan untuk data yang lengkap

2. **Simpan sebagai PDF**
   - Gunakan "Print to PDF" untuk menyimpan digital copy

3. **Bandingkan Antar Bulan**
   - Buat laporan beberapa bulan untuk melihat trend

4. **Cetak untuk Rapat**
   - Print laporan sebelum rapat evaluasi guru

## Troubleshooting

### Laporan Kosong
**Penyebab:** Tidak ada data absensi di bulan tersebut  
**Solusi:** Pastikan sudah ada data absensi yang dicatat untuk bulan yang dipilih

### Data Tidak Akurat
**Penyebab:** Data absensi belum lengkap  
**Solusi:** Lengkapi data absensi terlebih dahulu sebelum generate laporan

### Print Tidak Rapi
**Penyebab:** Browser tidak mendukung print CSS  
**Solusi:** Gunakan Chrome atau Edge untuk hasil print terbaik

### Persentase 0%
**Penyebab:** Guru tidak memiliki catatan absensi hadir  
**Solusi:** Normal jika guru tidak hadir sama sekali dalam bulan tersebut

## Integrasi dengan Fitur Lain

### Dengan Absensi Guru
- Link "Laporan Bulanan" tersedia di halaman Absensi Guru
- Data laporan diambil dari tabel AbsensiGuru

### Dengan Guru Pengganti
- Laporan menunjukkan guru yang sering tidak hadir
- Membantu identifikasi kebutuhan guru pengganti

## Future Enhancements

Fitur yang bisa ditambahkan di masa depan:

- [ ] Export ke Excel/CSV
- [ ] Grafik visualisasi kehadiran
- [ ] Perbandingan multi-bulan
- [ ] Filter per mata pelajaran
- [ ] Notifikasi otomatis untuk kehadiran rendah
- [ ] Email laporan otomatis
- [ ] Dashboard analytics
- [ ] Prediksi kehadiran

## File yang Terlibat

### Backend
- `app/api/absensi/laporan/route.ts` - API endpoint untuk generate laporan

### Frontend
- `app/dashboard/absensi/laporan/page.tsx` - Halaman UI laporan
- `app/dashboard/absensi/page.tsx` - Link ke laporan (updated)

### Database
- `AbsensiGuru` model - Sumber data
- `Guru` model - Info guru

## Security & Performance

### Security
- ✅ Memerlukan autentikasi (protected by middleware)
- ✅ Role-based access (Admin & Guru dapat akses)
- ✅ Data sanitization di API

### Performance
- ✅ Query optimization dengan Prisma
- ✅ Indexing pada tanggal dan guruId
- ✅ Efficient grouping dan aggregation

## Support

Jika ada pertanyaan atau masalah dengan fitur laporan absensi, silakan hubungi administrator sistem.

---

**Versi:** 1.0.0  
**Terakhir Update:** 28 Januari 2026
