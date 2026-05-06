import { api } from './client';
import type { ApiPartenaire } from './types';
import { getToken } from './client';

export async function getPartenaires(): Promise<ApiPartenaire[]> {
  return api.get<ApiPartenaire[]>('/api/partenaires');
}

export async function getAdminPartenaires(): Promise<ApiPartenaire[]> {
  return api.get<ApiPartenaire[]>('/api/admin/partenaires');
}

export async function getPartenaireById(id: number | string): Promise<ApiPartenaire> {
  return api.get<ApiPartenaire>(`/api/partenaires/${id}`);
}

export async function createPartenaire(data: {
  nom: string;
  url: string;
  ordre: number;
  is_active: boolean;
}): Promise<ApiPartenaire> {
  return api.post<ApiPartenaire>('/api/partenaires', data);
}

export async function updatePartenaire(
  id: number | string,
  data: Partial<{ nom: string; url: string; ordre: number; is_active: boolean }>
): Promise<ApiPartenaire> {
  return api.put<ApiPartenaire>(`/api/partenaires/${id}`, data);
}

export async function deletePartenaire(id: number | string): Promise<void> {
  return api.delete(`/api/partenaires/${id}`);
}

export async function uploadPartenaireLogo(id: number | string, file: File): Promise<ApiPartenaire> {
  const formData = new FormData();
  formData.append('logo', file);
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/partenaires/${id}/upload-logo`;
  const token = getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}
