# 🌐 PANDUAN HOSTING APLIKASI PENJADWALAN GURU

Dokumen ini menjelaskan cara hosting aplikasi Next.js Penjadwalan Guru di berbagai platform hosting kecil/terjangkau.

## 📋 Daftar Isi
1. [Ringkasan Hosting Options](#ringkasan-hosting-options)
2. [Rekomendasi Platform](#rekomendasi-platform)
3. [Step-by-Step Railway.app](#railway-deployment)
4. [Alternatif Lainnya](#alternatif)
5. [Cost Comparison](#cost-comparison)

---

## 🎯 Ringkasan Hosting Options

### Top 5 Platform untuk Next.js + MySQL

| No | Platform | Harga | Setup | Cocok Untuk |
|----|----------|-------|-------|------------|
| 1 | **Railway.app** | $5-20/mo | ⭐⭐⭐ (15 min) | Startup, SMEs |
| 2 | Vercel | Free-$35+/mo | ⭐⭐ (5 min) | Vercel native |
| 3 | Render.com | Free-$20+/mo | ⭐⭐⭐ (20 min) | Production |
| 4 | Heroku | $7+/mo | ⭐⭐⭐ (15 min) | Learning |
| 5 | Docker VPS | $5+/mo | ⭐ (45 min) | Full control |

---

## 💡 REKOMENDASI TERBAIK: Railway.app

### Kenapa Railway?
✅ **All-in-one solution** - Compute + Database bundled  
✅ **Affordable** - Mulai $5/bulan  
✅ **Beginner friendly** - No DevOps knowledge needed  
✅ **MySQL included** - Tidak perlu service terpisah  
✅ **Auto-deploy** - Push ke GitHub, deploy otomatis  
✅ **Indonesia-friendly** - Support payment methods lokal  
✅ **Good documentation** - Mudah diikuti  

### Harga Railway.app
```
Free tier untuk testing:
- $5 credit per bulan
- Enough untuk small app

Production pricing:
- Compute: $5-10/bulan
- Database: Included
- Total: ~$5-15/bulan

Scaling:
- Bisa scale up kapan saja tanpa downtime
```

---

## 🚀 QUICK START: Railway.app (15 Menit)

### Prerequisite
- ✅ Aplikasi sudah siap (npm run build berhasil)
- ✅ GitHub account
- ✅ Repo sudah push ke GitHub

### Step-by-Step

#### 1. Prepare Aplikasi
```bash
# Di local machine:

# Build test
npm run build

# Jika ada error, fix dulu!

# Push ke GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Sign Up Railway.app
```
1. Go to: https://railway.app
2. Click "Start Project"
3. Sign up dengan GitHub
4. Authorize Railway untuk akses GitHub
```

#### 3. Create New Project
```
1. Click "Create New Project"
2. Select "Deploy from GitHub"
3. Find & select: penjadwalan-guru
4. Select branch: main
5. Click "Deploy"
```

#### 4. Add MySQL Service
```
1. Dashboard muncul, click "Add Service"
2. Select "MySQL"
3. Wait untuk initialization (~30 detik)
4. MySQL service siap!
```

#### 5. Configure Environment
```
Railway dashboard akan show:

User: xxxxxxxx
Password: xxxxxxxx
Host: xxxxxxxx.railway.internal
Port: 3306

Buat DATABASE_URL:
mysql://xxxxxxxx:xxxxxxxx@xxxxxxxx.railway.internal:3306/railway
```

#### 6. Set Environment Variables
```
1. Click "Variables" tab
2. Add environment:
   KEY: DATABASE_URL
   VALUE: mysql://user:pass@host:3306/railway

3. Add:
   KEY: NODE_ENV
   VALUE: production

4. Save!
```

#### 7. Deploy & Run Migrations
```bash
# Di Railway dashboard:
1. Click "Deploy" button
2. Wait build process (~2-5 menit)
3. Lihat logs - tunggu "Ready in X seconds"

# Run migrations (penting!):
1. Click "Railway CLI" (terminal icon)
2. Jalankan:
   railway run npx prisma migrate deploy
   # Atau:
   railway run npx prisma db push
```

#### 8. Access Aplikasi
```
Dashboard Railway akan show deployment URL:
https://penjadwalan-guru-xxxx.railway.app

Buka di browser → aplikasi live! 🎉
```

---

## 📊 Railway.app Dashboard

### Important Features:
```
Left sidebar:
├── Deployments: Lihat history deployment
├── Logs: Real-time application logs
├── Volumes: Storage (jika perlu)
├── Integrations: Connect third party
└── Settings: Project configuration

Top navigation:
├── Services: Manage MySQL + App
├── Variables: Environment variables
├── Monitoring: Performance metrics
└── Analytics: Usage data
```

---

## 🔧 TROUBLESHOOTING Railway.app

### Deployment gagal?
```
1. Check build logs - lihat error message
2. Common issues:
   - Missing package? → npm install
   - Build error? → npm run build locally dulu
   - Wrong Node version? → Check package.json engines

3. Fix lokal, push ke GitHub, redeploy
```

### Database tidak connect?
```
1. DATABASE_URL format benar? 
   Format: mysql://user:password@host:port/database

2. Environment variables set?
   Check "Variables" tab

3. MySQL service running?
   Check "Services" tab - MySQL status

4. Database exists?
   Connect ke MySQL, cek database ada
```

### Aplikasi crash?
```
1. Check logs (Logs tab)
2. Common fixes:
   - Insufficient memory? → Upgrade tier
   - Database query slow? → Optimize queries
   - Missing env var? → Add to Variables
```

---

## 🆚 PERBANDINGAN DENGAN ALTERNATIF

### Vercel
```
Pros:
+ Sangat cepat (built by Next.js team)
+ Edge functions available
+ Serverless default

Cons:
- Database tidak included (harus PlanetScale ~$35/mo)
- Tidak beginner-friendly untuk setup database
- Cold starts pada edge functions

Verdict: Lebih mahal untuk setup awal
```

### Render.com
```
Pros:
+ Good documentation
+ Free static sites
+ Native PostgreSQL support

Cons:
- Free tier punya sleep mode (tidak ideal production)
- Slightly more complex setup
- Database berbayar terpisah

Verdict: Bagus tapi Railway lebih praktis
```

### Heroku
```
Pros:
+ Dahulu favorite, banyak resources
+ CLI tools lengkap

Cons:
- Free tier dihapus (Oct 2022)
- Minimum $7/bulan sekarang
- Older technology stack
- Not recommended for new projects

Verdict: Skip - gunakan Railway atau Render
```

### Self-hosted (VPS)
```
Pros:
+ Full control
+ Bisa customize everything
+ Potentially cheaper untuk scale

Cons:
- Need Linux/DevOps knowledge
- Need to manage security
- Need to manage backups
- More maintenance

Verdict: Untuk advanced users saja
```

---

## 💰 COST BREAKDOWN

### Option 1: Railway.app (BEST VALUE)
```
Setup: $0 (1x)
Monthly:
  - Compute: $5-10
  - Database: Included
  - Total: $5-15/bulan

Scaling (contoh untuk 100 users):
  - Still $5-15/bulan!

Example bill:
  Month 1: $10 (startup)
  Month 2-12: $10-15 each
  Year 1: ~$140
```

### Option 2: Vercel + PlanetScale
```
Setup: $0 (1x)
Monthly:
  - Vercel: Free-$20
  - PlanetScale: $35
  - Total: $35+/bulan

Example bill:
  Month 1: $35 (startup)
  Month 2-12: $35+ each
  Year 1: ~$420+

⚠️ Jauh lebih mahal dari Railway!
```

### Option 3: Self-hosted Docker (VPS)
```
Setup: $0 (1x)
Monthly:
  - VPS (Linode/DO): $5-10
  - Domain: $1-3
  - Total: $6-13/bulan

BUT:
  - Needs Linux knowledge
  - Needs maintenance
  - Needs monitoring
  - Time investment ~2-3 jam/bulan

Better untuk advanced users
```

---

## 📈 SCALING STRATEGY

### Month 1-2 (Testing)
```
Railway.app $5-10/bulan
→ Free $5 credit + $0-5 out of pocket
```

### Month 3-6 (Growth)
```
Railway.app $10-20/bulan
→ Maybe upgrade tier
→ Still very affordable
```

### Month 6+ (Success!)
```
Options:
1. Stay Railway.app ($20-50/bulan) - recommended
2. Scale ke Kubernetes (advanced)
3. Move to Cloud (AWS/GCP)
```

---

## 🔒 SECURITY CHECKLIST (Pre-Deploy)

```
✅ Environment variables:
   - DATABASE_URL encrypted
   - No secrets in code
   - .env.local in .gitignore

✅ Database:
   - User dengan limited privileges
   - Strong password
   - Firewall rules

✅ Application:
   - Prisma auto-prevents SQL injection
   - HTTPS enforced (hosting auto)
   - CORS configured

✅ Deployment:
   - Only deploy from clean git
   - No uncommitted secrets
   - Regular backups
```

---

## 📞 GETTING HELP

### Railway.app Resources
- Docs: https://docs.railway.app
- Status: https://status.railway.app
- Community: https://railway.app/community

### Next.js Resources
- Docs: https://nextjs.org/docs
- Deployment: https://nextjs.org/docs/deployment

### Prisma Resources
- Docs: https://www.prisma.io/docs/

---

## ✅ FINAL DEPLOYMENT CHECKLIST

Before deploying:
- [ ] npm run build works locally
- [ ] .env.local configured
- [ ] DATABASE_URL correct
- [ ] npx prisma db push successful
- [ ] All git changes committed
- [ ] Push ke GitHub done

During deployment:
- [ ] GitHub connected
- [ ] MySQL service added
- [ ] Environment variables set
- [ ] First deployment successful

After deployment:
- [ ] Access aplikasi dari URL
- [ ] Test all features
- [ ] Check logs for errors
- [ ] Monitor performance

---

## 🎉 SUKSES!

Aplikasi Penjadwalan Guru sudah live! 

Next steps:
1. Monitor logs regularly
2. Backup database regularly
3. Update dependencies regularly
4. Scale resources saat perlu
5. Collect user feedback

**Happy hosting! 🚀**
