// app/dashboard/layout.tsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Calendar, Home, Users, Book, Building, GraduationCap, UserCheck, UserCog, LogOut } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-5 shadow-lg fixed h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-white text-indigo-600 p-2 rounded-lg">📚</div>
          <h2 className="text-xl font-bold">Penjadwalan Guru</h2>
        </div>

        {/* User Info */}
        <div className="bg-indigo-700 rounded-lg p-3 mb-6">
          <p className="text-xs text-indigo-200 mb-1">Logged in as</p>
          <p className="font-semibold truncate">{session.nama}</p>
          <p className="text-xs text-indigo-300">{session.role}</p>
        </div>

        <nav className="space-y-2 flex-1">
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
          
          {/* Menu khusus ADMIN */}
          {session.role === 'ADMIN' && (
            <>
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
            </>
          )}

          <Link
            href="/dashboard/absensi"
            className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
          >
            <UserCheck size={20} /> Absensi Guru
          </Link>
          <Link
            href="/dashboard/guru-pengganti"
            className="flex items-center gap-3 hover:bg-indigo-700 p-3 rounded-lg transition"
          >
            <UserCog size={20} /> Guru Pengganti
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-indigo-500 pt-4">
          <LogoutButton />
          <div className="mt-4 text-xs text-indigo-200">
            <p>© 2026 Penjadwalan Guru</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-64">{children}</div>
    </div>
  );
}
