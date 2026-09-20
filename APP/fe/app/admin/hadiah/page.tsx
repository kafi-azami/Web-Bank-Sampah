'use client';

import { useEffect, useState } from 'react';
import {
  getAllHadiah,
  createHadiah,
  updateHadiah,
  deleteHadiah,
} from '@/services/hadiah.service';
import { Hadiah } from '@/types';
import { Plus, Pencil, Trash2, X, Gift, Package } from 'lucide-react';

type ModalMode = 'create' | 'edit' | null;

export default function HadiahPage() {
  const [list, setList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Hadiah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    namaHadiah: '',
    poinDibutuhkan: '',
    stok: '',
  });

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllHadiah();
      setList(data);
    } catch {
      setError('Gagal memuat data hadiah.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setForm({ namaHadiah: '', poinDibutuhkan: '', stok: '' });
    setFoto(null);
    setError('');
    setModalMode('create');
  }

  function openEditModal(item: Hadiah) {
    setSelected(item);
    setForm({
      namaHadiah: item.namaHadiah,
      poinDibutuhkan: String(item.poinDibutuhkan),
      stok: String(item.stok),
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
    formData.append('namaHadiah', form.namaHadiah);
    formData.append('poinDibutuhkan', form.poinDibutuhkan);
    formData.append('stok', form.stok);
    if (foto) formData.append('foto', foto);

    try {
      if (modalMode === 'create') {
        await createHadiah(formData);
      } else if (modalMode === 'edit' && selected) {
        await updateHadiah(selected.id, formData);
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
    if (!confirm('Yakin ingin menghapus hadiah ini?')) return;
    try {
      await deleteHadiah(id);
      await loadData();
    } catch {
      alert('Gagal menghapus hadiah.');
    }
  }

  return (
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
        </span>
        <span className="tech-chip text-violet">Module: Reward Catalog</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
          <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            Katalog Hadiah
          </h1>
          <p className="relative mt-1 text-white/40">Kelola voucher & barang penukaran poin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-aero flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-aqua px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-aqua/20 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Tambah Hadiah
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-white/30">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="col-span-full text-center text-white/30">Belum ada data hadiah.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="hud-corners glass-dark p-5 transition hover:border-aqua/30">
              <div className="mb-3 flex items-start justify-between">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua">
                  <Gift className="h-5 w-5 text-white" />
                </div>
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
              <h3 className="mb-2 font-semibold text-white">{item.namaHadiah}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-emerald">{item.poinDibutuhkan} poin</span>
                <span className="flex items-center gap-1 text-white/40">
                  <Package className="h-3.5 w-3.5" /> Stok: {item.stok}
                </span>
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
                {modalMode === 'create' ? 'Tambah Hadiah' : 'Edit Hadiah'}
              </h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">
                  Nama Hadiah
                </label>
                <input
                  type="text"
                  required
                  value={form.namaHadiah}
                  onChange={(e) => setForm({ ...form, namaHadiah: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/60">
                    Poin Dibutuhkan
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.poinDibutuhkan}
                    onChange={(e) => setForm({ ...form, poinDibutuhkan: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/60">Stok</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
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
};