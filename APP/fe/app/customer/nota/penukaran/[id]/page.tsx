'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNotaPenukaran, NotaPenukaran } from '@/services/penukaran-poin.service';
import { Printer, ArrowLeft, Gift } from 'lucide-react';

export default function NotaPenukaranPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<NotaPenukaran | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotaPenukaran(id)
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

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-4 flex flex-col items-center border-b border-dashed border-gray-300 pb-4 text-center">
          <Gift className="mb-2 h-8 w-8 text-pink-600" />
          <h1 className="font-bold text-gray-800">Bank Sampah Digital</h1>
          <p className="text-xs text-gray-500">Bukti Penukaran Poin</p>
        </div>

        <div className="mb-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Kode Penukaran</span>
            <span className="font-medium text-gray-800">{data.kodePenukaran}</span>
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
            <span className="font-medium text-gray-800 capitalize">{data.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Nasabah</span>
            <span className="font-medium text-gray-800">{data.nasabah.namaNasabah}</span>
          </div>
        </div>

        <div className="mb-4 border-t border-dashed border-gray-300 pt-3">
          <p className="mb-2 text-xs font-medium uppercase text-gray-400">Hadiah Ditukar</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{data.hadiah.namaHadiah}</span>
            <span className="font-medium text-gray-800">{data.hadiah.poinDibutuhkan} poin</span>
          </div>
        </div>

        <div className="flex justify-between border-t border-dashed border-gray-300 pt-3 text-sm font-bold">
          <span className="text-gray-700">Poin Terpakai</span>
          <span className="text-pink-700">{data.poinTerpakai} poin</span>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Terima kasih telah menggunakan Bank Sampah Digital 🎁
        </p>
      </div>
    </div>
  );
}