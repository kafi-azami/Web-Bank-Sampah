'use client';

import { useEffect, useState } from 'react';
import { getDashboardSummary, DashboardSummaryResponse } from '@/services/dashboard.service';
import { Scale, ArrowUpRight, ArrowDownRight, Receipt, Gift } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  menunggu_konfirmasi: 'bg-violet/10 text-violet border-violet/30',
  diverifikasi: 'bg-aqua/10 text-aqua border-aqua/30',
  selesai: 'bg-emerald/10 text-emerald border-emerald/30',
  ditolak: 'bg-red-50 text-red-500 border-red-200',
  diproses: 'bg-violet/10 text-violet border-violet/30',
};

export default function CustomerDashboardPage() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-/40">Memuat data...</p>;
  if (!data) return <p className="text-center text-red-500">Gagal memuat data dashboard.</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="tech-chip text-emerald/80">Account Synced</span>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold text-white">Beranda</h1>
        <p className="mt-1 text-white/50">Ringkasan aktivitas tabungan sampah Anda</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
        {/* Orb Saldo Poin */}
        <div className="flex justify-center lg:col-span-1">
          <div className="hud-corners animate-glow relative flex h-48 w-48 items-center justify-center rounded-full bg-navy-light">
            <div className="absolute -inset-0 rounded-full bg-gradient-to-br from-emerald/20 via-aqua/20 to-violet/20" />
            <div className="absolute -inset-2 rounded-full border-2 border-aqua/30" />
            <div className="absolute left-6 top-6 h-14 w-14 rounded-full bg-aqua/20 blur-xl " />
            <div className="absolute inset-3 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm" />

            <div className="relative text-center text-white">
              <p className="tech-chip text-white/80">Saldo Poin</p>
              <p className="shimmer-text mt-1 font-display text-5xl font-bold">
                {data.saldoPoinSaatIni}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
                <Scale className="h-3 w-3" /> {data.totalSampahDisetorKg} kg
              </div>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
          <div className="glass-card hud-corners animate-glow flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald/20 to-emerald/5 text-emerald">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="tech-chip text-white/85">Poin Didapat</p>
              <p className="font-display text-2xl font-bold text-white">{data.totalPoinDidapat}</p>
            </div>
          </div>
          <div className="glass-card hud-corners animate-glow flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet/20 to-violet/5 text-violet">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <p className="tech-chip text-white/85">Poin Ditukar</p>
              <p className="font-display text-2xl font-bold text-white">{data.totalPoinDitukar}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card hud-corners animate-glow p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-aqua/10 text-aqua">
              <Receipt className="h-4 w-4" />
            </div>
            <h3 className="tech-chip text-white/85">Setoran Terakhir</h3>
          </div>
          {data.transaksiTerakhirSetor ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{data.transaksiTerakhirSetor.kodeSetor}</p>
                <p className="text-xs text-white/60">
                  {new Date(data.transaksiTerakhirSetor.tanggal).toLocaleDateString('id-ID')} ·{' '}
                  {data.transaksiTerakhirSetor.beratKg} kg
                </p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[data.transaksiTerakhirSetor.status] || ''}`}
              >
                {data.transaksiTerakhirSetor.status.replace('_', ' ')}
              </span>
            </div>
          ) : (
            <p className="text-sm text-ink/30">Belum ada setoran.</p>
          )}
        </div>

        <div className="glass-card hud-corners animate-glow p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/10 text-violet">
              <Gift className="h-4 w-4" />
            </div>
            <h3 className="tech-chip text-white/85">Penukaran Terakhir</h3>
          </div>
          {data.transaksiTerakhirTukar ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{data.transaksiTerakhirTukar.hadiah}</p>
                <p className="text-xs text-white/60">
                  {new Date(data.transaksiTerakhirTukar.tanggal).toLocaleDateString('id-ID')} ·{' '}
                  {data.transaksiTerakhirTukar.poin} poin
                </p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[data.transaksiTerakhirTukar.status] || ''}`}
              >
                {data.transaksiTerakhirTukar.status}
              </span>
            </div>
          ) : (
            <p className="text-sm text-ink/30">Belum ada penukaran.</p>
          )}
        </div>
      </div>
    </div>
  );
}