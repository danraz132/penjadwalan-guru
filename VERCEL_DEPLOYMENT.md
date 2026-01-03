# 🚀 Panduan Deploy ke VERCEL

## ✅ Prasyarat
- ✅ GitHub repository sudah setup: https://github.com/danraz132/penjadwalan-guru
- ✅ Aplikasi sudah di-push ke GitHub
- ✅ Akun GitHub aktif
- ✅ Aplikasi sudah build berhasil (`npm run build`)

---

## 📋 LANGKAH DEPLOYMENT VERCEL

### Step 1: Login ke Vercel
```
1. Buka https://vercel.com
2. Klik "Sign Up"
3. Pilih "Continue with GitHub"
4. Authorize Vercel untuk akses GitHub
```

### Step 2: Create New Project
```
1. Di Vercel dashboard, klik "Add New..." > "Project"
2. Klik "Continue with GitHub"
3. Cari repository "penjadwalan-guru"
4. Klik "Import"
```

### Step 3: Configure Project
```
Framework: Next.js (auto-detected)
Build Command: npm run build (auto-filled)
Output Directory: .next (auto-filled)
Environment Variables: (akan diisi di step berikutnya)
```

**KLIK "Continue"**

### Step 4: Set Environment Variables

⚠️ **PENTING**: Database ini tidak bisa run di Vercel serverless secara langsung!

Anda punya 2 opsi:

#### **OPSI A: Gunakan PlanetScale (MySQL as a Service)** ✅ RECOMMENDED

1. **Buat akun PlanetScale**
   ```
   https://planetscale.com
   Sign up dengan GitHub
   ```

2. **Buat database di PlanetScale**
   ```
   1. Login PlanetScale
   2. Click "Create New Database"
   3. Beri nama: penjadwalan-guru
   4. Select region: Singapore (terdekat Indonesia)
   5. Create main branch
   ```

3. **Get connection string**
   ```
   1. Di PlanetScale dashboard, click database
   2. Click "Connect"
   3. Select "Node.js"
   4. Copy MySQL connection string
   Format: mysql://user:password@host/dbname
   ```

4. **Set di Vercel**
   ```
   Di Vercel project settings:
   Environment Variables:
   
   DATABASE_URL = [paste connection string dari PlanetScale]
   NODE_ENV = production
   ```

5. **Run migrations**
   ```bash
   # After deployment, run:
   npm run build
   npx prisma db push
   npx prisma generate
   ```

#### **OPSI B: Gunakan Railway.app** (Lebih murah)

Lihat [HOSTING_QUICKSTART.md](HOSTING_QUICKSTART.md) untuk setup Railway.app

---

## 🔧 VERCEL + PLANETSCALE SETUP (DETAIL)

### A. PlanetScale Configuration

1. **Sign Up PlanetScale**
   - https://planetscale.com
   - Authenticate dengan GitHub

2. **Create Database**
   ```
   Name: penjadwalan-guru
   Region: Singapore (Asia)
   Branch: main
   ```

3. **Get Connection String**
   ```
   Navigate to: Settings > Passwords
   Create new password
   Format: mysql://[username]:[password]@[host]/penjadwalan_guru
   ```

### B. Vercel Configuration

1. **Connect GitHub to Vercel**
   ```
   1. https://vercel.com/new
   2. Import from GitHub
   3. Select: danraz132/penjadwalan-guru
   ```

2. **Environment Variables**
   ```
   Sebelum klik "Deploy", masukkan:
   
   DATABASE_URL: mysql://user:pass@host/penjadwalan_guru
   NODE_ENV: production
   ```

3. **Deploy**
   ```
   Klik "Deploy"
   Tunggu ~2-5 menit
   ```

### C. Post-Deployment Setup

**Important**: Next.js API routes + Prisma butuh setup migrations setelah deploy pertama

#### Opsi 1: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Run migrations di production
vercel env pull  # Download .env dari Vercel

npx prisma db push  # Push schema ke database
npx prisma generate  # Generate client
```

#### Opsi 2: Manual (Recommended)
```bash
# 1. Local: Update .env dengan DATABASE_URL dari PlanetScale
nano .env.local
# Masukkan: DATABASE_URL=mysql://...

# 2. Run migrations locally
npx prisma db push
npx prisma generate

# 3. Test locally
npm run dev

# 4. Push ke GitHub
git add .
git commit -m "Setup database migrations"
git push origin main

