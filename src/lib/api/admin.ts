import { api } from './client';
import type { ApiEvent, ApiEnseignant } from './types';

export interface AuditLogEntry {
  id: number;
  user_id: number;
  user_email: string | null;
  admin_identifier: string | null;
  action: string;
  method: string;
  path: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogResponse {
  items: AuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuditAdmin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  admin_identifier: string | null;
  numero_membre: string | null;
}

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
  revenus_ce_mois: number;
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

export async function getAuditLogs(params?: {
  user_id?: number;
  admin_identifier?: string;
  action?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLogResponse> {
  const searchParams = new URLSearchParams();
  if (params?.user_id != null) searchParams.set('user_id', String(params.user_id));
  if (params?.admin_identifier) searchParams.set('admin_identifier', params.admin_identifier);
  if (params?.action) searchParams.set('action', params.action);
  if (params?.limit != null) searchParams.set('limit', String(params.limit));
  if (params?.offset != null) searchParams.set('offset', String(params.offset));
  const q = searchParams.toString();
  return api.get<AuditLogResponse>(`/api/admin/audit-logs${q ? `?${q}` : ''}`);
}

export async function getAuditAdmins(): Promise<AuditAdmin[]> {
  return api.get<AuditAdmin[]>('/api/admin/audit-admins');
}

export interface SendEmailPayload {
  to: number | 'all';
  subject: string;
  message: string;
}

export interface SendEmailResponse {
  success: boolean;
  sent: number;
  total: number;
  message: string;
}

export async function sendAdminEmail(payload: SendEmailPayload): Promise<SendEmailResponse> {
  return api.post<SendEmailResponse>('/api/admin/emails/send', payload);
}

export interface AdminCertificateEligibleItem {
  registration_id: number;
  user_id: number;
  statut: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  nom: string;
  prenom: string;
  email: string;
  has_certificate: boolean;
  certificate_id: number | null;
  certificate_file_url: string | null;
  certificate_created_at: string | null;
  eligible: boolean;
}

export interface AdminCertificateEligibleResponse {
  event: Pick<ApiEvent, 'id' | 'titre' | 'date' | 'lieu'>;
  items: AdminCertificateEligibleItem[];
}

export interface AdminCertificateSendOneResponse {
  sent: boolean;
  already_exists: boolean;
  certificate: unknown | null;
}

export interface AdminCertificateSendBatchResponse {
  attempted: number;
  sent: number;
  failed: Array<{
    registration_id: number;
    user_id: number;
    email: string;
    error: string;
  }>;
}

export async function getAdminCertificateEligibleByEvent(
  eventId: number
): Promise<AdminCertificateEligibleResponse> {
  return api.get<AdminCertificateEligibleResponse>(`/api/admin/certificates/events/${eventId}/eligible`);
}

export async function sendAdminCertificateForRegistration(
  eventId: number,
  registrationId: number
): Promise<AdminCertificateSendOneResponse> {
  return api.post<AdminCertificateSendOneResponse>(
    `/api/admin/certificates/events/${eventId}/send/${registrationId}`
  );
}

export async function sendAdminCertificatesBatch(
  eventId: number
): Promise<AdminCertificateSendBatchResponse> {
  return api.post<AdminCertificateSendBatchResponse>(`/api/admin/certificates/events/${eventId}/send-batch`);
}
