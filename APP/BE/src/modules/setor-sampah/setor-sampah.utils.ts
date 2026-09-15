export const DEPOSIT_STATUS_MAP: Record<string, string> = {
  BELUM_DIKONFIRMASI: 'menunggu_konfirmasi',
  DIVERIFIKASI: 'diverifikasi',
  SELESAI: 'selesai',
  DITOLAK: 'ditolak',
};

export const DEPOSIT_STATUS_REVERSE_MAP: Record<string, string> = {
  menunggu_konfirmasi: 'BELUM_DIKONFIRMASI',
  diverifikasi: 'DIVERIFIKASI',
  selesai: 'SELESAI',
  ditolak: 'DITOLAK',
};