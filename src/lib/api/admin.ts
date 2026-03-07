import { api } from './client';
import type { ApiEvent, ApiEnseignant } from './types';

export interface LastRegistration {
  id: number;
  statut: string;
  montant_paye: number | null;
  created_at: string;
  nom: string;
  prenom: string;
  email: string;
  event_titre: string;
  event_date: string;
}

export interface AdminStats {
  total_members: number;
  adherents_actifs: number;
  events_total: number;
  events_a_venir: number;
  cotisations_en_attente: number;
  inscriptions_ce_mois: number;
  revenus_total: number;
  dernieres_inscriptions: LastRegistration[];
}

export async function getAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>('/api/admin/stats');
}

export async function getAdminEvents(): Promise<ApiEvent[]> {
  return api.get<ApiEvent[]>('/api/admin/events');
}

export async function getAdminEnseignants(): Promise<ApiEnseignant[]> {
  return api.get<ApiEnseignant[]>('/api/admin/enseignants');
}
