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

    const payload = {
      namaHadiah: form.namaHadiah,
      poinDibutuhkan: Number(form.poinDibutuhkan),
      stok: Number(form.stok),
    };

    try {
      if (modalMode === 'create') {
        await createHadiah(payload);
      } else if (modalMode === 'edit' && selected) {
        await updateHadiah(selected.id, payload);
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Katalog Hadiah</h1>
          <p className="text-gray-500">Kelola voucher & barang penukaran poin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Tambah Hadiah
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-gray-400">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">Belum ada data hadiah.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-pink-50 p-2.5 text-pink-600">
                  <Gift className="h-5 w-5" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">{item.namaHadiah}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-green-600">
                  {item.poinDibutuhkan} poin
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Package className="h-3.5 w-3.5" /> Stok: {item.stok}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Create/Edit */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {modalMode === 'create' ? 'Tambah Hadiah' : 'Edit Hadiah'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Hadiah
                </label>
                <input
                  type="text"
                  required
                  value={form.namaHadiah}
                  onChange={(e) => setForm({ ...form, namaHadiah: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Poin Dibutuhkan
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.poinDibutuhkan}
                    onChange={(e) => setForm({ ...form, poinDibutuhkan: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
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