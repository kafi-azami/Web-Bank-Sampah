import { apiClient } from '@/lib/api-client';
import { ApiResponse, KategoriSampah, CreateKategoriPayload, UpdateKategoriPayload } from '@/types';

export async function getAllKategori() {
  const res = await apiClient.get<ApiResponse<KategoriSampah[]>>('/kategori-sampah');
  return res.data.data;
}

export async function createKategori(formData: FormData) {
  const res = await apiClient.post<ApiResponse<KategoriSampah>>('/kategori-sampah', formData);
  return res.data.data;
}

export async function updateKategori(id: string, formData: FormData) {
  const res = await apiClient.put<ApiResponse<KategoriSampah>>(`/kategori-sampah/${id}`, formData);
  return res.data.data;
}

export async function deleteKategori(id: string) {
  const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/kategori-sampah/${id}`);
  return res.data.data;
}