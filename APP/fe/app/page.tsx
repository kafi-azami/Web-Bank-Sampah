import Link from 'next/link';
import { Recycle, Coins, Award, ArrowRight, Leaf } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="wavy-grid-bg relative min-h-screen overflow-hidden bg-navy">
      {/* Glow orbs melayang */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 left-1/4 h-96 w-96 rounded-full bg-emerald/15 blur-3xl" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-navy-light/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="hud-corners animate-glow relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-light">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/30 to-violet/30" />
              <Recycle className="relative h-5 w-5 text-aqua" />
            </div>
            <span className="shimmer-text font-display text-lg font-bold">Bank Sampah Digital</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="rounded-full border border-aqua/30 bg-white/5 px-5 py-2 text-sm font-medium text-aqua backdrop-blur-md transition hover:border-aqua/60 hover:bg-aqua/10 hover:shadow-[0_0_16px_rgba(56,189,248,0.35)]"
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="btn-aero rounded-full bg-gradient-to-r from-emerald via-aqua to-violet px-5 py-2 text-sm font-medium text-white shadow-lg shadow-aqua/30 transition hover:opacity-90 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            >
              Daftar Nasabah
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
          </span>
          <span className="tech-chip text-emerald/80">Platform Aktif</span>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-md">
          <Leaf className="h-3.5 w-3.5 text-emerald" /> Platform Bank Sampah Digital
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
          Ubah Sampah Jadi{' '}
          <span className="bg-gradient-to-r from-emerald via-aqua to-violet bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
            Berkah
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/50">
          Setorkan sampah daur ulangmu, kumpulkan poin, dan tukarkan dengan
          berbagai hadiah menarik. Mudah, cepat, dan ramah lingkungan.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="btn-aero flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald via-aqua to-violet px-7 py-3.5 font-display font-semibold text-white shadow-lg shadow-aqua/30 transition hover:opacity-90"
          >
            Mulai Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur-md hover:bg-white/10"
          >
            Sudah Punya Akun?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua shadow-lg shadow-emerald/30">
              <Recycle className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Setor Sampah</h3>
            <p className="text-sm text-white/40">
              Ajukan penyetoran sampah daur ulang kapan saja, tim kami yang
              proses.
            </p>
          </div>

          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-violet shadow-lg shadow-aqua/30">
              <Coins className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Kumpulkan Poin</h3>
            <p className="text-sm text-white/40">
              Setiap kilogram sampah yang disetor dikonversi otomatis jadi
              poin.
            </p>
          </div>

          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet to-emerald shadow-lg shadow-violet/30">

              <Award className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Tukar Hadiah</h3>
            <p className="text-sm text-white/40">
              Tukarkan poinmu dengan voucher, sembako, dan hadiah menarik
              lainnya.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-navy-light/40 py-6 text-center text-sm text-white/30 backdrop-blur-md">
        © 2026 Bank Sampah Digital. Dibuat untuk Uji Kompetensi Keahlian.
      </footer>
    </div>
  );
}