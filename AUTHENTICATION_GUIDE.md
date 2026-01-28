# Panduan Autentikasi Sistem Penjadwalan Guru

## Fitur yang Ditambahkan

Sistem autentikasi lengkap telah ditambahkan dengan fitur:
- ✅ Login untuk Admin, Guru, dan Siswa
- ✅ Session management menggunakan HTTP-only cookies
- ✅ Password hashing dengan bcryptjs
- ✅ Middleware untuk proteksi route
- ✅ Role-based access control (RBAC)
- ✅ Logout functionality

## Struktur Database

Model User baru telah ditambahkan dengan skema:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // Hashed password
  role      Role     @default(GURU)
  guruId    Int?     @unique
  siswaId   Int?     @unique
  guru      Guru?    @relation(fields: [guruId], references: [id])
  siswa     Siswa?   @relation(fields: [siswaId], references: [id])
}

enum Role {
  ADMIN
  GURU
  SISWA
}
```

## Login Credentials

### Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Akses:** Full access ke semua menu

### Guru
- **Username:** `guru_[NIP]` (contoh: `guru_19870314202301`)
- **Password:** `guru123`
- **Akses:** Dashboard, Jadwal, Absensi, Guru Pengganti

### Siswa
- **Username:** `siswa_[NIS]` (contoh: `siswa_2024001`)
- **Password:** `siswa123`
- **Akses:** Dashboard, Jadwal, Absensi, Guru Pengganti

## File-File yang Ditambahkan

### 1. Library Files
- `lib/auth.ts` - Hash dan verifikasi password
- `lib/session.ts` - Manajemen session cookies

### 2. API Routes
- `app/api/auth/login/route.ts` - Endpoint login
- `app/api/auth/logout/route.ts` - Endpoint logout
- `app/api/auth/session/route.ts` - Check session status

### 3. Pages
- `app/login/page.tsx` - Halaman login dengan UI yang modern

### 4. Components
- `app/dashboard/layout.tsx` - Layout dashboard dengan info user dan logout
- `app/dashboard/LogoutButton.tsx` - Tombol logout

### 5. Middleware
- `middleware.ts` - Proteksi route dan redirect logic

### 6. Database
- `prisma/schema.prisma` - Updated dengan model User
- `prisma/seed-users.ts` - Seed data untuk user testing

## Cara Menggunakan

### 1. Jalankan Development Server
```bash
npm run dev
```

### 2. Akses Aplikasi
Buka browser dan akses: `http://localhost:3000`

Aplikasi akan otomatis redirect ke halaman login.

### 3. Login
- Masukkan username dan password sesuai role
- Klik tombol "Masuk"
- Anda akan diarahkan ke dashboard

### 4. Logout
Klik tombol "Logout" di sidebar untuk keluar dari sistem.

## Role-Based Access Control

### Admin
Memiliki akses penuh ke semua menu:
- Dashboard
- Jadwal
- Guru
- Kelas
- Siswa
- Mata Pelajaran
- Ruangan
- Absensi Guru
- Guru Pengganti

### Guru & Siswa
Akses terbatas ke:
- Dashboard
- Jadwal
- Absensi Guru
- Guru Pengganti

## Security Features

1. **Password Hashing**: Semua password di-hash menggunakan bcryptjs dengan salt
2. **HTTP-Only Cookies**: Session disimpan dalam HTTP-only cookie untuk mencegah XSS
3. **Secure Cookies**: Cookie secure diaktifkan di production
4. **Session Expiry**: Session expire setelah 7 hari
5. **Protected Routes**: Middleware melindungi semua route dashboard

## Menambah User Baru

### Secara Manual (via Prisma Studio)
```bash
npx prisma studio
```

### Via Seed Script
Edit file `prisma/seed-users.ts` dan jalankan:
```bash
npx ts-node prisma/seed-users.ts
```

## Troubleshooting

### User tidak bisa login
- Pastikan database sudah di-migrate: `npx prisma migrate dev`
- Pastikan user sudah di-seed: `npx ts-node prisma/seed-users.ts`
- Cek kredensial login yang benar

### Redirect loop
- Clear cookies browser
- Restart development server

### Session tidak persisten
- Pastikan cookie tidak diblokir oleh browser
- Cek konfigurasi middleware

## API Documentation

### POST /api/auth/login
Login user ke sistem

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success:**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "ADMIN",
    "nama": "admin"
  }
}
```

### POST /api/auth/logout
Logout user dari sistem

**Response:**
```json
{
  "success": true
}
```

### GET /api/auth/session
Check session status

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "nama": "admin"
  }
}
```

## Next Steps

Fitur yang bisa ditambahkan di masa depan:
- [ ] Forgot password functionality
- [ ] Change password
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Audit log untuk login activity
- [ ] Account lockout setelah failed login attempts
- [ ] Password strength requirements
- [ ] User profile management

## Support

Jika ada masalah atau pertanyaan, silakan hubungi administrator sistem.
