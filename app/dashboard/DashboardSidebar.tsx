'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Home,
  Users,
  Book,
  Building,
  GraduationCap,
  UserCheck,
  UserCog,
  Menu,
  X,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

type DashboardSidebarProps = {
  session: {
    nama?: string;
    role: string;
  };
};

export default function DashboardSidebar({ session }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/dashboard/jadwal', label: 'Jadwal', icon: Calendar },
    ...(session.role === 'ADMIN'
      ? [
          { href: '/dashboard/guru', label: 'Guru', icon: Users },
          { href: '/dashboard/kelas', label: 'Kelas', icon: Home },
          { href: '/dashboard/siswa', label: 'Siswa', icon: GraduationCap },
          { href: '/dashboard/mapel', label: 'Mata Pelajaran', icon: Book },
          { href: '/dashboard/ruangan', label: 'Ruangan', icon: Building },
        ]
      : []),
    { href: '/dashboard/absensi', label: 'Absensi Guru', icon: UserCheck },
    {
      href: '/dashboard/guru-pengganti',
      label: 'Guru Pengganti',
      icon: UserCog,
    },
  ];

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-white text-indigo-600 p-2 rounded-lg">📚</div>
        <h2 className="text-xl font-bold">Penjadwalan Guru</h2>
      </div>

      <div className="bg-indigo-700 rounded-lg p-3 mb-6">
        <p className="text-xs text-indigo-200 mb-1">Logged in as</p>
        <p className="font-semibold truncate">{session.nama || 'Pengguna'}</p>
        <p className="text-xs text-indigo-300">{session.role}</p>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <Icon size={20} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-indigo-500 pt-4 mt-4">
        <LogoutButton />
        <div className="mt-4 text-xs text-indigo-200">
          <p>© 2026 Penjadwalan Guru</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-gray-800">Penjadwalan Guru</h1>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center p-2 rounded-md border border-gray-200 text-gray-700"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <button
            type="button"
            className="flex-1 bg-black/40"
            aria-label="Tutup menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="w-72 max-w-[85vw] bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-5 shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-indigo-700"
                aria-label="Tutup menu"
              >
                <X size={20} />
              </button>
            </div>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-5 shadow-lg fixed inset-y-0 flex-col">
        {renderSidebarContent()}
      </aside>
    </>
  );
}