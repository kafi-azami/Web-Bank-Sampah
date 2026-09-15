'use client';

import { useEffect, useState } from 'react';
import { getRekapitulasiBulanan } from '@/services/rekapitulasi.service';
import { RekapitulasiBulanan } from '@/types';
import { Scale, Wallet, Coins, RefreshCw } from 'lucide-react';

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const JENIS_LABEL: Record<string, { label: string; color: string }> = {
  plastik: { label: 'Plastik', color: 'bg-blue-500' },
  kertas: { label: 'Kertas', color: 'bg-amber-500' },
  logam: { label: 'Logam', color: 'bg-gray-500' },
  kaca: { label: 'Kaca', color: 'bg-cyan-500' },
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
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rekapitulasi Bulanan</h1>
          <p className="text-gray-500">Laporan tonase sampah & penukaran poin</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
          <button
            onClick={loadData}
            className="rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-purple-500 p-3 text-white">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Tonase</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.rekapitulasiTonase.totalKg} kg
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-green-500 p-3 text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimasi Pembayaran</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {data.rekapitulasiTonase.totalEstimasiPembayaranRupiah.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-amber-500 p-3 text-white">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Poin Diterbitkan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.rekapitulasiTonase.totalPoinDiterbitkan}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown per Jenis */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Breakdown per Jenis Sampah</h3>
            <div className="space-y-4">
              {Object.entries(data.breakdownJenisSampah).map(([jenis, value]) => (
                <div key={jenis}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {JENIS_LABEL[jenis]?.label || jenis}
                    </span>
                    <span className="text-gray-500">
                      {value.tonaseKg} kg · Rp {value.rupiah.toLocaleString('id-ID')} · {value.poin} poin
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full ${JENIS_LABEL[jenis]?.color || 'bg-gray-400'}`}
                      style={{ width: `${(value.tonaseKg / maxTonase) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rekap Penukaran Poin */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Rekapitulasi Penukaran Poin</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Transaksi</p>
                <p className="text-xl font-bold text-gray-800">
                  {data.rekapitulasiPenukaranPoin.totalTransaksiPenukaran}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Poin Terpakai</p>
                <p className="text-xl font-bold text-gray-800">
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