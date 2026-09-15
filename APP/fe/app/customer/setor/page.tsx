'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllKategori } from '@/services/kategori-sampah.service';
import { createPengajuanSetoran } from '@/services/setor-sampah.service';
import { KategoriSampah } from '@/types';
import { Plus, Trash2, Send } from 'lucide-react';

interface ItemForm {
  kategoriSampahId: string;
  beratKg: string;
}

export default function SetorPage() {
  const router = useRouter();
  const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
  const [items, setItems] = useState<ItemForm[]>([{ kategoriSampahId: '', beratKg: '' }]);
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getAllKategori().then(setKategoriList).catch(() => setKategoriList([]));
  }, []);

  function addItem() {
    setItems([...items, { kategoriSampahId: '', beratKg: '' }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemForm, value: string) {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  function estimasiPoin() {
    return items.reduce((sum, item) => {
      const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
      const berat = Number(item.beratKg) || 0;
      return sum + (kategori ? kategori.poinPerKg * berat : 0);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validItems = items.filter((i) => i.kategoriSampahId && Number(i.beratKg) > 0);
    if (validItems.length === 0) {
      setError('Isi minimal 1 jenis sampah dengan berat yang valid.');
      return;
    }

    setSubmitting(true);
    try {
      await createPengajuanSetoran({
        tanggal: new Date().toISOString(),
        catatan,
        items: validItems.map((i) => ({
          kategoriSampahId: i.kategoriSampahId,
          beratKg: Number(i.beratKg),
        })),
      });
      setSuccess(true);
      setTimeout(() => router.push('/customer/riwayat'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengajukan setoran.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Pengajuan Berhasil!</h2>
        <p className="mt-1 text-sm text-gray-500">Mengalihkan ke halaman riwayat...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-800">Ajukan Setoran</h1>
      <p className="mb-6 text-sm text-gray-500">Pilih jenis sampah dan estimasi berat</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Sampah #{index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <select
                required
                value={item.kategoriSampahId}
                onChange={(e) => updateItem(index, 'kategoriSampahId', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="">Pilih jenis sampah</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.namaKategori} ({k.poinPerKg} poin/kg)
                  </option>
                ))}
              </select>

              <input
                type="number"
                required
                min={0.1}
                step={0.1}
                placeholder="Estimasi berat (kg)"
                value={item.beratKg}
                onChange={(e) => updateItem(index, 'beratKg', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-green-500 hover:text-green-600"
        >
          <Plus className="h-4 w-4" /> Tambah Jenis Sampah
        </button>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Catatan (opsional)
          </label>
          <textarea
            rows={2}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Sampah sudah dipilah rapi"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Estimasi Poin: {estimasiPoin()} poin
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Ajukan Setoran'}
        </button>
      </form>
    </div>
  );
}