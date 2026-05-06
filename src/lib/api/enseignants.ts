import { api, getToken, getBaseUrl, ApiError } from './client';
import type { ApiEnseignant } from './types';

export async function getEnseignants(): Promise<ApiEnseignant[]> {
  return api.get<ApiEnseignant[]>('/api/enseignants');
}

export async function getEnseignant(id: number | string): Promise<ApiEnseignant> {
  return api.get<ApiEnseignant>(`/api/enseignants/${id}`);
}

export async function createEnseignant(data: {
  nom: string;
  titre: string;
  specialite: string;
  email: string;
  linkedin: string;
  ordre: number;
  is_active: boolean;
}): Promise<ApiEnseignant> {
  return api.post<ApiEnseignant>('/api/enseignants', data);
}

export async function updateEnseignant(
  id: number | string,
  data: Partial<ApiEnseignant>
): Promise<ApiEnseignant> {
  return api.put<ApiEnseignant>(`/api/enseignants/${id}`, data);
}

export async function deleteEnseignant(id: number | string): Promise<void> {
  await api.delete(`/api/enseignants/${id}`);
}

export async function reorderEnseignant(id: number | string, ordre: number): Promise<ApiEnseignant> {
  return api.patch<ApiEnseignant>(`/api/enseignants/${id}/reorder`, { ordre });
}

export async function uploadEnseignantPhoto(id: number | string, file: File): Promise<ApiEnseignant> {
  const formData = new FormData();
  formData.append('photo', file);
  const token = getToken();
  const res = await fetch(`${getBaseUrl()}/api/enseignants/${id}/upload-photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error || res.statusText, res.status, data);
  return data;
}
