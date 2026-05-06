import { api } from './client';
import type { ApiCotisation } from './types';

export interface SubmitCotisationPayload {
  montant: number;
  annee_universitaire: string;
  methode_paiement: string;
  reference: string;
}

export async function submitCotisation(
  payload: SubmitCotisationPayload
): Promise<ApiCotisation> {
  return api.post<ApiCotisation>('/api/cotisations/submit', payload);
}

// Admin
export async function getCotisations(statut?: 'confirmed' | 'rejected'): Promise<ApiCotisation[]> {
  const q = statut ? `?statut=${statut}` : '';
  return api.get<ApiCotisation[]>(`/api/admin/cotisations${q}`);
}
