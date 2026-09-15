'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  Trash2,
  Gift,
  ClipboardList,
  BarChart3,
  LogOut,
  Repeat
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/nasabah', label: 'Data Nasabah', icon: Users },
  { href: '/admin/kategori-sampah', label: 'Kategori Sampah', icon: Trash2 },
  { href: '/admin/hadiah', label: 'Hadiah', icon: Gift },
  { href: '/admin/setoran', label: 'Verifikasi Setoran', icon: ClipboardList },
  { href: '/admin/penukaran-poin', label: 'Penukaran Poin', icon: Repeat },
  { href: '/admin/rekapitulasi', label: 'Rekapitulasi', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push('/sign-in');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-green-800 text-white">
        <div className="flex items-center gap-2 border-b border-green-700 px-6 py-5">
          <Trash2 className="h-7 w-7" />
          <span className="text-lg font-bold">Bank Sampah</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-green-800'
                    : 'text-green-100 hover:bg-green-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-green-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-green-100 transition hover:bg-green-700"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}