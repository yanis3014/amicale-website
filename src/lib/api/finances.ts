import { api } from './client';

export interface FinanceOverview {
  revenus_cotisations: number;
  revenus_events: number;
  revenus_manuels: number;
  total: number;
  nb_cotisations: number;
  nb_inscriptions_payantes: number;
  entrees_manuelles: FinanceEntry[];
}

export interface FinanceEntry {
  id: number;
  montant: number;
  libelle: string;
  type_entree: 'sponsor' | 'don' | 'autre';
  date_entree: string;
  created_at: string;
  created_by_nom?: string;
  created_by_prenom?: string;
  created_by_identifier?: string | null;
}

export async function getFinanceOverview(): Promise<FinanceOverview> {
  return api.get<FinanceOverview>('/api/admin/finances/overview');
}

export async function getFinanceEntries(params?: {
  type_entree?: 'sponsor' | 'don' | 'autre';
  limit?: number;
  offset?: number;
}): Promise<FinanceEntry[]> {
  const searchParams = new URLSearchParams();
  if (params?.type_entree) searchParams.set('type_entree', params.type_entree);
  if (params?.limit != null) searchParams.set('limit', String(params.limit));
  if (params?.offset != null) searchParams.set('offset', String(params.offset));
  const q = searchParams.toString();
  return api.get<FinanceEntry[]>(`/api/admin/finances/entries${q ? `?${q}` : ''}`);
}

export async function createFinanceEntry(data: {
  montant: number;
  libelle: string;
  type_entree: 'sponsor' | 'don' | 'autre';
  date_entree: string;
}): Promise<FinanceEntry> {
  return api.post<FinanceEntry>('/api/admin/finances/entries', data);
}

export async function updateFinanceEntry(
  id: number,
  data: { montant?: number; libelle?: string; type_entree?: 'sponsor' | 'don' | 'autre'; date_entree?: string }
): Promise<FinanceEntry> {
  return api.put<FinanceEntry>(`/api/admin/finances/entries/${id}`, data);
}

export async function deleteFinanceEntry(id: number): Promise<void> {
  return api.delete(`/api/admin/finances/entries/${id}`);
}
