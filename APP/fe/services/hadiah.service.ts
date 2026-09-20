import { apiClient } from '@/lib/api-client';
import { ApiResponse, Hadiah, CreateHadiahPayload, UpdateHadiahPayload } from '@/types';

export async function getAllHadiah() {
  const res = await apiClient.get<ApiResponse<Hadiah[]>>('/hadiah');
  return res.data.data;
}

export async function createHadiah(formData: FormData) {
  const res = await apiClient.post<ApiResponse<Hadiah>>('/hadiah', formData);
  return res.data.data;
}

export async function updateHadiah(id: string, formData: FormData) {
  const res = await apiClient.put<ApiResponse<Hadiah>>(`/hadiah/${id}`, formData);
  return res.data.data;
}

export async function deleteHadiah(id: string) {
  const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/hadiah/${id}`);
  return res.data.data;
}