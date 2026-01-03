# 💰 PANDUAN HOSTING COMPLETELY FREE

## ✅ OPSI FULLY FREE

### ✨ OPSI 1: Vercel FREE + PlanetScale FREE (RECOMMENDED)
| Layanan | Cost | Limit |
|---------|------|-------|
| **Vercel** | 🆓 FREE | Unlimited deployments, 1GB bandwidth |
| **PlanetScale** | 🆓 FREE | 10GB data, 5 connections |
| **TOTAL** | **🆓 100% FREE** | Cukup untuk app kecil |

**Setup: 30 menit**

---

### ✨ OPSI 2: Render FREE + PlanetScale FREE
| Layanan | Cost | Limit |
|---------|------|-------|
| **Render** | 🆓 FREE | 750 hours/bulan (sleep mode) |
| **PlanetScale** | 🆓 FREE | 10GB data |
| **TOTAL** | **🆓 100% FREE** | Tapi slow waktu sleep |

**Setup: 20 menit**

---

### ✨ OPSI 3: GitHub Pages + Static Export (LIMITED)
| Layanan | Cost | Fitur |
|---------|------|-------|
| **GitHub Pages** | 🆓 FREE | Static hosting unlimited |
| **Database** | ❌ Perlu $35/bulan | Atau local JSON |
| **Status** | ⚠️ | Hilang fitur dynamic |

**⚠️ NOT RECOMMENDED** - Hilang semua fitur interaktif

---

### ✨ OPSI 4: Self-Hosted (LOCAL VPS SENDIRI)
```
Jika punya server/laptop yang bisa hidup 24/7:
- Vercel: FREE
- Database: FREE (local MySQL)
- Hosting: FREE (pake server sendiri)
- Total: 🆓 GRATIS
```

---

## 🚀 REKOMENDASI BEST FREE OPTION

### ⭐⭐⭐ OPSI TERBAIK: Vercel + PlanetScale Free

**Kenapa?**
- ✅ Fully functional app (semua fitur jalan)
- ✅ 100% FREE
- ✅ Good performance
- ✅ Scalable (upgrade ke paid kapan saja)
- ✅ Professional hosting
- ✅ Auto-deploys dari GitHub
- ✅ SSL included
- ✅ Global CDN

**Limitations Free Tier:**
- PlanetScale: 10GB data (OK untuk app kecil)
- Vercel: 1GB bandwidth/bulan (OK untuk traffic kecil)
- Database connections: 5 concurrent

**Cocok untuk:**
- ✅ Development & testing
- ✅ Prototype
- ✅ Thesis project
- ✅ Small to medium traffic

---

## 📝 SETUP VERCEL + PLANETSCALE (COMPLETELY FREE)

### Step 1: Setup PlanetScale
```bash
1. Buka https://planetscale.com
2. Klik "Sign Up" atau "Sign Up with GitHub"
3. Authorize & complete signup
4. Create new database:
   - Name: penjadwalan-guru
   - Region: Singapore (Asia)
   - Branch: main
5. Click "Connect"
6. Select "Node.js" tab
7. Copy connection string (MySQL format)
```

### Step 2: Setup Vercel
```bash
1. Buka https://vercel.com
2. Klik "Sign Up" atau "Continue with GitHub"
3. Authorize GitHub
4. Click "Add New" > "Project"
5. Select repository: danraz132/penjadwalan-guru
6. Click "Import"
```

### Step 3: Configure Environment
```
Di Vercel Project Settings:

Environment Variables:
- Name: DATABASE_URL
- Value: [paste PlanetScale connection string]

- Name: NODE_ENV  
- Value: production

Klik "Save"
```

### Step 4: Deploy
```
Di Vercel:
1. Klik "Deploy"
2. Tunggu 2-5 menit
3. Get live URL
```

### Step 5: Setup Database Migrations
```bash
# Local machine:
1. Copy PlanetScale connection string ke .env.local
   DATABASE_URL="mysql://..."

2. Run migrations:
   npx prisma db push

3. Verify:
   npx prisma studio  # See database visually

4. If success, push ke GitHub:
   git add .
   git commit -m "Setup database migrations"
   git push origin main

5. Vercel auto-redeploy
```

---

## 🎯 CHECKLIST VERCEL + PLANETSCALE FREE

### Pre-Deployment
- [ ] GitHub repository: https://github.com/danraz132/penjadwalan-guru
- [ ] Local build tested: `npm run build` ✅
- [ ] Code pushed to main branch ✅

### PlanetScale Setup
- [ ] Create PlanetScale account
- [ ] Create database (penjadwalan-guru)
- [ ] Generate MySQL password
- [ ] Copy connection string

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub
- [ ] Import project
- [ ] Set DATABASE_URL env var
- [ ] Deploy
- [ ] Verify deployment successful

### Post-Deployment Testing
- [ ] Access live URL
- [ ] Run `npx prisma db push`
- [ ] Test guru CRUD
- [ ] Test kelas CRUD
- [ ] Test mapel CRUD
- [ ] Test ruangan CRUD
- [ ] Test jadwal search
- [ ] Test auto-schedule generation
- [ ] Verify data appears in database

---

