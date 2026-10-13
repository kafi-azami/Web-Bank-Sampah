import Link from 'next/link';
import {
  Recycle,
  Coins,
  Award,
  ArrowRight,
  Leaf,
  ClipboardCheck,
  TrendingUp,
  ShieldCheck,
  Users,
  Droplets,
  Wind,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="hud-grid relative min-h-screen overflow-hidden bg-navy">
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
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
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

      {/* GAMBAR HERO */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <div className="hud-corners overflow-hidden rounded-3xl border-2 border-dashed border-aqua/30 bg-white/5">
          {/* Gamabar bank sampah */}
          <img
            src="/bank-sampah.jpg"
            alt="Ilustrasi Bank Sampah Digital"
            className="aspect-video w-full object-cover"
          />
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-12 text-center">
          <span className="tech-chip text-aqua/70">Alur Sederhana</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Cara Kerja</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/50">
            Tiga langkah mudah untuk mulai mengubah sampahmu jadi nilai tambah
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua shadow-lg shadow-emerald/30">
              <ClipboardCheck className="h-7 w-7 text-white" />
            </div>
            <p className="tech-chip mb-2 text-aqua/60">Langkah 1</p>
            <h3 className="mb-2 font-display font-semibold text-white">Daftar & Pilah Sampah</h3>
            <p className="text-sm text-white/40">
              Buat akun nasabah, lalu pilah sampah daur ulangmu berdasarkan
              jenisnya (plastik, kertas, logam, kaca).
            </p>
          </div>

          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-violet shadow-lg shadow-aqua/30">
              
              <Recycle className="h-7 w-7 text-white" />
            </div>
            <p className="tech-chip mb-2 text-aqua/60">Langkah 2</p>
            <h3 className="mb-2 font-display font-semibold text-white">Setorkan Sampahmu</h3>
            <p className="text-sm text-white/40">
              Ajukan penyetoran lewat aplikasi, tim kami akan menimbang dan
              memverifikasi berat sampah yang kamu setor.
            </p>
          </div>

          <div className="glass-dark hud-corners p-7 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet to-emerald shadow-lg shadow-violet/30">
              
              <Award className="h-7 w-7 text-white" />
            </div>
            <p className="tech-chip mb-2 text-aqua/60">Langkah 3</p>
            <h3 className="mb-2 font-display font-semibold text-white">Kumpulkan & Tukar Poin</h3>
            <p className="text-sm text-white/40">
              Setiap kilogram sampah dikonversi otomatis jadi poin. Tukarkan
              dengan voucher, sembako, atau hadiah lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-12 text-center">
          <span className="tech-chip text-violet/70">Fitur Unggulan</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Apa yang Bisa Kamu Lakukan</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="glass-dark hud-corners flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-display font-semibold text-white">Setor Sampah Kapan Saja</h3>
              <p className="text-sm text-white/40">
                Ajukan penyetoran sampah daur ulang langsung dari aplikasi,
                lengkap dengan status real-time (menunggu, diverifikasi,
                selesai).
              </p>
            </div>
          </div>

          <div className="glass-dark hud-corners flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-aqua/15 text-aqua">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-display font-semibold text-white">Sistem Poin Otomatis</h3>
              <p className="text-sm text-white/40">
                Setiap kilogram sampah yang disetor langsung dikonversi jadi
                poin sesuai jenis dan bobotnya — tidak perlu hitung manual.
              </p>
            </div>
          </div>

          <div className="glass-dark hud-corners flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-display font-semibold text-white">Katalog Hadiah Menarik</h3>
              <p className="text-sm text-white/40">
                Tukarkan poin dengan berbagai voucher, sembako, dan barang
                kebutuhan sehari-hari langsung dari katalog.
              </p>
            </div>
          </div>

          <div className="glass-dark hud-corners flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-display font-semibold text-white">Riwayat & Nota Digital</h3>
              <p className="text-sm text-white/40">
                Pantau seluruh riwayat transaksi setoran dan penukaran poin,
                lengkap dengan bukti nota yang bisa dicetak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan + Gambar */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="tech-chip text-emerald/70">Kenapa Bank Sampah?</span>
            <h2 className="mt-2 mb-6 font-display text-3xl font-bold text-white">
              Keunggulan Menabung Sampah
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald" />
                <div>
                  <h4 className="font-medium text-white">Transparan & Terpercaya</h4>
                  <p className="text-sm text-white/40">
                    Setiap transaksi tercatat digital dan bisa dipantau langsung
                    oleh nasabah, tanpa manipulasi data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-aqua" />
                <div>
                  <h4 className="font-medium text-white">Nilai Ekonomi Nyata</h4>
                  <p className="text-sm text-white/40">
                    Sampah yang biasanya dibuang kini punya nilai tukar, bisa
                    jadi tambahan penghasilan rumah tangga.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet" />
                <div>
                  <h4 className="font-medium text-white">Mudah untuk Semua Kalangan</h4>
                  <p className="text-sm text-white/40">
                    Antarmuka sederhana, bisa digunakan siswa, ibu rumah
                    tangga, hingga pelaku usaha kecil.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gambar */}
          <div className="hud-corners overflow-hidden rounded-3xl border-2 border-dashed border-emerald/30 bg-white/5">
            <img
              src="/sampah.jpg"
              alt="Kegiatan penyetoran sampah"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Dampak Positif */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-12 text-center">
          <span className="tech-chip text-aqua/70">Dampak Nyata</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">
            Dampak Positif Bagi Lingkungan
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-white/50">
            Setiap kilogram sampah yang kamu setor berkontribusi pada bumi
            yang lebih bersih
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="glass-dark hud-corners p-6 text-center">
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-aqua">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Kurangi Sampah TPA</h3>
            <p className="text-sm text-white/40">
              Sampah daur ulang yang terkumpul tidak berakhir menumpuk di
              tempat pembuangan akhir, memperpanjang usia TPA.
            </p>
          </div>

          <div className="glass-dark hud-corners p-6 text-center">
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-violet">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Jaga Kebersihan Air</h3>
            <p className="text-sm text-white/40">
              Mengurangi sampah plastik yang mencemari sungai dan laut,
              menjaga ekosistem perairan tetap sehat.
            </p>
          </div>

          <div className="glass-dark hud-corners p-6 text-center">
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-emerald">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-white">Udara Lebih Bersih</h3>
            <p className="text-sm text-white/40">
              Daur ulang mengurangi kebutuhan pembakaran sampah yang
              menghasilkan polusi udara dan gas rumah kaca.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Akhir */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="hud-corners glass-dark p-10">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Siap Mulai Menabung Sampah?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/50">
            Bergabunglah sekarang dan jadilah bagian dari gerakan peduli
            lingkungan sambil mendapatkan keuntungan.
          </p>
          <Link
            href="/sign-up"
            className="btn-aero mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald via-aqua to-violet px-7 py-3.5 font-display font-semibold text-white shadow-lg shadow-aqua/30 transition hover:opacity-90"
          >
            Daftar Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-navy-light/40 py-6 text-center text-sm text-white/30 backdrop-blur-md">
        © 2026 Bank Sampah Digital. Dibuat untuk Uji Kompetensi Keahlian.
      </footer>
    </div>
  );
}