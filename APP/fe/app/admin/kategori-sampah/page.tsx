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
  { value: 'plastik', label: 'Plastik', color: 'bg-blue-50 text-blue-700' },
  { value: 'kertas', label: 'Kertas', color: 'bg-amber-50 text-amber-700' },
  { value: 'logam', label: 'Logam', color: 'bg-gray-100 text-gray-700' },
  { value: 'kaca', label: 'Kaca', color: 'bg-cyan-50 text-cyan-700' },
];

export default function KategoriSampahPage() {
  const [list, setList] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<KategoriSampah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      namaKategori: form.namaKategori,
      hargaPerKg: Number(form.hargaPerKg),
      poinPerKg: Number(form.poinPerKg),
      jenis: form.jenis,
    };

    try {
      if (modalMode === 'create') {
        await createKategori(payload);
      } else if (modalMode === 'edit' && selected) {
        await updateKategori(selected.id, payload);
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
    return JENIS_OPTIONS.find((j) => j.value === jenis)?.color || 'bg-gray-100 text-gray-700';
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Sampah</h1>
          <p className="text-gray-500">Kelola jenis sampah daur ulang beserta harga & poin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-gray-400">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">Belum ada kategori sampah.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${jenisStyle(item.jenis)}`}
                >
                  {item.jenis}
                </span>
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
              <h3 className="mb-2 font-semibold text-gray-800">{item.namaKategori}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Rp {item.hargaPerKg.toLocaleString('id-ID')}/kg</span>
                <span className="font-medium text-green-600">{item.poinPerKg} poin/kg</span>
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
                {modalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={form.namaKategori}
                  onChange={(e) => setForm({ ...form, namaKategori: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Jenis
                </label>
                <select
                  value={form.jenis}
                  onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  {JENIS_OPTIONS.map((j) => (
                    <option key={j.value} value={j.value}>
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Harga/Kg (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.hargaPerKg}
                    onChange={(e) => setForm({ ...form, hargaPerKg: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Poin/Kg
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.poinPerKg}
                    onChange={(e) => setForm({ ...form, poinPerKg: e.target.value })}
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