import { api } from './client';
import type { ApiAvantage } from './types';

export async function getAvantages(): Promise<ApiAvantage[]> {
  return api.get<ApiAvantage[]>('/api/avantages');
}

export async function getAdminAvantages(): Promise<ApiAvantage[]> {
  return api.get<ApiAvantage[]>('/api/admin/avantages');
}

export async function createAvantage(data: {
  libelle: string;
  type_avantage?: 'avantage' | 'reduction' | 'autre';
  ordre?: number;
  is_active?: boolean;
}): Promise<ApiAvantage> {
  return api.post<ApiAvantage>('/api/admin/avantages', data);
}

export async function updateAvantage(
  id: number | string,
  data: Partial<{ libelle: string; type_avantage: 'avantage' | 'reduction' | 'autre'; ordre: number; is_active: boolean }>
): Promise<ApiAvantage> {
  return api.put<ApiAvantage>(`/api/admin/avantages/${id}`, data);
}

export async function deleteAvantage(id: number | string): Promise<void> {
  return api.delete(`/api/admin/avantages/${id}`);
}
