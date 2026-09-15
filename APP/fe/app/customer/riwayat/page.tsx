'use client';

import { useEffect, useState } from 'react';
import { getMySetoran } from '@/services/setor-sampah.service';
import { SetoranListItem } from '@/types';
import { Package, Scale, Coins } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  menunggu_konfirmasi: 'bg-amber-50 text-amber-700',
  diverifikasi: 'bg-blue-50 text-blue-700',
  selesai: 'bg-green-50 text-green-700',
  ditolak: 'bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diverifikasi: 'Diverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export default function RiwayatPage() {
  const [list, setList] = useState<SetoranListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySetoran()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-800">Riwayat Setoran</h1>
      <p className="mb-6 text-sm text-gray-500">Status & histori pengajuan penyetoran sampah</p>

      {loading ? (
        <p className="text-center text-gray-400">Memuat data...</p>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Belum ada riwayat setoran.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.kodeSetor}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[item.status] || 'bg-gray-100 text-gray-700'}`}
                >
                  {STATUS_LABEL[item.status] || item.status}
                </span>
              </div>

              <div className="flex gap-4 border-t border-gray-50 pt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" /> {item.totalBeratKg} kg
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <Coins className="h-3.5 w-3.5" /> {item.totalPoin} poin
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}