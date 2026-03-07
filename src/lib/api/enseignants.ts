import { api } from './client';
import type { ApiEnseignant } from './types';

export async function getEnseignants(): Promise<ApiEnseignant[]> {
  return api.get<ApiEnseignant[]>('/api/enseignants');
}

export async function getEnseignant(id: number | string): Promise<ApiEnseignant> {
  return api.get<ApiEnseignant>(`/api/enseignants/${id}`);
}
