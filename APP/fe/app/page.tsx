import Link from 'next/link';
import { Recycle, Coins, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-7 w-7 text-green-600" />
            <span className="text-lg font-bold text-gray-800">Bank Sampah Digital</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Daftar Nasabah
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Ubah Sampah Jadi <span className="text-green-600">Berkah</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Setorkan sampah daur ulangmu, kumpulkan poin, dan tukarkan dengan
          berbagai hadiah menarik. Mudah, cepat, dan ramah lingkungan.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
          >
            Mulai Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Sudah Punya Akun?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <Recycle className="mx-auto mb-4 h-10 w-10 text-green-600" />
            <h3 className="mb-2 font-semibold text-gray-800">Setor Sampah</h3>
            <p className="text-sm text-gray-500">
              Ajukan penyetoran sampah daur ulang kapan saja, tim kami yang
              proses.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <Coins className="mx-auto mb-4 h-10 w-10 text-green-600" />
            <h3 className="mb-2 font-semibold text-gray-800">Kumpulkan Poin</h3>
            <p className="text-sm text-gray-500">
              Setiap kilogram sampah yang disetor dikonversi otomatis jadi
              poin.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <Award className="mx-auto mb-4 h-10 w-10 text-green-600" />
            <h3 className="mb-2 font-semibold text-gray-800">Tukar Hadiah</h3>
            <p className="text-sm text-gray-500">
              Tukarkan poinmu dengan voucher, sembako, dan hadiah menarik
              lainnya.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2026 Bank Sampah Digital. Dibuat untuk Uji Kompetensi Keahlian.
      </footer>
    </div>
  );
}