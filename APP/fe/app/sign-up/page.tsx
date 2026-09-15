'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerNasabah } from '@/services/auth.service';
import { Recycle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
    namaNasabah: '',
    alamat: '',
    telp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerNasabah(form);
      router.push('/sign-in');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <div className="mb-6 flex flex-col items-center">
          <Recycle className="mb-2 h-8 w-8 text-green-600" />
          <h1 className="text-center text-2xl font-bold text-green-700">Daftar Nasabah</h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Buat akun untuk mulai menabung sampah
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              required
              value={form.namaNasabah}
              onChange={(e) => setForm({ ...form, namaNasabah: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Alamat</label>
            <textarea
              required
              rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">No. Telepon</label>
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
            disabled={loading}
            className="w-full rounded-md bg-green-600 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link href="/sign-in" className="font-medium text-green-600 hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}