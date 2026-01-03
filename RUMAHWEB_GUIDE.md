# ⚠️ PANDUAN RUMAHWEB UNTUK NEXT.JS

## Pertanyaan: Bisa Hosting di Rumahweb?

**Jawaban singkat: TIDAK untuk Shared Hosting, BISA untuk VPS/Cloud**

---

## 🔍 PENJELASAN DETAIL

### Tipe Hosting Rumahweb

| Tipe | Support Node.js | Support MySQL | Cocok? |
|------|-----------------|---------------|--------|
| **Shared Hosting** | ❌ Tidak | ✅ Ya | ❌ **TIDAK** |
| **VPS Linux** | ✅ Ya | ✅ Ya | ✅ **IYA** |
| **Cloud Hosting** | ✅ Ya | ✅ Ya | ✅ **IYA** |
| **Dedicated Server** | ✅ Ya | ✅ Ya | ✅ **IYA** |

---

## 📋 KENAPA SHARED HOSTING TIDAK COCOK?

### Masalah Teknis:

1. **Tidak Ada Node.js Runtime**
   - Shared hosting hanya support PHP
   - Next.js butuh Node.js environment
   - Tidak bisa run `npm start`

2. **Tidak Ada SSH/Terminal Access**
   - Shared hosting tidak punya SSH
   - Tidak bisa jalankan `npm install`
   - Tidak bisa jalankan `npm run build`

3. **Pembatasan Process Management**
   - Tidak bisa jalankan process jangka panjang
   - Shared hosting punya strict resource limits
   - API requests akan timeout

4. **Static HTML Only**
   - Hanya support PHP atau static HTML
   - Tidak support server-side rendering
   - Aplikasi interactive tidak bisa jalan

---

## ✅ SOLUSI UNTUK PENGGUNA RUMAHWEB

### OPSI 1: Upgrade ke VPS Rumahweb ⭐ (RECOMMENDED)

**Keuntungan:**
- ✅ Harga terjangkau (Rp 50-150K/bulan)
- ✅ Lokal Indonesia (support 24/7 Bahasa Indonesia)
- ✅ Full root access
- ✅ Bisa install Node.js
- ✅ Support MySQL included
- ✅ Familiar dengan interface Rumahweb

**Setup di Rumahweb VPS:**

```bash
# 1. SSH ke VPS
ssh root@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MySQL (jika belum)
sudo apt-get install mysql-server

# 4. Clone aplikasi
cd /home
git clone https://github.com/you/penjadwalan-guru.git

# 5. Install dependencies
cd penjadwalan-guru
npm install

# 6. Setup database
npx prisma db push

# 7. Build aplikasi
npm run build

# 8. Start aplikasi (gunakan PM2)
npm install -g pm2
pm2 start "npm start" --name penjadwalan-guru
pm2 save
pm2 startup

# 9. Configure Nginx (reverse proxy)
# (File konfigurasi ada di bawah)

# 10. Akses dari domain
# http://your-domain.com
```

**Estimasi biaya:**
- VPS: Rp 60-100K/bulan (Rumahweb)
- Domain: Rp 15-50K/tahun
- **Total: Rp 60-100K/bulan**

---

### OPSI 2: Export to Static HTML (Workaround)

**Jika tidak mau upgrade:**

Bisa export aplikasi menjadi static HTML, tapi dengan trade-offs besar:

**Pros:**
- Bisa di-host di shared hosting
- Harga murah (paket yang sudah ada)

**Cons:**
- ❌ Data tidak bisa real-time update
- ❌ Form tidak bisa interaktif
- ❌ Generate jadwal otomatis tidak bisa
- ❌ Search & filter tidak bisa
- ❌ Basically: hanya jadi display statis

**Tidak recommended! Hilang semua fitur interaktif.**

---

### OPSI 3: Pisah Frontend & Backend

**Konsep:**
- Frontend: Vercel/Netlify (free)
- Backend API: Render.com ($7/bulan)
- Database: PlanetScale ($35/bulan) atau Railway ($5-15/bulan)

**Pros:**
- ✅ Frontend bisa cepat
- ✅ Backend terpisah dan scalable
- ✅ Frontend bisa di-update independent

**Cons:**
- ❌ Lebih kompleks setup
- ❌ Multiple services to manage

**Total cost: $7-50/bulan**

---

### OPSI 4: REKOMENDASI TERBAIK ⭐

**Tinggalkan Rumahweb, gunakan Railway.app**

**Alasan:**
1. ✅ Harga lebih murah ($5-15/bulan vs Rp 60K+)
2. ✅ Setup lebih mudah (8 steps, 15 menit)
3. ✅ All-in-one (database included)
4. ✅ Auto-deploy dari GitHub
5. ✅ No DevOps knowledge needed
6. ✅ Monitoring built-in
7. ✅ Global CDN

**Vs Rumahweb VPS:**
- Railway lebih mudah setup
- Railway lebih reliable
- Railway sudah include monitoring
- Railway scalable instant
- Tidak perlu manage server

---

## 🔧 JIKA MEMILIH RUMAHWEB VPS

### Setup Lengkap di Rumahweb VPS

#### Step 1: Buat VPS di Rumahweb
```
1. Login ke Rumahweb
2. Pilih VPS
3. Pilih OS: Ubuntu 20.04 atau 22.04
4. Tunggu setup ~15 menit
5. Dapat IP address dan password
```

