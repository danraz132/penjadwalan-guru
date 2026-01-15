// /app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { BarChart3, Calendar, Home, Users, Book, Building, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Aplikasi Penjadwalan Guru",
  description: "Sistem penjadwalan guru berbasis Next.js + Prisma + MySQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
          {/* Sidebar */}
          <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-5 shadow-lg fixed h-screen">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white text-indigo-600 p-2 rounded-lg">📚</div>
              <h2 className="text-xl font-bold">Penjadwalan Guru</h2>
            </div>
            <nav className="space-y-2">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <BarChart3 size={20} /> Dashboard
              </Link>
              <Link 
                href="/dashboard/jadwal" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <Calendar size={20} /> Jadwal
              </Link>
              <Link 
                href="/dashboard/guru" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <Users size={20} /> Guru
              </Link>
              <Link 
                href="/dashboard/kelas" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <Home size={20} /> Kelas
              </Link>
              <Link 
                href="/dashboard/siswa" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <GraduationCap size={20} /> Siswa
              </Link>
              <Link 
                href="/dashboard/mapel" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <Book size={20} /> Mata Pelajaran
              </Link>
              <Link 
                href="/dashboard/ruangan" 
                className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
              >
                <Building size={20} /> Ruangan
              </Link>
            </nav>
            
            <div className="absolute bottom-5 left-5 right-5 text-xs text-indigo-200 border-t border-indigo-500 pt-4">
              <p>© 2026 Penjadwalan Guru</p>
              <p>v1.0.0</p>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 ml-64">{children}</div>
        </div>
      </body>
    </html>
  );
}
