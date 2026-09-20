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
  const [foto, setFoto] = useState<File | null>(null);

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
    setFoto(null);
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
    if (modalMode === 'create') {
      formData.append('username', form.username);
      formData.append('password', form.password);
    }
    formData.append('namaNasabah', form.namaNasabah);
    formData.append('alamat', form.alamat);
    formData.append('telp', form.telp);
    if (foto) formData.append('foto', foto);

    try {
      if (modalMode === 'create') {
        await createNasabah(formData);
      } else if (modalMode === 'edit' && selected) {
        await updateNasabah(selected.id, formData);
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
    <div className="hud-grid -m-8 min-h-full p-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
        </span>
        <span className="tech-chip text-aqua">Module: Customer Registry</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-aqua/30 blur-2xl" />
          <h1 className="relative font-display text-3xl font-bold bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            Data Nasabah
          </h1>
          <p className="relative mt-1 text-white/40">Kelola akun nasabah bank sampah</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-aero flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-aqua px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-aqua/20 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Tambah Nasabah
        </button>
      </div>

      <div className="hud-corners glass-dark overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/5">
            <tr>
              <th className="tech-chip px-6 py-3 text-white/40">Nama</th>
              <th className="tech-chip px-6 py-3 text-white/40">Username</th>
              <th className="tech-chip px-6 py-3 text-white/40">Alamat</th>
              <th className="tech-chip px-6 py-3 text-white/40">Telp</th>
              <th className="tech-chip px-6 py-3 text-white/40">Saldo Poin</th>
              <th className="tech-chip px-6 py-3 text-right text-white/40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/30">
                  Memuat data...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/30">
                  Belum ada data nasabah.
                </td>
              </tr>
            ) : (
              list.map((nasabah) => (
                <tr key={nasabah.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 font-medium text-white">{nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-white/40">{nasabah.user.username}</td>
                  <td className="px-6 py-3 text-white/40">{nasabah.alamat}</td>
                  <td className="px-6 py-3 text-white/40">{nasabah.telp}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald/30 bg-emerald/15 px-2.5 py-1 text-xs font-medium text-emerald">
                      <Coins className="h-3 w-3" /> {nasabah.saldoPoin}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openEditModal(nasabah)}
                      className="mr-2 rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-aqua"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(nasabah.id)}
                      className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
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

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="hud-corners glass-dark w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">
                {modalMode === 'create' ? 'Tambah Nasabah' : 'Edit Nasabah'}
              </h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {modalMode === 'create' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/60">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/60">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.namaNasabah}
                  onChange={(e) => setForm({ ...form, namaNasabah: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">Alamat</label>
                <textarea
                  required
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/60">
                  No. Telepon
                </label>
                <input
                  type="text"
                  required
                  value={form.telp}
                  onChange={(e) => setForm({ ...form, telp: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                />
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