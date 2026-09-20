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
  menunggu_konfirmasi: 'bg-violet/15 text-violet border border-violet/30',
  diverifikasi: 'bg-aqua/15 text-aqua border border-aqua/30',
  selesai: 'bg-emerald/15 text-emerald border border-emerald/30',
  ditolak: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

export default function SetoranPage() {
  const [list, setList] = useState<SetoranListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const [detail, setDetail] = useState<SetoranDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
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
    } catch {
      setError('Gagal memuat detail setoran.');
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
  }

  async function handleVerify(status: 'diverifikasi' | 'ditolak' | 'selesai') {
    if (!detail) return;
    setSubmitting(true);
    setError('');

    try {
      await verifySetoran(detail.id, { status, catatanAdmin });
      await loadData(activeTab);
      closeDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses verifikasi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
        </span>
        <span className="tech-chip text-aqua">Module: Deposit Verification</span>
      </div>

      <div className="relative mb-6">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
        <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
          Verifikasi Setoran
        </h1>
        <p className="relative mt-1 text-white/40">Kelola pengajuan penyetoran sampah dari nasabah</p>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.value
                ? 'bg-gradient-to-r from-emerald to-aqua text-white shadow-md shadow-aqua/20'
                : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hud-corners glass-dark overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/5">
            <tr>
              <th className="tech-chip px-6 py-3 text-white/40">Kode Setor</th>
              <th className="tech-chip px-6 py-3 text-white/40">Nasabah</th>
              <th className="tech-chip px-6 py-3 text-white/40">Tanggal</th>
              <th className="tech-chip px-6 py-3 text-white/40">Berat</th>
              <th className="tech-chip px-6 py-3 text-white/40">Poin</th>
              <th className="tech-chip px-6 py-3 text-white/40">Status</th>
              <th className="tech-chip px-6 py-3 text-right text-white/40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-white/30">
                  Memuat data...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-white/30">
                  Tidak ada data setoran.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 font-medium text-white">{item.kodeSetor}</td>
                  <td className="px-6 py-3 text-white/50">{item.nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-white/40">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-white/50">{item.totalBeratKg} kg</td>
                  <td className="px-6 py-3 text-white/50">{item.totalPoin} poin</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-white/10 text-white/50'}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openDetail(item.id)}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-aqua"
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

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="hud-corners glass-dark w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Detail Setoran</h2>
              <button onClick={closeDetail} className="text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading || !detail ? (
              <p className="py-8 text-center text-white/30">Memuat detail...</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 p-3 text-sm">
                  <p className="font-medium text-white">{detail.kodeSetor}</p>
                  <p className="text-white/40">{detail.nasabah.namaNasabah} · {detail.nasabah.telp}</p>
                  <p className="text-white/40">{detail.nasabah.alamat}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-white/60">Rincian Sampah</p>
                  <div className="space-y-2">
                    {detail.detailSetors.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-white">{item.kategori}</p>
                          <p className="text-white/40 capitalize">{item.jenis}</p>
                        </div>
                        <div className="text-right">
                          <p className="flex items-center gap-1 text-white/50">
                            <Scale className="h-3.5 w-3.5" /> {item.beratKg} kg
                          </p>
                          <p className="flex items-center gap-1 text-emerald">
                            <Coins className="h-3.5 w-3.5" /> {item.subtotalPoin} poin
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between rounded-xl bg-gradient-to-r from-emerald/15 to-aqua/15 px-4 py-3 text-sm font-medium">
                  <span className="text-white/70">Total</span>
                  <span className="text-emerald">
                    {detail.totalBeratKg} kg · {detail.totalPoin} poin
                  </span>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/60">
                    Catatan Admin
                  </label>
                  <textarea
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    rows={2}
                    placeholder="Catatan pemeriksaan (opsional)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                {detail.status === 'menunggu_konfirmasi' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify('ditolak')}
                      disabled={submitting}
                      className="flex-1 rounded-xl border border-red-500/30 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleVerify('diverifikasi')}
                      disabled={submitting}
                      className="flex-1 rounded-xl border border-aqua/30 py-2 text-sm font-medium text-aqua hover:bg-aqua/10 disabled:opacity-50"
                    >
                      Verifikasi
                    </button>
                    <button
                      onClick={() => handleVerify('selesai')}
                      disabled={submitting}
                      className="btn-aero flex-1 rounded-xl bg-gradient-to-r from-emerald to-aqua py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? 'Memproses...' : 'Selesaikan'}
                    </button>
                  </div>
                )}

                {detail.status === 'diverifikasi' && (
                  <button
                    onClick={() => handleVerify('selesai')}
                    disabled={submitting}
                    className="btn-aero w-full rounded-xl bg-gradient-to-r from-emerald to-aqua py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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