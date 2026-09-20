'use client';

import { useEffect, useState } from 'react';
import { getRekapitulasiBulanan } from '@/services/rekapitulasi.service';
import { RekapitulasiBulanan } from '@/types';
import { Scale, Wallet, Coins, RefreshCw } from 'lucide-react';

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const JENIS_LABEL: Record<string, { label: string; gradient: string }> = {
  plastik: { label: 'Plastik', gradient: 'from-aqua to-violet' },
  kertas: { label: 'Kertas', gradient: 'from-violet to-emerald' },
  logam: { label: 'Logam', gradient: 'from-white/40 to-white/10' },
  kaca: { label: 'Kaca', gradient: 'from-emerald to-aqua' },
};

export default function RekapitulasiPage() {
  const [bulan, setBulan] = useState(getCurrentMonth());
  const [data, setData] = useState<RekapitulasiBulanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const result = await getRekapitulasiBulanan(bulan);
      setData(result);
    } catch {
      setError('Gagal memuat data rekapitulasi.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulan]);

  const maxTonase = data
    ? Math.max(
        data.breakdownJenisSampah.plastik.tonaseKg,
        data.breakdownJenisSampah.kertas.tonaseKg,
        data.breakdownJenisSampah.logam.tonaseKg,
        data.breakdownJenisSampah.kaca.tonaseKg,
        1,
      )
    : 1;

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="tech-chip text-emerald">Module: Monthly Analytics</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
          <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            Rekapitulasi Bulanan
          </h1>
          <p className="relative mt-1 text-white/40">Laporan tonase sampah & penukaran poin</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-aqua focus:outline-none"
          />
          <button
            onClick={loadData}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/50 hover:text-aqua"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-white/30">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="hud-corners glass-dark flex items-center gap-4 p-5">
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="tech-chip text-white/40">Total Tonase</p>
                <p className="font-display text-2xl font-bold text-white">
                  {data.rekapitulasiTonase.totalKg} kg
                </p>
              </div>
            </div>
            <div className="hud-corners glass-dark flex items-center gap-4 p-5">
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="tech-chip text-white/40">Estimasi Pembayaran</p>
                <p className="font-display text-2xl font-bold text-white">
                  Rp {data.rekapitulasiTonase.totalEstimasiPembayaranRupiah.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="hud-corners glass-dark flex items-center gap-4 p-5">
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-violet">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="tech-chip text-white/40">Poin Diterbitkan</p>
                <p className="font-display text-2xl font-bold text-white">
                  {data.rekapitulasiTonase.totalPoinDiterbitkan}
                </p>
              </div>
            </div>
          </div>

          <div className="hud-corners glass-dark p-6">
            <h3 className="mb-4 font-display font-semibold text-white">Breakdown per Jenis Sampah</h3>
            <div className="space-y-4">
              {Object.entries(data.breakdownJenisSampah).map(([jenis, value]) => (
                <div key={jenis}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-white/70">
                      {JENIS_LABEL[jenis]?.label || jenis}
                    </span>
                    <span className="text-white/40">
                      {value.tonaseKg} kg · Rp {value.rupiah.toLocaleString('id-ID')} · {value.poin} poin
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${JENIS_LABEL[jenis]?.gradient || 'from-white/30 to-white/10'}`}
                      style={{ width: `${(value.tonaseKg / maxTonase) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hud-corners glass-dark p-6">
            <h3 className="mb-4 font-display font-semibold text-white">Rekapitulasi Penukaran Poin</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="tech-chip text-white/40">Total Transaksi</p>
                <p className="font-display text-xl font-bold text-white">
                  {data.rekapitulasiPenukaranPoin.totalTransaksiPenukaran}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="tech-chip text-white/40">Total Poin Terpakai</p>
                <p className="font-display text-xl font-bold text-white">
                  {data.rekapitulasiPenukaranPoin.totalPoinTerpakai}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}