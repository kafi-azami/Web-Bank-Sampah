'use client';

import { useEffect, useState } from 'react';
import {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from '@/services/kategori-sampah.service';
import { KategoriSampah } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type ModalMode = 'create' | 'edit' | null;

const JENIS_OPTIONS = [
  { value: 'plastik', label: 'Plastik', color: 'bg-aqua/15 text-aqua border-aqua/30' },
  { value: 'kertas', label: 'Kertas', color: 'bg-violet/15 text-violet border-violet/30' },
  { value: 'logam', label: 'Logam', color: 'bg-white/10 text-white/60 border-white/20' },
  { value: 'kaca', label: 'Kaca', color: 'bg-emerald/15 text-emerald border-emerald/30' },
];

export default function KategoriSampahPage() {
  const [list, setList] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<KategoriSampah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    namaKategori: '',
    hargaPerKg: '',
    poinPerKg: '',
    jenis: 'plastik',
  });

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllKategori();
      setList(data);
    } catch {
      setError('Gagal memuat data kategori.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setForm({ namaKategori: '', hargaPerKg: '', poinPerKg: '', jenis: 'plastik' });
    setFoto(null);
    setError('');
    setModalMode('create');
  }

  function openEditModal(item: KategoriSampah) {
    setSelected(item);
    setForm({
      namaKategori: item.namaKategori,
      hargaPerKg: String(item.hargaPerKg),
      poinPerKg: String(item.poinPerKg),
      jenis: item.jenis,
    });
    setFoto(null);
    setError('');
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setSelected(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('namaKategori', form.namaKategori);
    formData.append('hargaPerKg', form.hargaPerKg);
    formData.append('poinPerKg', form.poinPerKg);
    formData.append('jenis', form.jenis);
    if (foto) formData.append('foto', foto);

    try {
      if (modalMode === 'create') {
        await createKategori(formData);
      } else if (modalMode === 'edit' && selected) {
        await updateKategori(selected.id, formData);
      }
      await loadData();
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await deleteKategori(id);
      await loadData();
    } catch {
      alert('Gagal menghapus kategori.');
    }
  }

  function jenisStyle(jenis: string) {
    return JENIS_OPTIONS.find((j) => j.value === jenis)?.color || 'bg-white/10 text-white/60 border-white/20';
  }

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="tech-chip text-emerald">Module: Waste Categories</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
          <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            Kategori Sampah
          </h1>
          <p className="relative mt-1 text-white/40">Kelola jenis sampah daur ulang beserta harga & poin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-aero flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-aqua px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-aqua/20 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-white/30">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="col-span-full text-center text-white/30">Belum ada kategori sampah.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="hud-corners glass-dark p-5 transition hover:border-aqua/30">
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${jenisStyle(item.jenis)}`}
                >
                  {item.jenis}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-aqua"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-white">{item.namaKategori}</h3>
              <div className="flex justify-between text-sm text-white/40">
                <span>Rp {item.hargaPerKg.toLocaleString('id-ID')}/kg</span>
                <span className="font-medium text-emerald">{item.poinPerKg} poin/kg</span>
              </div>
            </div>
          ))
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="hud-corners glass-dark w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">
                {modalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
              </h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={form.namaKategori}
                  onChange={(e) => setForm({ ...form, namaKategori: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">Jenis</label>
                <select
                  value={form.jenis}
                  onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-aqua focus:outline-none"
                >
                  {JENIS_OPTIONS.map((j) => (
                    <option key={j.value} value={j.value} className="bg-navy text-white">
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/60">
                    Harga/Kg (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.hargaPerKg}
                    onChange={(e) => setForm({ ...form, hargaPerKg: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/60">
                    Poin/Kg
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.poinPerKg}
                    onChange={(e) => setForm({ ...form, poinPerKg: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">
                  Foto (opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-aqua/20 file:px-3 file:py-1.5 file:text-aqua"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="btn-aero w-full rounded-xl bg-gradient-to-r from-emerald to-aqua py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
