# 🚀 Panduan Hosting Aplikasi Penjadwalan Guru

## Pilihan Hosting untuk Aplikasi Next.js

### 1️⃣ **VERCEL** (Recommended - FREE TIER TERSEDIA)
**Pros:**
- Gratis untuk tier starter (unlimited deployments)
- Creator Next.js sendiri
- Automatic deployments dari GitHub
- SSL certificate included
- CDN global
- Database hosting (Vercel Postgres)

**Cons:**
- Bandwidth terbatas di free tier
- Serverless functions ada timeout

**Cost:** Free tier atau $20/bulan untuk pro
**Link:** https://vercel.com

**Setup:**
```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Di Vercel dashboard:
- Connect GitHub repository
- Set DATABASE_URL environment variable
- Deploy automatically
```

---

### 2️⃣ **RAILWAY.APP** (Recommended untuk Indonesia)
**Pros:**
- $5/bulan startup credit (generous!)
- Mudah setup MySQL + Node.js
- Git auto-deploy
- Environment variables management
- Support Indonesia payment method

**Cons:**
- Trial credit berakhir
- Upgrade ke bayar untuk production

**Cost:** $5/bulan + database ~$5-15/bulan
**Link:** https://railway.app

**Setup:**
```bash
# 1. Push ke GitHub
# 2. Sign up di Railway.app
# 3. Create new project > GitHub repo
# 4. Add MySQL service + Node.js service
# 5. Set environment variables
# 6. Deploy!
```

---

### 3️⃣ **RENDER.COM** (Alternatif terbaik)
**Pros:**
- Free tier dengan limitations ringan
- Gratis untuk static sites
- PostgreSQL included di pricing
- Auto-deploy dari GitHub
- Easy to use dashboard

**Cons:**
- Free tier akan sleep jika tidak ada request
- Database berbayar (~$7/bulan)

**Cost:** Free untuk compute + $7+/bulan database
**Link:** https://render.com

---

### 4️⃣ **HEROKU** (Tidak free lagi, but good alternative)
**Pros:**
- Very beginner friendly
- Buildpack support untuk Node.js
- Add-ons marketplace
- Easy scaling

**Cons:**
- Free tier sudah dihapus (Oct 2022)
- Minimal $7/bulan untuk dyno

**Cost:** $7-50/bulan
**Link:** https://heroku.com

---

### 5️⃣ **AIRTAP / CYCLIC.SH** (Budget options)
- **Cyclic.sh**: Dari makers Heroku, full stack hosting ~$5/bulan
- **Airtap**: Serverless hosting Indonesia-friendly

---

## 📋 REKOMENDASI untuk Anda

### Opsi 1: **GRATIS (Sementara)**
```
✅ Vercel (Frontend) + PlanetScale (Database)
- Vercel: Free tier
- PlanetScale: $35/bulan MySQL compatible
- Setup: Minimal 10 menit
```

### Opsi 2: **TERJANGKAU & PRAKTIS** ⭐
```
✅ Railway.app
- Harga: $5-20/bulan (all-in-one)
- Setup: 15 menit
- MySQL + Node.js + Auto deploy
- Cocok untuk aplikasi kecil-menengah
```

### Opsi 3: **PALING EKONOMIS**
```
✅ Render.com + PostgreSQL
- Harga: Free compute + $7/bulan DB
- Setup: 10 menit
- Limitations: Sleep mode di free tier
```

---

## 🔧 LANGKAH-LANGKAH DEPLOY (Railway.app)

### Step 1: Prepare Aplikasi
```bash
# 1. Buat production build
npm run build

# 2. Test locally
npm run start

# 3. Push ke GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Update next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Jangan gunakan output: 'export' untuk server-side features
};

module.exports = nextConfig;
```

### Step 3: Add package.json scripts (jika belum ada)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Step 4: Prepare .env.production
```
# Jangan commit credentials, set di hosting dashboard

DATABASE_URL="mysql://user:password@host:port/dbname"
NODE_ENV=production
```

### Step 5: Setup di Railway.app

**A. Create Account**
- Sign up di railway.app
- Connect GitHub account

**B. Create New Project**
```
1. Click "Create Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Select main branch
```

