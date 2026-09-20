'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMySetoran } from '@/services/setor-sampah.service';
import { SetoranListItem } from '@/types';
import { Package, Scale, Coins, Receipt } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  menunggu_konfirmasi: 'bg-violet/15 text-violet border-violet/30',
  diverifikasi: 'bg-aqua/15 text-aqua border-aqua/30',
  selesai: 'bg-emerald/15 text-emerald border-emerald/30',
  ditolak: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const STATUS_LABEL: Record<string, string> = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diverifikasi: 'Diverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export default function RiwayatPage() {
  const [list, setList] = useState<SetoranListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySetoran()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="tech-chip text-white/30">Transaction Log</span>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Riwayat Setoran</h1>
        <p className="mt-1 text-white/50">Status & histori pengajuan penyetoran sampah</p>
      </div>

      {loading ? (
        <p className="text-center text-white/40">Memuat data...</p>
      ) : list.length === 0 ? (
        <div className="glass-dark hud-corners flex flex-col items-center py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-sm text-white/40">Belum ada riwayat setoran.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div key={item.id} className="glass-dark hud-corners p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">{item.kodeSetor}</p>
                  <p className="text-xs text-white/40">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || ''}`}
                >
                  {STATUS_LABEL[item.status] || item.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Scale className="h-3.5 w-3.5" /> {item.totalBeratKg} kg
                  </span>
                  <span className="flex items-center gap-1 text-emerald">
                    <Coins className="h-3.5 w-3.5" /> {item.totalPoin} poin
                  </span>
                </div>
                <Link
                  href={`/customer/nota/setoran/${item.id}`}
                  className="flex items-center gap-1 text-xs font-medium text-aqua hover:underline"
                >
                  <Receipt className="h-3.5 w-3.5" /> Lihat Nota
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}