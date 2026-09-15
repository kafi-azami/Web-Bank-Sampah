import { apiClient } from '@/lib/api-client';
import { ApiResponse, RekapitulasiBulanan } from '@/types';

export async function getRekapitulasiBulanan(bulan: string) {
  const res = await apiClient.get<ApiResponse<RekapitulasiBulanan>>('/rekapitulasi/bulanan', {
    params: { bulan },
  });
  return res.data.data;
}