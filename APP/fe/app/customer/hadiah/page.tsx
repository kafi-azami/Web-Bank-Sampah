'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllHadiah } from '@/services/hadiah.service';
import { tukarPoin, getMyPenukaran, MyPenukaranItem } from '@/services/penukaran-poin.service';
import { getDashboardSummary } from '@/services/dashboard.service';
import { Hadiah } from '@/types';
import { Gift, Coins, Package, X, History, Receipt } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  diproses: 'bg-violet/15 text-violet border-violet/30',
  selesai: 'bg-emerald/15 text-emerald border-emerald/30',
};

export default function HadiahNasabahPage() {
  const [tab, setTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [hadiahList, setHadiahList] = useState<Hadiah[]>([]);
  const [riwayat, setRiwayat] = useState<MyPenukaranItem[]>([]);
  const [saldoPoin, setSaldoPoin] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Hadiah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadAll() {
    setLoading(true);
    try {
      const [hadiahData, summary, riwayatData] = await Promise.all([
        getAllHadiah(),
        getDashboardSummary(),
        getMyPenukaran(),
      ]);
      setHadiahList(hadiahData);
      setSaldoPoin(summary.saldoPoinSaatIni);
      setRiwayat(riwayatData);
    } catch {
      // biarkan default state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openConfirm(item: Hadiah) {
    setSelected(item);
    setError('');
  }

  function closeConfirm() {
    setSelected(null);
  }

  async function handleTukar() {
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      await tukarPoin(selected.id);
      setSuccessMsg(`Berhasil menukar poin dengan ${selected.namaHadiah}!`);
      closeConfirm();
      await loadAll();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menukar poin.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="tech-chip text-white/30">Reward Exchange</span>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Hadiah</h1>
          <p className="mt-1 text-white/50">Tukarkan poin dengan hadiah menarik</p>
        </div>
        <div className="glass-dark hud-corners flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white">
          <Coins className="h-4 w-4 text-emerald" /> {saldoPoin} poin
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald">
          {successMsg}
        </div>
      )}

      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setTab('katalog')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === 'katalog'
              ? 'bg-gradient-to-r from-emerald to-aqua text-white shadow-md shadow-emerald/20'
              : 'border border-white/10 bg-white/5 text-white/50'
            }`}
        >
          Katalog
        </button>
        <button
          onClick={() => setTab('riwayat')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === 'riwayat'
              ? 'bg-gradient-to-r from-emerald to-aqua text-white shadow-md shadow-emerald/20'
              : 'border border-white/10 bg-white/5 text-white/50'
            }`}
        >
          Riwayat
        </button>
      </div>

      {loading ? (
        <p className="text-center text-white/40">Memuat data...</p>
      ) : tab === 'katalog' ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {hadiahList.length === 0 ? (
            <p className="col-span-full text-center text-white/40">Belum ada hadiah tersedia.</p>
          ) : (
            hadiahList.map((item) => (
              <div key={item.id} className="glass-dark hud-corners p-4">
                <div className="mb-3 flex justify-center rounded-2xl bg-gradient-to-br from-violet/20 to-aqua/20 py-5 text-violet">
                  <Gift className="h-8 w-8" />
                </div>
                <p className="mb-1 text-sm font-semibold text-white line-clamp-2">
                  {item.namaHadiah}
                </p>
                <p className="mb-2 flex items-center gap-1 text-xs text-white/40">
                  <Package className="h-3 w-3" /> Stok: {item.stok}
                </p>
                <p className="mb-3 font-display text-sm font-bold text-emerald">
                  {item.poinDibutuhkan} poin
                </p>
                <button
                  onClick={() => openConfirm(item)}
                  disabled={saldoPoin < item.poinDibutuhkan || item.stok < 1}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald to-aqua py-2 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:bg-none disabled:opacity-60"
                >
                  {item.stok < 1 ? 'Stok Habis' : 'Tukar'}
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {riwayat.length === 0 ? (
            <div className="glass-dark hud-corners flex flex-col items-center py-16 text-center">
              <History className="mb-3 h-10 w-10 text-white/20" />
              <p className="text-sm text-white/40">Belum ada riwayat penukaran.</p>
            </div>
          ) : (
            riwayat.map((item) => (
              <div key={item.id} className="glass-dark hud-corners p-4">
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-sm font-semibold text-white">{item.hadiah.namaHadiah}</p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || ''}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-white/40">{item.kodePenukaran}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-emerald">{item.poinTerpakai} poin terpakai</p>
                  <Link
                    href={`/customer/nota/penukaran/${item.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-aqua hover:underline"
                  >
                    <Receipt className="h-3.5 w-3.5" /> Lihat Nota
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Konfirmasi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="hud-corners glass-dark w-full max-w-sm p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Konfirmasi Penukaran</h2>
              <button onClick={closeConfirm} className="text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-1 text-sm text-white/50">Tukar poin dengan:</p>
            <p className="mb-3 font-semibold text-white">{selected.namaHadiah}</p>

            <div className="mb-4 flex justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
              <span className="text-white/50">Poin dibutuhkan</span>
              <span className="font-medium text-white">{selected.poinDibutuhkan} poin</span>
            </div>

            {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

            <button
              onClick={handleTukar}
              disabled={submitting}
              className="btn-aero w-full rounded-xl bg-gradient-to-r from-emerald to-aqua py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Memproses...' : 'Konfirmasi Tukar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}