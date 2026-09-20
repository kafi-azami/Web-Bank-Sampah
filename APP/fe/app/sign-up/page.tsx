'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerNasabah } from '@/services/auth.service';
import { Recycle, Coins, Leaf, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
    namaNasabah: '',
    alamat: '',
    telp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen overflow-hidden bg-navy">
      {/* Glow orbs background */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none fixed -right-32 bottom-0 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-emerald/10 blur-3xl" />

      {/* Kiri: Panel gradasi (desktop) */}
      <div className="hud-grid relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy-light p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-48 items-end justify-between gap-1 px-4 opacity-60">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="light-bar flex-1"
              style={{ animationDelay: `${(i % 8) * 0.3}s` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hud-corners animate-glow relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-light">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/30 to-violet/30" />
            <Recycle className="relative h-5 w-5 text-aqua" />
          </div>
          <span className="shimmer-text font-display text-lg font-bold">Bank Sampah Digital</span>
        </div>

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            <span className="tech-chip text-aqua/80">New Account Registration</span>
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold leading-tight bg-gradient-to-r from-white via-aqua to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            Mulai Langkah
            <br />
            Peduli Lingkungan.
          </h1>
          <p className="max-w-sm text-white/60">
            Daftar sekarang dan jadikan sampah daur ulangmu bernilai —
            tukarkan dengan poin dan raih berbagai hadiah menarik.
          </p>

          <div className="mt-10 flex gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
              <Leaf className="h-4 w-4 text-emerald" />
              <span className="text-sm font-medium">Ramah Lingkungan</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
              <Coins className="h-4 w-4 text-violet" />
              <span className="text-sm font-medium">Hasilkan Poin</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          © 2026 Bank Sampah Digital. Dibuat untuk Uji Kompetensi Keahlian.
        </p>
      </div>

      {/* Kanan: Form */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="hud-corners glass-dark w-full max-w-sm p-8">
          <div className="mb-5 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua text-white">
              <Recycle className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-white">Bank Sampah Digital</span>
          </div>

          <span className="tech-chip text-aqua/70">Registration</span>
          <h2 className="mb-1 mt-1 font-display text-2xl font-bold text-white">Daftar Akun</h2>
          <p className="mb-6 text-sm text-white/40">Buat akun nasabah untuk mulai menabung sampah</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-white/60">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.namaNasabah}
                onChange={(e) => setForm({ ...form, namaNasabah: e.target.value })}
                placeholder="Nama lengkap Anda"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/60">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Buat username"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/60">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/60">Alamat</label>
              <textarea
                required
                rows={2}
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Alamat lengkap"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/60">No. Telepon</label>
              <input
                type="text"
                required
                value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-aqua focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-aero w-full rounded-xl bg-gradient-to-r from-emerald via-aqua to-violet py-2.5 font-display font-semibold text-white shadow-lg shadow-aqua/20 transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>

            <p className="text-center text-sm text-white/40">
              Sudah punya akun?{' '}
              <Link href="/sign-in" className="font-medium text-aqua hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}