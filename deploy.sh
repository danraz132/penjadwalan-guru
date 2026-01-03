#!/bin/bash

# Script Deployment untuk berbagai platform

echo "🚀 Aplikasi Penjadwalan Guru - Deployment Script"
echo "=================================================="
echo ""
echo "Pilih platform hosting:"
echo "1. Railway.app (Recommended)"
echo "2. Vercel"
echo "3. Render.com"
echo "4. Heroku"
echo "5. Docker Local"
echo ""

read -p "Masukkan pilihan (1-5): " choice

case $choice in
  1)
    echo "📦 Preparing untuk Railway.app..."
    echo ""
    echo "Steps:"
    echo "1. Install Railway CLI: npm install -g @railway/cli"
    echo "2. Login: railway login"
    echo "3. Init project: railway init"
    echo "4. Add MySQL: railway add"
    echo "5. Set variables: railway variables"
    echo "6. Deploy: railway up"
    echo ""
    echo "📚 Dokumentasi: https://docs.railway.app"
    ;;
    
  2)
    echo "📦 Preparing untuk Vercel..."
    echo ""
    echo "Steps:"
    echo "1. Install Vercel CLI: npm install -g vercel"
    echo "2. Login: vercel login"
    echo "3. Deploy: vercel"
    echo "4. Set DATABASE_URL di dashboard"
    echo ""
    echo "📚 Dokumentasi: https://vercel.com/docs"
    ;;
    
  3)
    echo "📦 Preparing untuk Render.com..."
    echo ""
    echo "Steps:"
    echo "1. Push ke GitHub"
    echo "2. Connect GitHub di https://render.com"
    echo "3. Create Web Service dari repo"
    echo "4. Add environment variables"
    echo "5. Deploy!"
    echo ""
    echo "📚 Dokumentasi: https://render.com/docs"
    ;;
    
  4)
    echo "📦 Preparing untuk Heroku..."
    echo ""
    echo "Steps:"
    echo "1. Install Heroku CLI"
    echo "2. heroku login"
    echo "3. heroku create [app-name]"
    echo "4. heroku addons:create heroku-postgresql:standard-0"
    echo "5. git push heroku main"
    echo ""
    echo "⚠️  Catatan: Heroku tidak gratis lagi (min $7/bulan)"
    echo "📚 Dokumentasi: https://devcenter.heroku.com"
    ;;
    
  5)
    echo "📦 Preparing Docker Local Deployment..."
    echo ""
    echo "Pastikan Docker installed!"
    echo ""
    echo "Steps:"
    echo "1. docker-compose up -d"
    echo "2. Wait for MySQL to start..."
    echo "3. npx prisma db push"
    echo "4. Access: http://localhost:3000"
    echo ""
    echo "Untuk production, gunakan Docker registry (Docker Hub, GCP Container Registry, etc)"
    ;;
    
  *)
    echo "❌ Pilihan tidak valid!"
    exit 1
    ;;
esac

echo ""
echo "✅ Pre-deployment checklist:"
echo "   [ ] npm install sudah dijalankan"
echo "   [ ] npm run build berhasil"
echo "   [ ] .env.local dikonfigurasi"
echo "   [ ] DATABASE_URL sudah benar"
echo "   [ ] npx prisma db push sudah dijalankan"
echo "   [ ] Repository di-push ke GitHub"
echo ""
echo "📞 Butuh bantuan?"
echo "   - Baca HOSTING_GUIDE.md di project root"
echo "   - Cek documentation di platform pilihan Anda"
