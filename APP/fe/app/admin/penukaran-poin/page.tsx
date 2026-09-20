'use client';

import { useEffect, useState } from 'react';
import { getAllPenukaranAdmin, updateStatusPenukaran } from '@/services/penukaran-poin.service';
import { PenukaranListItem } from '@/types';
import { CheckCircle2 } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  diproses: 'bg-violet/15 text-violet border border-violet/30',
  selesai: 'bg-emerald/15 text-emerald border border-emerald/30',
};

export default function PenukaranPoinPage() {
  const [list, setList] = useState<PenukaranListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllPenukaranAdmin();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleComplete(id: string) {
    setProcessingId(id);
    try {
      await updateStatusPenukaran(id, { status: 'selesai' });
      await loadData();
    } catch {
      alert('Gagal memperbarui status.');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
        </span>
        <span className="tech-chip text-violet">Module: Redemption Log</span>
      </div>

      <div className="relative mb-6">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
        <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
          Penukaran Poin
        </h1>
        <p className="relative mt-1 text-white/40">Kelola transaksi penukaran poin nasabah dengan hadiah</p>
      </div>

      <div className="hud-corners glass-dark overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/5">
            <tr>
              <th className="tech-chip px-6 py-3 text-white/40">Kode Penukaran</th>
              <th className="tech-chip px-6 py-3 text-white/40">Nasabah</th>
              <th className="tech-chip px-6 py-3 text-white/40">Hadiah</th>
              <th className="tech-chip px-6 py-3 text-white/40">Tanggal</th>
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
                  Belum ada transaksi penukaran poin.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 font-medium text-white">{item.kodePenukaran}</td>
                  <td className="px-6 py-3 text-white/50">{item.nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-white/50">{item.hadiah.namaHadiah}</td>
                  <td className="px-6 py-3 text-white/40">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-white/50">{item.poinTerpakai} poin</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-white/10 text-white/50'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {item.status === 'diproses' ? (
                      <button
                        onClick={() => handleComplete(item.id)}
                        disabled={processingId === item.id}
                        className="btn-aero flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald to-aqua px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {processingId === item.id ? 'Memproses...' : 'Selesaikan'}
                      </button>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}