#### Step 2: SSH ke VPS
```bash
# Windows (gunakan PuTTY atau WSL):
ssh root@your-ip-address

# Linux/Mac:
ssh root@your-ip-address

# Masukkan password dari Rumahweb
```

#### Step 3: Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### Step 4: Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# Verify
node --version
npm --version
```

#### Step 5: Install MySQL (jika paket tidak include)
```bash
sudo apt-get install -y mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE penjadwalan_guru;
CREATE USER 'penjadwal'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON penjadwalan_guru.* TO 'penjadwal'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 6: Clone & Setup Aplikasi
```bash
# Clone dari GitHub
cd /home
sudo git clone https://github.com/you/penjadwalan-guru.git
sudo chown -R $USER:$USER penjadwalan-guru
cd penjadwalan-guru

# Install dependencies
npm install

# Setup .env
cat > .env.production << EOF
DATABASE_URL="mysql://penjadwal:password123@localhost:3306/penjadwalan_guru"
NODE_ENV=production
EOF

# Run migrations
npx prisma db push
npx prisma generate

# Build
npm run build
```

#### Step 7: Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start aplikasi dengan PM2
pm2 start "npm start" --name "penjadwalan-guru"

# Make PM2 start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs
```

#### Step 8: Install & Configure Nginx
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create config file
sudo cat > /etc/nginx/sites-available/penjadwalan-guru << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/penjadwalan-guru /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 9: Setup SSL (HTTPS) - Optional tapi recommended
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get free SSL dari Let's Encrypt
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto renew
sudo systemctl enable certbot.timer
```

#### Step 10: Setup Domain di Rumahweb
```
1. Login ke Rumahweb
2. Manage domain
3. Point nameserver ke VPS IP
4. Atau set A record ke VPS IP
5. Wait 24 jam untuk propagasi
```

---

## 📊 PERBANDINGAN OPSI

| Opsi | Harga | Setup | Kemudahan | Recommended |
|------|-------|-------|----------|------------|
| **Rumahweb Shared** | Rp 30-50K | 5 min | ⭐ | ❌ Tidak cocok |
| **Rumahweb VPS** | Rp 60-150K | 45 min | ⭐⭐⭐ | ✅ Bisa |
| **Railway.app** | $5-15 | 15 min | ⭐⭐⭐⭐ | ✅✅ Best |
| **Vercel** | Free-$35 | 10 min | ⭐⭐⭐⭐ | ✅ Alternatif |

---

## 🎯 REKOMENDASI AKHIR

### Jika ingin tetap Indonesia (Rumahweb):
✅ **Upgrade ke VPS Rumahweb**
- Harga: Rp 60-100K/bulan
- Setup: Follow guide di atas
- Support: 24/7 Rumahweb Bahasa Indonesia
- Estimasi waktu: 1-2 jam setup

### Jika mau paling mudah & murah:
✅✅ **Gunakan Railway.app**
- Harga: $5-15/bulan (~Rp 100-250K)
- Setup: 15 menit saja
- Tidak perlu Linux knowledge
- Auto-scaling & monitoring included
- **REKOMENDASI TERBAIK!**

### Jika already punya Rumahweb shared:
🤔 **Pertimbangan:**
- Upgrade ke VPS? (Rp 60-100K)
- Atau pindah ke Railway? ($5-15)
- Atau cari provider lain yang support Node.js

---

## ⚠️ JANGAN LAKUKAN INI

❌ Jangan coba host Next.js di shared hosting Rumahweb
- Tidak akan jalan
- Aplikasi akan error 500
- Database connection akan timeout
- Fitur interaktif tidak berfungsi

❌ Jangan convert ke static HTML untuk hemat hosting
- Hilang semua fitur interactive
- Jadwal tidak bisa update real-time
- Filter & search tidak bisa
- Basically jadi display statis saja

---

## 📞 LANGKAH NEXT

### Jika pilih Railway.app (Recommended):
1. Baca `HOSTING_QUICKSTART.md`
2. Follow 8 steps deploy
3. Done dalam 15 menit!

### Jika pilih Rumahweb VPS:
1. Upgrade ke VPS paket minimum
2. Follow step-by-step guide di atas
3. Minta support Rumahweb jika stuck
4. Setup memakan waktu ~1-2 jam

---

## 💬 FAQ Rumahweb

**Q: Rumahweb VPS ada yang berapa harga?**
A: Mulai dari Rp 60K/bulan (1 Core, 512MB RAM). Upgrade ke Rp 100K untuk 2 Core, 1GB RAM (lebih nyaman).

**Q: Bisa pakai domain Rumahweb yg existing?**
A: Ya, tinggal point ke IP VPS.

**Q: Support Node.js di Rumahweb?**
A: Hanya VPS/Cloud/Dedicated. Shared hosting hanya PHP.

**Q: Bisa transfer database dari local?**
A: Ya, bisa dump MySQL local terus import ke VPS.

---

## 🎓 KESIMPULAN

```
┌─────────────────────────────────────────┐
│  Shared Hosting Rumahweb                │
│  ❌ TIDAK COCOK untuk Next.js           │
│                                         │
│  Solusi:                                │
│  1. ✅ Upgrade ke VPS Rumahweb          │
│  2. ✅ Pindah ke Railway.app (Better!)  │
│  3. ✅ Pindah ke Vercel                 │
└─────────────────────────────────────────┘
```

**Rekomendasi: Railway.app!** Murah, mudah, reliable. 🚀
