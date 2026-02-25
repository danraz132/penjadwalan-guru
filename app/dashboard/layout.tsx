// app/dashboard/layout.tsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';

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
    <div className="min-h-screen bg-gray-50 text-gray-800 md:flex">
      <DashboardSidebar
        session={{
          nama: session.nama,
          role: session.role,
        }}
      />
      <div className="flex-1 min-w-0 md:ml-64">{children}</div>
    </div>
  );
}
