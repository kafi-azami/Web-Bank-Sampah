import { apiClient } from '@/lib/api-client';
import { ApiResponse, LoginResponse } from '../types';

export async function loginUser(username: string, password: string) {
  const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
    username,
    password,
  });
  return res.data.data;
}

export interface RegisterNasabahPayload {
  username: string;
  password: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
}

export async function registerNasabah(payload: RegisterNasabahPayload) {
  const res = await apiClient.post<ApiResponse<any>>('/auth/nasabah/register', payload);
  return res.data.data;
}