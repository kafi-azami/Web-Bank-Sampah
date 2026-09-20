'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/dashboard.service';
import { Users, Trash2, Gift, Package, Scale, Coins, Radio } from 'lucide-react';

interface DashboardStats {
  totalNasabah: number;
  totalKategoriSampah: number;
  totalTransaksiSetor: number;
  totalHadiah: number;
  totalBeratSampahKg: number;
  totalPoinTersalurkan: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Nasabah', value: stats?.totalNasabah, icon: Users, gradient: 'from-aqua to-violet' },
    { label: 'Kategori Sampah', value: stats?.totalKategoriSampah, icon: Trash2, gradient: 'from-emerald to-aqua' },
    { label: 'Total Setoran', value: stats?.totalTransaksiSetor, icon: Package, gradient: 'from-violet to-emerald' },
    { label: 'Katalog Hadiah', value: stats?.totalHadiah, icon: Gift, gradient: 'from-aqua to-emerald' },
    { label: 'Total Sampah (Kg)', value: stats?.totalBeratSampahKg, icon: Scale, gradient: 'from-emerald to-violet' },
    { label: 'Poin Tersalurkan', value: stats?.totalPoinTersalurkan, icon: Coins, gradient: 'from-violet to-aqua' },
  ];

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="tech-chip text-emerald">System Online</span>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
        <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
          Dashboard Admin
        </h1>
        <p className="relative mt-1 text-white/40">Ringkasan aktivitas Bank Sampah Digital</p>
      </div>

      {loading ? (
        <p className="mt-8 text-white/30">Memuat data...</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="hud-corners glass-dark flex items-center gap-4 p-5 transition hover:border-aqua/30"
              >
                <div
                  className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${card.gradient} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="tech-chip text-white/40">{card.label}</p>
                  <p className="font-display text-2xl font-bold text-white">
                    {card.value ?? '-'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Panel status tambahan - HUD sci-fi */}
      <div className="hud-corners glass-dark animate-glow mt-6 flex items-center gap-3 p-4">
        <Radio className="h-4 w-4 text-aqua" />
        <p className="tech-chip text-white/50">
          Data tersinkronisasi real-time dari sistem Bank Sampah Digital
        </p>
      </div>
    </div>
  );
}