**C. Add Services**
```
1. MySQL Service:
   - Click "Add Service" > MySQL
   - Generated credentials auto appear

2. Node.js Service:
   - Click "Add Service" > GitHub repo (your app)
   - Auto-detects Next.js
   - Sets up package.json scripts

3. Link Services:
   - Database service auto-linked
   - Environment variables auto-populated
```

**D. Environment Variables**
```
DATABASE_URL: (auto-populated dari MySQL service)
NODE_ENV: production
```

**E. Deploy**
```
1. Click "Deploy" atau push ke GitHub
2. Wait untuk build process (~2-5 menit)
3. Get live URL
4. Access aplikasi!
```

---

## 🗄️ DATABASE OPTIONS

### Opsi 1: Included Database (Railway)
- Included di Railway.app
- MySQL full features
- Backup included

### Opsi 2: PlanetScale (MySQL as a Service)
```
Link: https://planetscale.com
Cost: $35/bulan (atau free tier limited)
Pros: Highly scalable, branch management
Cons: MySQL syntax sometimes different
```

### Opsi 3: MongoDB Atlas (NoSQL)
```
Link: https://www.mongodb.com/cloud/atlas
Cost: Free tier 512MB
Pros: NoSQL, scalable
Cons: Need to change schema
```

---

## ⚡ OPTIMASI UNTUK HOSTING KECIL

### 1. Disable React Compiler (jika slow)
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // reactCompiler: true, // Disable ini jika RAM limited
};
```

### 2. Enable Static Optimization
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};
```

### 3. Database Connection Pooling
```typescript
// Prisma auto-pools, tapi bisa optimize:
// prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  // connectionLimit = 5  (untuk shared hosting)
}
```

### 4. Reduce Bundle Size
```bash
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# Update next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({...})

# Run
ANALYZE=true npm run build
```

---

## 🔐 SECURITY CHECKLIST

```
✅ DATABASE_URL tidak di-commit
✅ .env.local di .gitignore
✅ Use HTTPS (auto di Vercel/Railway)
✅ Set CORS jika perlu
✅ SQL Injection protection (Prisma auto)
✅ Rate limiting (optional)
✅ Environment variable encryption
```

---

## 🐛 TROUBLESHOOTING

### Build Error: "Module not found"
```bash
# Solution:
npm install
npm run build
```

### Database Connection Failed
```bash
# Check:
1. DATABASE_URL correct format
2. MySQL service running
3. Firewall/network access
4. User credentials valid
```

### Slow Performance
```bash
# Optimize:
1. Check deployment logs
2. Enable caching headers
3. Optimize images
4. Database query optimization
5. Upgrade hosting tier
```

---

## 📊 COST COMPARISON

| Platform | Compute | Database | Total/bulan |
|----------|---------|----------|------------|
| Vercel   | Free    | $35+     | $35+       |
| Railway  | $5+     | Included | $5-15      |
| Render   | Free    | $7+      | $7-15      |
| Heroku   | $7+     | Included | $7+        |

---

## 🎯 REKOMENDASI FINAL

### Untuk Development/Testing
✅ **Vercel + PlanetScale** (atau free tier)
- Setup cepat
- Gratis untuk start
- Growth: +$35/bulan untuk database

### Untuk Production/Small Business
✅ **Railway.app** ⭐ BEST VALUE
- All-in-one solution
- $5-20/bulan
- MySQL included
- Auto-deploy
- Indonesia-friendly

### Untuk Skala Besar
✅ **AWS / GCP / Digital Ocean**
- Lebih mahal tapi powerful
- $5+/bulan untuk compute
- Flexible scaling

---

## 🚀 QUICK START (Railway.app)

```bash
# 1. Login ke Railway
# 2. Connect GitHub
# 3. Select repo
# 4. Add MySQL
# 5. Set DATABASE_URL
# 6. npm run build
# 7. npm start
# DONE! ✅
```

---

## 📞 NEXT STEPS

1. **Pilih platform**: Railway.app (recommended)
2. **Prepare aplikasi**: npm run build test
3. **Push GitHub**: git push
4. **Setup database**: MySQL service
5. **Deploy**: Click deploy!
6. **Monitor**: Check logs di dashboard

---

**Tips:** Start dengan free tier dulu, upgrade saat traffic meningkat. Railway.app paling fleksibel untuk ini!
