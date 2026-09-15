import { apiClient } from '@/lib/api-client';
import { ApiResponse, Nasabah, CreateNasabahPayload, UpdateNasabahPayload } from '@/types';

export async function getAllNasabah() {
  const res = await apiClient.get<ApiResponse<Nasabah[]>>('/admin/nasabah');
  return res.data.data;
}

export async function getNasabahById(id: string) {
  const res = await apiClient.get<ApiResponse<Nasabah>>(`/admin/nasabah/${id}`);
  return res.data.data;
}

export async function createNasabah(payload: CreateNasabahPayload) {
  const res = await apiClient.post<ApiResponse<Nasabah>>('/admin/nasabah', payload);
  return res.data.data;
}

export async function updateNasabah(id: string, payload: UpdateNasabahPayload) {
  const res = await apiClient.put<ApiResponse<Nasabah>>(`/admin/nasabah/${id}`, payload);
  return res.data.data;
}

export async function deleteNasabah(id: string) {
  const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/nasabah/${id}`);
  return res.data.data;
}