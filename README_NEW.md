# 📚 Aplikasi Penjadwalan Guru

Sistem informasi penjadwalan guru yang modern dan user-friendly untuk mengelola jadwal mengajar di sekolah.

## 🌟 Fitur Utama

### 📊 Dashboard
- Statistik ringkas (total guru, kelas, mapel, ruangan, jadwal)
- Monitoring guru yang belum mengajar
- Quick access ke semua fitur

### 👨‍🏫 Manajemen Guru
- Tambah, edit, hapus data guru
- Lihat mata pelajaran yang diajar oleh setiap guru
- Pencarian berdasarkan nama atau NIP

### 📚 Manajemen Kelas
- Kelola daftar kelas dan tingkat pendidikan
- Pencarian dan filtering
- Form yang user-friendly

### 📖 Manajemen Mata Pelajaran
- Atur mata pelajaran dan alokasi jam per minggu
- Assign guru untuk setiap mapel
- Pencarian dan filtering

### 🏫 Manajemen Ruangan
- Daftar ruangan kelas dengan kapasitas
- Tambah, edit, hapus ruangan
- Pencarian berdasarkan nama

### 🗓️ Penjadwalan Otomatis
- **Generate jadwal otomatis** dengan algoritma smart scheduling
  - ✅ Tidak ada tabrakan jadwal guru
  - ✅ Tidak ada tabrakan jadwal kelas
  - ✅ Tidak ada tabrakan penggunaan ruangan
  - ✅ Menyesuaikan jumlah jam pelajaran
  - ✅ Distribusi jadwal optimal
- **Penjadwalan manual** untuk kebutuhan khusus
- Filter jadwal berdasarkan guru, kelas, atau mapel
- Pencarian jadwal
- 25 slot waktu per minggu (Senin-Jumat, 07:00-14:30)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL dengan Prisma ORM
- **Styling**: Tailwind CSS

## 📋 Requirements

- Node.js >= 18
- MySQL Database
- npm atau yarn

## 🚀 Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd penjadwalan-guru
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
Buat file `.env.local` di root project:
```bash
DATABASE_URL="mysql://user:password@localhost:3306/penjadwalan_guru"
```

4. **Setup Database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run Development Server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📖 Penggunaan

### 1. Setup Data Master
- Mulai dengan menambah **Guru** di menu Guru
- Tambah **Kelas** di menu Kelas
- Atur **Mata Pelajaran** dan assign guru di menu Mapel
- Tambah **Ruangan** di menu Ruangan

### 2. Generate Jadwal Otomatis
- Buka menu **Jadwal**
- Klik tombol **🤖 Generate Otomatis**
- Sistem akan membuat jadwal optimal tanpa tabrakan

### 3. Penjadwalan Manual (Opsional)
- Gunakan form di atas tabel untuk tambah jadwal manual
- Atau edit jadwal yang sudah ada melalui dashboard

### 4. Monitoring
- Lihat statistik di **Dashboard**
- Monitor guru yang belum mengajar
- Filter jadwal sesuai kebutuhan

## 📁 Struktur Project

```
penjadwalan-guru/
├── app/
│   ├── api/
│   │   ├── guru/
│   │   ├── jadwal/
│   │   ├── kelas/
│   │   ├── mapel/
│   │   └── ruangan/
│   ├── dashboard/
│   │   ├── guru/
│   │   ├── jadwal/
│   │   ├── kelas/
│   │   ├── mapel/
│   │   ├── ruangan/
│   │   └── page.tsx (Dashboard)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Button.tsx
│   ├── DataTable.jsx
│   ├── ModalForm.tsx
│   ├── TableCard.tsx
│   └── ui/
├── prisma/
│   └── schema.prisma
└── public/
```

## 🔧 Build untuk Production

```bash
npm run build
npm start
```

## 📝 Database Schema

- **Guru**: id, nama, nip, mataPelajar (relations), jadwal (relations)
- **Kelas**: id, nama, tingkat, jadwal (relations)
- **Matpel**: id, nama, jamPerMinggu, guruId, jadwal (relations)
- **Ruangan**: id, nama, kapasitas, jadwal (relations)
- **Jadwal**: id, kelasId, matpelId, guruId, ruanganId, hari, jamMulai, jamSelesai
- **Preferensi**: id, guruId, hariSuka, jamSuka, jamTidak (optional)

## 🚦 Algoritma Penjadwalan

1. Menghapus jadwal lama
2. Mengambil data mapel, kelas, dan ruangan
3. Mengurutkan mapel berdasarkan prioritas (jam terbanyak didahulukan)
4. Untuk setiap mapel, assign ke berbagai kelas
5. Untuk setiap kelas, cari slot waktu yang tersedia
6. Validasi 3 constraint:
   - Guru tidak double di waktu yang sama
   - Kelas tidak double di waktu yang sama
   - Ruangan tidak double di waktu yang sama
7. Simpan jadwal yang valid ke database

## 🎯 Fitur Slot Waktu

- **Senin - Jumat**: 5 hari kerja
- **Jam Operasional**: 07:00 - 14:30
- **Durasi Slot**: 1,5 jam per slot
- **Total Slot**: 25 per minggu (5 slot × 5 hari)

## 🤝 Kontribusi

Untuk kontribusi, silakan buat pull request atau buka issue.

## 📄 Lisensi

MIT License

## 👨‍💻 Pembuat

Dibuat dengan ❤️ menggunakan Next.js dan Prisma

---

**Versi**: 1.0.0
**Updated**: 2026
