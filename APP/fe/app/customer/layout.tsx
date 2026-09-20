'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import { Home, Recycle, Gift, History, LogOut } from 'lucide-react';

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
    <div className="hud-grid relative min-h-screen overflow-hidden bg-navy pb-24 font-sans lg:pb-0">
      {/* Glow orbs melayang */}
      <div className="pointer-events-none fixed -left-24 -top-24 h-96 w-96 rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none fixed -right-32 top-40 h-80 w-80 rounded-full bg-violet/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 left-1/3 h-96 w-96 rounded-full bg-emerald/15 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-light/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="hud-corners animate-glow relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-light">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/30 to-violet/30" />
              <Recycle className="relative h-5 w-5 text-aqua" />
            </div>
            <span className="shimmer-text font-display text-lg font-bold">Bank Sampah Digital</span>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                      ? 'bg-gradient-to-r from-emerald to-aqua text-white shadow-md shadow-emerald/20'
                      : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-violet"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-6 lg:px-8 lg:py-10">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-navy-light/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md justify-around py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition ${isActive
                      ? 'bg-gradient-to-br from-emerald to-aqua text-white shadow-md shadow-emerald/30'
                      : 'text-white/30'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-emerald' : 'text-white/30'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}