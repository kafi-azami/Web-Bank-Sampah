'use client';

import { useEffect, useState } from 'react';
import {
  getAllNasabah,
  createNasabah,
  updateNasabah,
  deleteNasabah,
} from '@/services/nasabah.service';
import { Nasabah } from '@/types';
import { Plus, Pencil, Trash2, X, Coins } from 'lucide-react';

type ModalMode = 'create' | 'edit' | null;

export default function NasabahPage() {
  const [list, setList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Nasabah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    namaNasabah: '',
    alamat: '',
    telp: '',
  });

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllNasabah();
      setList(data);
    } catch {
      setError('Gagal memuat data nasabah.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setForm({ username: '', password: '', namaNasabah: '', alamat: '', telp: '' });
    setError('');
    setModalMode('create');
  }

  function openEditModal(nasabah: Nasabah) {
    setSelected(nasabah);
    setForm({
      username: nasabah.user.username,
      password: '',
      namaNasabah: nasabah.namaNasabah,
      alamat: nasabah.alamat,
      telp: nasabah.telp,
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

    try {
      if (modalMode === 'create') {
        await createNasabah(form);
      } else if (modalMode === 'edit' && selected) {
        await updateNasabah(selected.id, {
          namaNasabah: form.namaNasabah,
          alamat: form.alamat,
          telp: form.telp,
        });
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
    if (!confirm('Yakin ingin menghapus nasabah ini?')) return;
    try {
      await deleteNasabah(id);
      await loadData();
    } catch {
      alert('Gagal menghapus nasabah.');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Nasabah</h1>
          <p className="text-gray-500">Kelola akun nasabah bank sampah</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Tambah Nasabah
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Nama</th>
              <th className="px-6 py-3 font-medium">Username</th>
              <th className="px-6 py-3 font-medium">Alamat</th>
              <th className="px-6 py-3 font-medium">Telp</th>
              <th className="px-6 py-3 font-medium">Saldo Poin</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Belum ada data nasabah.
                </td>
              </tr>
            ) : (
              list.map((nasabah) => (
                <tr key={nasabah.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {nasabah.namaNasabah}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{nasabah.user.username}</td>
                  <td className="px-6 py-3 text-gray-500">{nasabah.alamat}</td>
                  <td className="px-6 py-3 text-gray-500">{nasabah.telp}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Coins className="h-3 w-3" /> {nasabah.saldoPoin}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openEditModal(nasabah)}
                      className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(nasabah.id)}
                      className="rounded-md p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {modalMode === 'create' ? 'Tambah Nasabah' : 'Edit Nasabah'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {modalMode === 'create' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.namaNasabah}
                  onChange={(e) => setForm({ ...form, namaNasabah: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <textarea
                  required
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  No. Telepon
                </label>
                <input
                  type="text"
                  required
                  value={form.telp}
                  onChange={(e) => setForm({ ...form, telp: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
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