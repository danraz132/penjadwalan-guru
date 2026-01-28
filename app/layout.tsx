// /app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Aplikasi Penjadwalan Guru",
  description: "Sistem penjadwalan guru berbasis Next.js + Prisma + MySQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
