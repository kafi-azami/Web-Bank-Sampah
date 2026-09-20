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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="hud-corners mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua shadow-lg shadow-emerald/30">
          <Send className="h-9 w-9 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-white">Pengajuan Berhasil!</h2>
        <p className="mt-1 text-sm text-white/50">Mengalihkan ke halaman riwayat...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
        </span>
        <span className="tech-chip text-aqua/80">New Deposit Request</span>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Ajukan Setoran</h1>
        <p className="mt-1 text-white/50">Pilih jenis sampah dan estimasi berat</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="glass-dark hud-corners p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="tech-chip text-white/40">Sampah #{index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-violet hover:text-violet/70"
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-aqua focus:outline-none"
              >
                <option value="" className="bg-navy">Pilih jenis sampah</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id} className="bg-navy">
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-aqua/30 bg-white/5 py-3 text-sm font-medium text-white/40 hover:border-aqua hover:text-aqua"
        >
          <Plus className="h-4 w-4" /> Tambah Jenis Sampah
        </button>

        <div className="glass-dark hud-corners p-4">
          <label className="mb-1 block text-sm font-medium text-white/60">
            Catatan (opsional)
          </label>
          <textarea
            rows={2}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Sampah sudah dipilah rapi"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
          />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald to-aqua px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald/20">
          Estimasi Poin: {estimasiPoin()} poin
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-aero w-full rounded-2xl bg-gradient-to-r from-emerald via-aqua to-violet py-3.5 font-display font-semibold text-white shadow-lg shadow-aqua/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Ajukan Setoran'}
        </button>
      </form>
    </div>
  );
}