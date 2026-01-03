# ✅ DEPLOYMENT CHECKLIST

## 🔧 Pre-Deployment (Sebelum Deploy)

### Kode & Build
- [ ] `npm install` sudah dijalankan
- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run dev` berjalan lancar locally
- [ ] Tidak ada console errors
- [ ] Testing features sudah cek

### Git & Repository
- [ ] Semua file ter-commit
- [ ] `.env.local` sudah di `.gitignore`
- [ ] `.next/` sudah di `.gitignore`
- [ ] `node_modules/` sudah di `.gitignore`
- [ ] Push ke GitHub/GitLab

### Environment Variables
- [ ] `.env.example` sudah dibuat
- [ ] DATABASE_URL format benar
- [ ] NODE_ENV=production
- [ ] API endpoints dikonfigurasi

### Database
- [ ] MySQL server ready
- [ ] Database sudah dibuat
- [ ] `npx prisma db push` berhasil
- [ ] `npx prisma generate` berhasil
- [ ] Schema migrations ter-track

### Security
- [ ] Tidak ada hardcoded credentials
- [ ] API keys di environment variables
- [ ] CORS dikonfigurasi jika perlu
- [ ] HTTPS ready (hosting akan handle)
- [ ] SQL injection protections (Prisma)

---

## 🚀 Deployment Process (Pilih Salah Satu)

### ✅ Railway.app (RECOMMENDED)

**Pre-Deploy:**
- [ ] GitHub account connected
- [ ] Repository public atau accessible
- [ ] .env.example ada

**During Deploy:**
```bash
# 1. Create Railway project
# 2. Connect GitHub repository
# 3. Select branch: main
# 4. Add MySQL service
  - [ ] Credentials saved
  - [ ] DATABASE_URL copied
# 5. Set environment variables
  - [ ] DATABASE_URL
  - [ ] NODE_ENV=production
# 6. Deploy
  - [ ] Build successful
  - [ ] Logs no errors
  - [ ] App running on URL
```

**Post-Deploy:**
- [ ] Run Prisma migrations: `railway run npx prisma db push`
- [ ] Test homepage loading
- [ ] Test API endpoints
- [ ] Test database operations
- [ ] Check logs for errors

---

### ✅ Vercel

**Pre-Deploy:**
- [ ] GitHub account connected
- [ ] Repository configured

**During Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
  [ ] Connect to GitHub? Yes
  [ ] Set project name
  [ ] Framework preset: Next.js
  [ ] Root directory: ./
```

**Post-Deploy:**
- [ ] Add environment variables di Vercel dashboard:
  - [ ] DATABASE_URL
  - [ ] NODE_ENV=production
- [ ] Redeploy setelah set env vars
- [ ] Test aplikasi

---

### ✅ Render.com

**Pre-Deploy:**
- [ ] GitHub connected

**During Deploy:**
```
1. Go to https://render.com/dashboard
2. New → Web Service
3. Connect GitHub
4. Select penjadwalan-guru repo
5. Configuration:
   - Name: penjadwalan-guru
   - Environment: Node
   - Region: Singapore (untuk kecepatan ke ID)
   - Branch: main
   - Build Command: npm run build
   - Start Command: npm start
6. Environment:
   - DATABASE_URL: <from PostgreSQL service>
   - NODE_ENV: production
7. Create Web Service
```

**Add Database:**
```
1. New → PostgreSQL
2. Name: penjadwalan-guru-db
3. Region: Singapore
4. Copy connection string
5. Add to Web Service env
```

---

### ✅ Docker (VPS/Self-Hosted)

**Pre-Deploy:**
- [ ] VPS/Server ready (DigitalOcean, Linode, AWS, GCP)
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] SSH access ready

**During Deploy:**
```bash
# 1. SSH ke server
ssh user@server.com

# 2. Clone repository
git clone https://github.com/you/penjadwalan-guru.git
cd penjadwalan-guru

# 3. Create .env.production
cat > .env.production << EOF
DATABASE_URL="mysql://user:password@mysql:3306/penjadwalan_guru"
NODE_ENV=production
EOF

# 4. Build & run
docker-compose up -d

# 5. Run migrations
docker-compose exec app npx prisma db push

# 6. Check logs
docker-compose logs -f app
```

---

## 🧪 Post-Deployment Testing

### Basic Testing
- [ ] Homepage loads
- [ ] Sidebar navigation works
- [ ] Dashboard displays statistics
- [ ] Can navigate to all pages

### Guru Module
- [ ] View guru list
- [ ] Add guru
- [ ] Edit guru
- [ ] Delete guru
- [ ] View guru mapel

### Jadwal Module
- [ ] View jadwal list
- [ ] Filter jadwal (guru, kelas, mapel)
- [ ] Search jadwal
- [ ] Generate jadwal otomatis
- [ ] Add jadwal manual

### Database
- [ ] Data persists after refresh
- [ ] Database connects correctly
- [ ] No timeout errors
- [ ] Queries responsive

### Performance
- [ ] Pages load in <2s
- [ ] API response <500ms
- [ ] No console errors
- [ ] Memory usage stable

---

## 📊 Monitoring After Deploy

### Daily
- [ ] Check logs for errors
- [ ] Monitor response times
- [ ] Check database usage

### Weekly
- [ ] Review application logs
- [ ] Check error rates
- [ ] Verify backup working

### Monthly
- [ ] Performance analysis
- [ ] Database optimization
- [ ] Security audit

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failed | Check `npm run build` locally |
| Database not connecting | Verify DATABASE_URL format |
| 502 Bad Gateway | Check application logs |
| Slow performance | Optimize queries, check logs |
| Cannot connect | Check firewall/security groups |
| Out of memory | Upgrade tier atau optimize app |

---

## 📞 Support Links

- **Railway**: https://docs.railway.app/support
- **Vercel**: https://vercel.com/support
- **Render**: https://render.com/docs
- **Docker**: https://docs.docker.com/

---

## ✨ Final Checklist

- [ ] Deployment successful
- [ ] Application accessible
- [ ] Database working
- [ ] All features tested
- [ ] No error logs
- [ ] Monitoring setup
- [ ] Backup configured
- [ ] Domain configured (optional)

**Status**: ✅ Ready for Production!
