'use client';

import { useEffect, useState } from 'react';
import {
  getAllSetoranAdmin,
  getSetoranDetail,
  verifySetoran,
} from '@/services/setor-sampah.service';
import { SetoranListItem, SetoranDetail } from '@/types';
import { Eye, X, Scale, Coins } from 'lucide-react';

const STATUS_TABS = [
  { value: '', label: 'Semua' },
  { value: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
  { value: 'diverifikasi', label: 'Diverifikasi' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
];

const STATUS_BADGE: Record<string, string> = {
  menunggu_konfirmasi: 'bg-amber-50 text-amber-700',
  diverifikasi: 'bg-blue-50 text-blue-700',
  selesai: 'bg-green-50 text-green-700',
  ditolak: 'bg-red-50 text-red-700',
};

export default function SetoranPage() {
  const [list, setList] = useState<SetoranListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const [detail, setDetail] = useState<SetoranDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [realWeights, setRealWeights] = useState<Record<string, string>>({});
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadData(status: string) {
    setLoading(true);
    try {
      const data = await getAllSetoranAdmin(status || undefined);
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  async function openDetail(id: string) {
    setDetailLoading(true);
    setError('');
    try {
      const data = await getSetoranDetail(id);
      setDetail(data);
      setCatatanAdmin(data.catatanAdmin || '');
      const initial: Record<string, string> = {};
      // Karena detail tidak menyertakan kategoriSampahId, kita perlu ambil dari daftar kategori.
      // Untuk kesederhanaan, gunakan berat estimasi sebagai default awal (admin bisa ubah manual).
      data.detailSetors.forEach((item, idx) => {
        initial[`item-${idx}`] = String(item.beratKg);
      });
      setRealWeights(initial);
    } catch {
      setError('Gagal memuat detail setoran.');
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
    setRealWeights({});
  }

  async function handleVerify(status: 'diverifikasi' | 'ditolak' | 'selesai') {
    if (!detail) return;
    setSubmitting(true);
    setError('');

    try {
      await verifySetoran(detail.id, {
        status,
        catatanAdmin,
      });
      await loadData(activeTab);
      closeDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses verifikasi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Verifikasi Setoran</h1>
        <p className="text-gray-500">Kelola pengajuan penyetoran sampah dari nasabah</p>
      </div>

      {/* Tabs Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.value
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Kode Setor</th>
              <th className="px-6 py-3 font-medium">Nasabah</th>
              <th className="px-6 py-3 font-medium">Tanggal</th>
              <th className="px-6 py-3 font-medium">Berat</th>
              <th className="px-6 py-3 font-medium">Poin</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Tidak ada data setoran.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{item.kodeSetor}</td>
                  <td className="px-6 py-3 text-gray-600">{item.nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.totalBeratKg} kg</td>
                  <td className="px-6 py-3 text-gray-600">{item.totalPoin} poin</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openDetail(item.id)}
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail & Verifikasi */}
      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Detail Setoran</h2>
              <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading || !detail ? (
              <p className="py-8 text-center text-gray-400">Memuat detail...</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-800">{detail.kodeSetor}</p>
                  <p className="text-gray-500">{detail.nasabah.namaNasabah} · {detail.nasabah.telp}</p>
                  <p className="text-gray-500">{detail.nasabah.alamat}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">Rincian Sampah</p>
                  <div className="space-y-2">
                    {detail.detailSetors.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{item.kategori}</p>
                          <p className="text-gray-500 capitalize">{item.jenis}</p>
                        </div>
                        <div className="text-right">
                          <p className="flex items-center gap-1 text-gray-600">
                            <Scale className="h-3.5 w-3.5" /> {item.beratKg} kg
                          </p>
                          <p className="flex items-center gap-1 text-green-600">
                            <Coins className="h-3.5 w-3.5" /> {item.subtotalPoin} poin
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between rounded-lg bg-green-50 px-4 py-3 text-sm font-medium">
                  <span className="text-gray-700">Total</span>
                  <span className="text-green-700">
                    {detail.totalBeratKg} kg · {detail.totalPoin} poin
                  </span>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Catatan Admin
                  </label>
                  <textarea
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    rows={2}
                    placeholder="Catatan pemeriksaan (opsional)"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {detail.status === 'menunggu_konfirmasi' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify('ditolak')}
                      disabled={submitting}
                      className="flex-1 rounded-md border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleVerify('diverifikasi')}
                      disabled={submitting}
                      className="flex-1 rounded-md border border-blue-200 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                      Verifikasi
                    </button>
                    <button
                      onClick={() => handleVerify('selesai')}
                      disabled={submitting}
                      className="flex-1 rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting ? 'Memproses...' : 'Selesaikan'}
                    </button>
                  </div>
                )}

                {detail.status === 'diverifikasi' && (
                  <button
                    onClick={() => handleVerify('selesai')}
                    disabled={submitting}
                    className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? 'Memproses...' : 'Tandai Selesai'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}