'use client';

import { useEffect, useState } from 'react';
import { getDashboardSummary, DashboardSummaryResponse } from '@/services/dashboard.service';
import { Coins, Scale, ArrowUpRight, ArrowDownRight, Receipt, Gift } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  menunggu_konfirmasi: 'bg-amber-50 text-amber-700',
  diverifikasi: 'bg-blue-50 text-blue-700',
  selesai: 'bg-green-50 text-green-700',
  ditolak: 'bg-red-50 text-red-700',
  diproses: 'bg-amber-50 text-amber-700',
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

  if (loading) {
    return <p className="text-center text-gray-400">Memuat data...</p>;
  }

  if (!data) {
    return <p className="text-center text-red-500">Gagal memuat data dashboard.</p>;
  }

  return (
    <div className="space-y-5">
      {/* Saldo Card */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-md">
        <p className="text-sm text-green-100">Saldo Poin Anda</p>
        <p className="mt-1 text-3xl font-bold">{data.saldoPoinSaatIni}</p>
        <div className="mt-4 flex gap-4 text-sm text-green-100">
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4" /> {data.totalSampahDisetorKg} kg disetor
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-green-600">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-xs font-medium text-gray-500">Poin Didapat</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{data.totalPoinDidapat}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-red-500">
            <ArrowDownRight className="h-4 w-4" />
            <span className="text-xs font-medium text-gray-500">Poin Ditukar</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{data.totalPoinDitukar}</p>
        </div>
      </div>

      {/* Transaksi Terakhir Setor */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Setoran Terakhir</h3>
        </div>
        {data.transaksiTerakhirSetor ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {data.transaksiTerakhirSetor.kodeSetor}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(data.transaksiTerakhirSetor.tanggal).toLocaleDateString('id-ID')} ·{' '}
                {data.transaksiTerakhirSetor.beratKg} kg
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[data.transaksiTerakhirSetor.status] || 'bg-gray-100 text-gray-700'}`}
            >
              {data.transaksiTerakhirSetor.status.replace('_', ' ')}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Belum ada setoran.</p>
        )}
      </div>

      {/* Transaksi Terakhir Tukar */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Gift className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Penukaran Terakhir</h3>
        </div>
        {data.transaksiTerakhirTukar ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {data.transaksiTerakhirTukar.hadiah}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(data.transaksiTerakhirTukar.tanggal).toLocaleDateString('id-ID')} ·{' '}
                {data.transaksiTerakhirTukar.poin} poin
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[data.transaksiTerakhirTukar.status] || 'bg-gray-100 text-gray-700'}`}
            >
              {data.transaksiTerakhirTukar.status}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Belum ada penukaran.</p>
        )}
      </div>
    </div>
  );
}