## 🔐 SECURITY WITH FREE TIER

```
Vercel + PlanetScale Free:
✅ HTTPS (included, auto SSL)
✅ Password protected (PlanetScale)
✅ Environment variables encrypted
✅ GitHub webhook secured
✅ No credit card required*

*PlanetScale dan Vercel both punya free tier tanpa CC
```

---

## 📊 PLANETSCALE FREE TIER DETAILS

```
Storage: 10GB
  → Cukup untuk ~1 juta record guru+kelas+jadwal

Concurrent Connections: 5
  → Cukup untuk 5 concurrent users
  → OK untuk thesis project

Monthly Insights: Limited
  → Cukup untuk monitoring basic

Auto-backup: Yes (included)
  → Daily backups

API Rate Limit: 100k/bulan
  → More than enough
```

---

## ⚠️ PlanetScale vs Self-Hosted MySQL

| Aspek | PlanetScale | Self-Hosted |
|-------|------------|------------|
| Cost | FREE tier | 0 (pake server sendiri) |
| Setup | 5 menit | 30+ menit |
| Reliability | 99.9% uptime | Tergantung server |
| Backup | Automatic | Manual |
| Performance | Good globally | Lokasi dependent |
| Scaling | Easy (upgrade) | Complex |

**Untuk thesis: PlanetScale FREE lebih praktis**

---

## 🚀 FULL DEPLOYMENT WORKFLOW

```
Local Development (saat ini)
        ↓
npm run build (verify)
        ↓
git push origin main
        ↓
GitHub repository updated
        ↓
Vercel webhook triggered
        ↓
Vercel auto-build & deploy
        ↓
PlanetScale connected
        ↓
Database migrations run
        ↓
Live at: https://[project].vercel.app
        ↓
✅ DONE!
```

---

## 💻 LOCAL DEVELOPMENT SETUP (BEFORE DEPLOYMENT)

```bash
# 1. Create .env.local
echo 'DATABASE_URL="mysql://user:pass@host/db"' > .env.local

# 2. Run locally
npm run dev

# 3. Test CRUD operations
# Open http://localhost:3000

# 4. Verify database
npx prisma studio

# 5. If all OK, deploy to Vercel
git push origin main
```

---

## 🎓 TIPS UNTUK THESIS

### Data Seeding (Add test data)
```bash
npx prisma db seed
# Edit prisma/seed.ts untuk add test data
```

### Database Visualization
```bash
npx prisma studio
# View/edit database in web UI
```

### Monitoring Production
```
Vercel Dashboard:
- See live logs
- Monitor performance
- Check error logs
- View build history
```

### Backup Database
```
PlanetScale Dashboard:
- Automatic backups included
- Can export SQL dump
- Can restore from backup
```

---

## 🐛 TROUBLESHOOTING FREE TIER

### PlanetScale: "Connection pool exhausted"
```
Cause: Too many concurrent connections
Solution:
- Use connection pooling
- Reduce concurrent connections
- Upgrade to paid tier

For now: Restart is fine
```

### Vercel: "Build timeout"
```
Cause: Build takes >45 minutes
Solution: Usually doesn't happen with Next.js
If it does: Optimize dependencies
```

### Database: "Data limit reached"
```
When: 10GB PlanetScale limit exceeded
Solution:
- Delete old test data
- Upgrade to paid
- Archive old records

For thesis: unlikely to happen
```

---

## 📈 UPGRADE PATH (When needed)

### Small Traffic Upgrade
```
Vercel: FREE → PRO ($20/bulan)
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

PlanetScale: FREE → SCALER ($29/bulan)
- 100GB storage
- Unlimited connections
- Better performance
```

### Full Stack Upgrade
```
Better: Switch to Railway.app ($5-15/bulan)
- All-in-one solution
- Better for Node.js + MySQL
- Simpler management
```

---

## 🎯 FINAL RECOMMENDATION

```
┌─────────────────────────────────────┐
│  FOR THESIS (COMPLETELY FREE)       │
│                                     │
│  Vercel FREE + PlanetScale FREE     │
│                                     │
│  ✅ Fully functional                │
│  ✅ Professional hosting            │
│  ✅ 100% FREE                       │
│  ✅ Easy deployment                 │
│  ✅ Auto-scaling                    │
│  ✅ Global performance              │
│                                     │
│  Setup time: 30 menit               │
│  Cost: 💯 FREE FOREVER              │
└─────────────────────────────────────┘
```

---

## 📞 NEXT STEPS

### Pilihan A: Lanjut Vercel + PlanetScale
1. Buat akun PlanetScale
2. Buat database
3. Copy connection string
4. Deploy ke Vercel
5. Done! 🚀

### Pilihan B: Setup Render Free
Lihat [HOSTING_QUICKSTART.md](HOSTING_QUICKSTART.md)

### Pilihan C: Self-Hosted (advanced)
Lihat [RUMAHWEB_GUIDE.md](RUMAHWEB_GUIDE.md) untuk setup VPS

---

**Rekomendasi untuk thesis: Vercel + PlanetScale FREE** ✨

Bisa deploy dalam 30 menit, fully functional, 100% FREE!

Mau mulai setup?
