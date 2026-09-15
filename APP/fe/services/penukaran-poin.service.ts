import { apiClient } from '@/lib/api-client';
import { ApiResponse, PenukaranListItem, UpdateStatusPenukaranPayload } from '@/types';

export async function getAllPenukaranAdmin(bulan?: string) {
  const res = await apiClient.get<ApiResponse<PenukaranListItem[]>>('/penukaran-poin/admin/list', {
    params: bulan ? { bulan } : {},
  });
  return res.data.data;
}

export async function updateStatusPenukaran(id: string, payload: UpdateStatusPenukaranPayload) {
  const res = await apiClient.put<ApiResponse<any>>(`/penukaran-poin/admin/status/${id}`, payload);
  return res.data.data;
}

export interface TukarPoinResponse {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  sisaSaldoPoin: number;
  status: string;
  hadiah: { namaHadiah: string };
}

export async function tukarPoin(hadiahId: string) {
  const res = await apiClient.post<ApiResponse<TukarPoinResponse>>('/penukaran-poin/tukar', {
    hadiahId,
  });
  return res.data.data;
}

export interface MyPenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  status: string;
  hadiah: { namaHadiah: string; poinDibutuhkan: number; foto: string | null };
}

export async function getMyPenukaran() {
  const res = await apiClient.get<ApiResponse<MyPenukaranItem[]>>('/penukaran-poin/my-penukaran');
  return res.data.data;
}