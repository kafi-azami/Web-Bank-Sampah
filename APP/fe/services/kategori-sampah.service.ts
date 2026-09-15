import { apiClient } from '@/lib/api-client';
import { ApiResponse, KategoriSampah, CreateKategoriPayload, UpdateKategoriPayload } from '@/types';

export async function getAllKategori() {
  const res = await apiClient.get<ApiResponse<KategoriSampah[]>>('/kategori-sampah');
  return res.data.data;
}

export async function createKategori(payload: CreateKategoriPayload) {
  const res = await apiClient.post<ApiResponse<KategoriSampah>>('/kategori-sampah', payload);
  return res.data.data;
}

export async function updateKategori(id: string, payload: UpdateKategoriPayload) {
  const res = await apiClient.put<ApiResponse<KategoriSampah>>(`/kategori-sampah/${id}`, payload);
  return res.data.data;
}

export async function deleteKategori(id: string) {
  const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/kategori-sampah/${id}`);
  return res.data.data;
}