import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types';

export interface DashboardStats {
  totalNasabah: number;
  totalKategoriSampah: number;
  totalTransaksiSetor: number;
  totalHadiah: number;
  totalBeratSampahKg: number;
  totalPoinTersalurkan: number;
}

export async function getDashboardStats() {
  const res = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return res.data.data;
}

export interface DashboardSummaryResponse {
  saldoPoinSaatIni: number;
  totalSampahDisetorKg: number;
  totalPoinDidapat: number;
  totalPoinDitukar: number;
  transaksiTerakhirSetor: any;
  transaksiTerakhirTukar: any;
}

export async function getDashboardSummary() {
  const res = await apiClient.get<ApiResponse<DashboardSummaryResponse>>('/dashboard/summary');
  return res.data.data;
}