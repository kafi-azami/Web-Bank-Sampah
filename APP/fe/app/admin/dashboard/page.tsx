'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '@/services/dashboard.service';
import { Users, Trash2, Gift, Package, Scale, Coins } from 'lucide-react';

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
    { label: 'Total Nasabah', value: stats?.totalNasabah, icon: Users, color: 'bg-blue-500' },
    { label: 'Kategori Sampah', value: stats?.totalKategoriSampah, icon: Trash2, color: 'bg-emerald-500' },
    { label: 'Total Setoran', value: stats?.totalTransaksiSetor, icon: Package, color: 'bg-amber-500' },
    { label: 'Katalog Hadiah', value: stats?.totalHadiah, icon: Gift, color: 'bg-pink-500' },
    { label: 'Total Sampah (Kg)', value: stats?.totalBeratSampahKg, icon: Scale, color: 'bg-purple-500' },
    { label: 'Poin Tersalurkan', value: stats?.totalPoinTersalurkan, icon: Coins, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-800">Dashboard Admin</h1>
      <p className="mb-6 text-gray-500">Ringkasan aktivitas Bank Sampah Digital</p>

      {loading ? (
        <p className="text-gray-400">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
              >
                <div className={`rounded-lg ${card.color} p-3 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {card.value ?? '-'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}