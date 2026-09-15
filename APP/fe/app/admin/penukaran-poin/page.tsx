'use client';

import { useEffect, useState } from 'react';
import { getAllPenukaranAdmin, updateStatusPenukaran } from '@/services/penukaran-poin.service';
import { PenukaranListItem } from '@/types';
import { CheckCircle2 } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  diproses: 'bg-amber-50 text-amber-700',
  selesai: 'bg-green-50 text-green-700',
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Penukaran Poin</h1>
        <p className="text-gray-500">Kelola transaksi penukaran poin nasabah dengan hadiah</p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Kode Penukaran</th>
              <th className="px-6 py-3 font-medium">Nasabah</th>
              <th className="px-6 py-3 font-medium">Hadiah</th>
              <th className="px-6 py-3 font-medium">Tanggal</th>
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
                  Belum ada transaksi penukaran poin.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{item.kodePenukaran}</td>
                  <td className="px-6 py-3 text-gray-600">{item.nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-gray-600">{item.hadiah.namaHadiah}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.poinTerpakai} poin</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {item.status === 'diproses' ? (
                      <button
                        onClick={() => handleComplete(item.id)}
                        disabled={processingId === item.id}
                        className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {processingId === item.id ? 'Memproses...' : 'Selesaikan'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
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