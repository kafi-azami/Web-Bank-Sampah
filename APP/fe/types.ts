export interface AdminBank {
  id: string;
  namaUnit: string;
  namaPengelola: string;
  telp: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  role: 'NASABAH' | 'ADMIN_BANK';
  nasabah: any | null;
  adminBank: AdminBank | null;
  token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface Nasabah {
  id: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  saldoPoin: number;
  foto: string | null;
  user: {
    username: string;
    role: string;
  };
  createdAt?: string;
}

export interface CreateNasabahPayload {
  username: string;
  password: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
}

export interface UpdateNasabahPayload {
  namaNasabah?: string;
  alamat?: string;
  telp?: string;
}

export interface KategoriSampah {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: 'plastik' | 'kertas' | 'logam' | 'kaca';
  foto: string | null;
}

export interface CreateKategoriPayload {
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: string;
}

export type UpdateKategoriPayload = Partial<CreateKategoriPayload>;

export interface Hadiah {
  id: string;
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto: string | null;
}

export interface CreateHadiahPayload {
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
}

export type UpdateHadiahPayload = Partial<CreateHadiahPayload>;

export interface SetoranListItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  nasabah: { namaNasabah: string; telp: string };
  status: string;
  totalBeratKg: number;
  totalPoin: number;
}

export interface SetoranDetailItem {
  kategori: string;
  jenis: string;
  beratKg: number;
  poinPerKg: number;
  subtotalPoin: number;
}

export interface SetoranDetail {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  nasabah: { namaNasabah: string; alamat: string; telp: string };
  totalBeratKg: number;
  totalPoin: number;
  catatanAdmin: string | null;
  detailSetors: SetoranDetailItem[];
}

export interface VerifyItemPayload {
  kategoriSampahId: string;
  beratKgReal: number;
}

export interface VerifyPayload {
  status: 'diverifikasi' | 'ditolak' | 'selesai';
  catatanAdmin?: string;
  itemsReal?: VerifyItemPayload[];
}

export interface RekapitulasiJenis {
  tonaseKg: number;
  rupiah: number;
  poin: number;
}

export interface RekapitulasiBulanan {
  periode: string;
  rekapitulasiTonase: {
    totalKg: number;
    totalTon: number;
    totalEstimasiPembayaranRupiah: number;
    totalPoinDiterbitkan: number;
  };
  breakdownJenisSampah: {
    plastik: RekapitulasiJenis;
    kertas: RekapitulasiJenis;
    logam: RekapitulasiJenis;
    kaca: RekapitulasiJenis;
  };
  rekapitulasiPenukaranPoin: {
    totalTransaksiPenukaran: number;
    totalPoinTerpakai: number;
  };
}

export interface PenukaranListItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  nasabah: { namaNasabah: string; telp: string };
  hadiah: { namaHadiah: string };
  poinTerpakai: number;
  status: string;
}

export interface UpdateStatusPenukaranPayload {
  status: 'diproses' | 'selesai';
}

export interface DashboardSummary {
  saldoPoinSaatIni: number;
  totalSampahDisetorKg: number;
  totalPoinDidapat: number;
  totalPoinDitukar: number;
  transaksiTerakhirSetor: {
    kodeSetor: string;
    tanggal: string;
    beratKg: number;
    poin: number;
    status: string;
  } | null;
  transaksiTerakhirTukar: {
    kodePenukaran: string;
    tanggal: string;
    hadiah: string;
    poin: number;
    status: string;
  } | null;
}