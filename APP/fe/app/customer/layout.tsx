'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import {
  Home,
  Recycle,
  Gift,
  History,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { href: '/customer/dashboard', label: 'Beranda', icon: Home },
  { href: '/customer/setor', label: 'Setor', icon: Recycle },
  { href: '/customer/riwayat', label: 'Riwayat', icon: History },
  { href: '/customer/hadiah', label: 'Hadiah', icon: Gift },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Recycle className="h-6 w-6 text-green-600" />
          <span className="font-bold text-gray-800">Bank Sampah</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-md px-4 py-6">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-md justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
                  isActive ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}