# 5. Vercel auto-redeploy
```

---

## 📊 PLANETSCALE PRICING

| Tier | Cost | Features |
|------|------|----------|
| **Free** | Free | 10GB data, 5 connections |
| **Scaler** | $29/bulan | 100GB data, unlimited |
| **Pro** | $79/bulan | 300GB data, dedicated |

**Untuk app kecil: FREE TIER cukup!**

---

## ⚠️ VERCEL LIMITATIONS

### ❌ Vercel Serverless Problems:
1. **Function timeout**: 10-60 detik
   - API yang kompleks (generate jadwal) bisa timeout
   - Solusi: Cache hasil atau gunakan background jobs

2. **No persistent storage**
   - Harus gunakan external database (PlanetScale)

3. **Cold starts**
   - First request bisa lambat (1-2 detik)

### ✅ Solutions:
- PlanetScale untuk database (recommended)
- Railway.app untuk full stack (lebih stabil)
- AWS Lambda jika butuh durability

---

## 🎯 DEPLOYMENT CHECKLIST (Vercel + PlanetScale)

### Pre-Deployment
- [ ] GitHub repository setup ✅
- [ ] Code pushed to main branch ✅
- [ ] Local build successful ✅
- [ ] .env.example updated

### PlanetScale Setup
- [ ] PlanetScale account created
- [ ] Database created (penjadwalan-guru)
- [ ] Main branch initialized
- [ ] Password generated
- [ ] Connection string copied

### Vercel Setup
- [ ] GitHub connected to Vercel
- [ ] Project imported
- [ ] Environment variables set:
  - [ ] DATABASE_URL
  - [ ] NODE_ENV=production
- [ ] Deployment triggered

### Post-Deployment
- [ ] Vercel deployment successful
- [ ] Domain accessible
- [ ] Database migrations run
- [ ] Test all CRUD operations
- [ ] Test search/filter
- [ ] Test auto-schedule generation

---

## 🧪 TESTING AFTER DEPLOYMENT

### 1. Access Application
```
https://penjadwalan-guru-[random].vercel.app
(atau custom domain jika sudah setup)
```

### 2. Test Features
```
✅ Dashboard loads
✅ Guru page loads with search
✅ Kelas page loads
✅ Mapel page loads
✅ Ruangan page loads
✅ Jadwal page loads
✅ Create new guru works
✅ Edit guru works
✅ Delete guru works
✅ Auto-schedule generation works
✅ Database shows data
```

### 3. Check Logs
```
Vercel Dashboard > Project > Deployments > Recent
Check logs for errors
```

---

## 🐛 TROUBLESHOOTING

### Error: "DATABASE_URL is not set"
```
Solution:
1. Check Vercel dashboard > Settings > Environment Variables
2. Verify DATABASE_URL is set
3. Redeploy: git push origin main (auto redeploy)
```

### Error: "Prisma schema not found"
```
Solution:
1. Verify prisma/schema.prisma exists
2. Run: npx prisma generate
3. Commit & push to GitHub
4. Redeploy
```

### Error: "Connection timeout"
```
Solution:
1. Check PlanetScale database status
2. Verify connection string format
3. Test connection locally: npx prisma db push
4. Check firewall/network settings in PlanetScale
```

### 502 Bad Gateway
```
Solution:
1. Usually temporary, wait 1 minute
2. Check Vercel logs
3. Restart deployment: Redeploy > Redeploy
```

### Function timeout (generating schedule slow)
```
Solution:
1. Optimize algorithm (current: 25 slots/week OK)
2. Cache results
3. Use cron jobs / background tasks
4. Upgrade to Railway.app (better for this use case)
```

---

## 📈 NEXT STEPS

### 1. Monitor Application
```
- Vercel Analytics dashboard
- Error tracking
- Performance monitoring
```

### 2. Custom Domain (Optional)
```
Vercel > Settings > Domains
Add your custom domain (cost varies)
Setup DNS records
```

### 3. CI/CD Pipeline (Auto)
```
✅ Already setup via Vercel
- Push to GitHub main branch
- Vercel auto-deploys
- No additional config needed
```

### 4. Backup Database (Important!)
```
PlanetScale > Database Settings > Backups
Enable automatic backups
Schedule: Daily recommended
```

---

## 💰 ESTIMATED COSTS

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Free tier OK for development |
| PlanetScale | Free | Free tier: 10GB OK untuk app kecil |
| Custom Domain | ~$10-15/year | Optional |
| **TOTAL** | **Free** | Fully free tier possible! |

---

## 🚀 QUICK SUMMARY

### Vercel + PlanetScale Setup:
```
1. Sign up PlanetScale ✅
2. Create database
3. Get connection string
4. Sign up Vercel
5. Import GitHub repo
6. Set DATABASE_URL in env vars
7. Deploy
8. Run: npx prisma db push
9. Test application
10. Done! 🎉
```

### Estimated Time: 30-45 menit

---

## 📞 SUPPORT LINKS

- **Vercel Docs**: https://vercel.com/docs
- **PlanetScale Docs**: https://planetscale.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma ORM**: https://www.prisma.io/docs
- **GitHub Issues**: https://github.com/danraz132/penjadwalan-guru/issues

---

## ⚡ ALTERNATIVE: Railway.app

Jika Vercel + PlanetScale terlalu kompleks atau timeout issues:

**Gunakan Railway.app:**
- ✅ All-in-one (database included)
- ✅ Simpler setup (8 steps)
- ✅ Better for Node.js + MySQL
- ✅ $5-15/bulan all-in

Lihat: [HOSTING_QUICKSTART.md](HOSTING_QUICKSTART.md)

---

**Pilihan terbaik untuk production: Railway.app**

**Pilihan terbaik untuk free tier: Vercel + PlanetScale**

Good luck! 🚀
