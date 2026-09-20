'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  Trash2,
  Gift,
  ClipboardList,
  Repeat,
  BarChart3,
  LogOut,
  Recycle,
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    clearAuth();
    router.push('/sign-in');
  }

  function handleNavClick() {
    setSidebarOpen(false);
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-navy">
      {/* Glow orbs di background gelap */}
      <div className="pointer-events-none fixed -left-32 top-0 h-96 w-96 rounded-full bg-aqua/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-1/3 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" />

      {/* Overlay gelap saat sidebar terbuka di mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar - fixed di desktop, slide-in di mobile */}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-shrink-0 flex-col border-r border-white/5 bg-navy-light/90 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:bg-navy-light/60 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div className="flex items-center gap-2.5">
  <div className="hud-corners animate-glow relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-light">
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/30 to-violet/30" />
    <Recycle className="relative h-5 w-5 text-aqua" />
  </div>
  <span className="shimmer-text font-display text-lg font-bold">Bank Sampah</span>
</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/40 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-aqua/20 to-violet/20 text-white ring-1 ring-aqua/30'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-aqua' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/5 hover:text-violet"
          >
            <LogOut className="h-4.5 w-4.5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Topbar mobile - hanya tampil di layar kecil */}
        <header className="flex items-center justify-between border-b border-white/5 bg-navy-light/60 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald via-aqua to-violet">
              <Recycle className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-white">Bank Sampah</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}