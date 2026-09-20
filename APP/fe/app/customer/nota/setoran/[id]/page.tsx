'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSetoranDetail } from '@/services/setor-sampah.service';
import { SetoranDetail } from '@/types';
import { Printer, ArrowLeft, Recycle } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diverifikasi: 'Diverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export default function NotaSetoranPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<SetoranDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSetoranDetail(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-8 text-center text-gray-400">Memuat nota...</p>;
  }

  if (!data) {
    return <p className="p-8 text-center text-red-500">Nota tidak ditemukan.</p>;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {/* Toolbar - hilang saat print */}
      <div className="mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <Printer className="h-4 w-4" /> Cetak
        </button>
      </div>

      {/* Struk */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-4 flex flex-col items-center border-b border-dashed border-gray-300 pb-4 text-center">
          <Recycle className="mb-2 h-8 w-8 text-green-600" />
          <h1 className="font-bold text-gray-800">Bank Sampah Digital</h1>
          <p className="text-xs text-gray-500">Bukti Penyetoran Sampah</p>
        </div>

        <div className="mb-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Kode Setor</span>
            <span className="font-medium text-gray-800">{data.kodeSetor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className="font-medium text-gray-800">
              {new Date(data.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-gray-800">
              {STATUS_LABEL[data.status] || data.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Nasabah</span>
            <span className="font-medium text-gray-800">{data.nasabah.namaNasabah}</span>
          </div>
        </div>

        <div className="mb-4 border-t border-dashed border-gray-300 pt-3">
          <p className="mb-2 text-xs font-medium uppercase text-gray-400">Rincian Sampah</p>
          <div className="space-y-2">
            {data.detailSetors.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-700">{item.kategori}</p>
                  <p className="text-xs text-gray-400">
                    {item.beratKg} kg × {item.poinPerKg} poin/kg
                  </p>
                </div>
                <span className="font-medium text-gray-800">{item.subtotalPoin} poin</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between border-t border-dashed border-gray-300 pt-3 text-sm font-bold">
          <span className="text-gray-700">Total</span>
          <span className="text-green-700">
            {data.totalBeratKg} kg · {data.totalPoin} poin
          </span>
        </div>

        {data.catatanAdmin && (
          <p className="mt-3 border-t border-dashed border-gray-300 pt-3 text-xs text-gray-500">
            Catatan: {data.catatanAdmin}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Terima kasih telah menjaga lingkungan 🌱
        </p>
      </div>
    </div>
  );
}