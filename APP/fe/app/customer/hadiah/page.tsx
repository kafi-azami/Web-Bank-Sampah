'use client';

import { useEffect, useState } from 'react';
import { getAllHadiah } from '@/services/hadiah.service';
import { tukarPoin, getMyPenukaran, MyPenukaranItem } from '@/services/penukaran-poin.service';
import { getDashboardSummary } from '@/services/dashboard.service';
import { Hadiah } from '@/types';
import { Gift, Coins, Package, X, History } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  diproses: 'bg-amber-50 text-amber-700',
  selesai: 'bg-green-50 text-green-700',
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Hadiah</h1>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
          <Coins className="h-4 w-4" /> {saldoPoin} poin
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('katalog')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'katalog' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Katalog
        </button>
        <button
          onClick={() => setTab('riwayat')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'riwayat' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Riwayat
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Memuat data...</p>
      ) : tab === 'katalog' ? (
        <div className="grid grid-cols-2 gap-3">
          {hadiahList.length === 0 ? (
            <p className="col-span-2 text-center text-gray-400">Belum ada hadiah tersedia.</p>
          ) : (
            hadiahList.map((item) => (
              <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex justify-center rounded-lg bg-pink-50 py-4 text-pink-500">
                  <Gift className="h-8 w-8" />
                </div>
                <p className="mb-1 text-sm font-semibold text-gray-800 line-clamp-2">
                  {item.namaHadiah}
                </p>
                <p className="mb-2 text-xs text-gray-500 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Stok: {item.stok}
                </p>
                <p className="mb-3 text-sm font-bold text-green-600">
                  {item.poinDibutuhkan} poin
                </p>
                <button
                  onClick={() => openConfirm(item)}
                  disabled={saldoPoin < item.poinDibutuhkan || item.stok < 1}
                  className="w-full rounded-md bg-green-600 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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
            <div className="flex flex-col items-center py-16 text-center">
              <History className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Belum ada riwayat penukaran.</p>
            </div>
          ) : (
            riwayat.map((item) => (
              <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.hadiah.namaHadiah}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.kodePenukaran}</p>
                <p className="mt-1 text-sm text-green-600">{item.poinTerpakai} poin terpakai</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Konfirmasi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Konfirmasi Penukaran</h2>
              <button onClick={closeConfirm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-1 text-sm text-gray-600">Tukar poin dengan:</p>
            <p className="mb-3 font-semibold text-gray-800">{selected.namaHadiah}</p>

            <div className="mb-4 flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-600">Poin dibutuhkan</span>
              <span className="font-medium text-gray-800">{selected.poinDibutuhkan} poin</span>
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <button
              onClick={handleTukar}
              disabled={submitting}
              className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Memproses...' : 'Konfirmasi Tukar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}