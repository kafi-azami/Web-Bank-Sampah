import { apiClient } from '@/lib/api-client';
import { ApiResponse, SetoranListItem, SetoranDetail, VerifyPayload } from '@/types';

export async function getAllSetoranAdmin(status?: string) {
  const res = await apiClient.get<ApiResponse<SetoranListItem[]>>('/setor-sampah/admin/list', {
    params: status ? { status } : {},
  });
  return res.data.data;
}

export async function getSetoranDetail(id: string) {
  const res = await apiClient.get<ApiResponse<SetoranDetail>>(`/setor-sampah/${id}`);
  return res.data.data;
}

export async function verifySetoran(id: string, payload: VerifyPayload) {
  const res = await apiClient.put<ApiResponse<any>>(`/setor-sampah/admin/verify/${id}`, payload);
  return res.data.data;
}

export interface ItemSetorPayload {
  kategoriSampahId: string;
  beratKg: number;
}

export interface CreateSetoranPayload {
  tanggal: string;
  catatan?: string;
  items: ItemSetorPayload[];
}

export async function createPengajuanSetoran(payload: CreateSetoranPayload) {
  const res = await apiClient.post<ApiResponse<any>>('/setor-sampah/pengajuan', payload);
  return res.data.data;
}

export async function getMySetoran(bulan?: string) {
  const res = await apiClient.get<ApiResponse<SetoranListItem[]>>('/setor-sampah/my-setor', {
    params: bulan ? { bulan } : {},
  });
  return res.data.data;
}