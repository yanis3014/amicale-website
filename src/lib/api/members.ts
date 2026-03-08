import { api } from './client';
import type { ApiUser, ApiRegistration } from './types';

export async function getMyProfile(): Promise<ApiUser> {
  return api.get<ApiUser>('/api/members/me/profile');
}

export async function getMyEvents(): Promise<ApiRegistration[]> {
  return api.get<ApiRegistration[]>('/api/members/me/events');
}

// Admin
export interface AdminMembersQuery {
  search?: string;
  is_adherent?: boolean;
}

export interface CreateMemberPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  annee?: number;
  telephone?: string;
}

export async function createMember(data: CreateMemberPayload): Promise<ApiUser> {
  return api.post<ApiUser>('/api/admin/members', data);
}

export async function getAllMembers(params?: AdminMembersQuery): Promise<ApiUser[]> {
  const search = new URLSearchParams();
  if (params?.search) search.set('search', params.search);
  if (params?.is_adherent === true) search.set('is_adherent', 'true');
  if (params?.is_adherent === false) search.set('is_adherent', 'false');
  const q = search.toString();
  return api.get<ApiUser[]>(`/api/admin/members${q ? `?${q}` : ''}`);
}

export async function getMemberById(id: number | string): Promise<ApiUser> {
  return api.get<ApiUser>(`/api/admin/members/${id}`);
}

export async function updateMember(
  id: number | string,
  data: Partial<Pick<ApiUser, 'nom' | 'prenom' | 'email' | 'annee' | 'telephone' | 'is_adherent' | 'adherent_expires_at'>>
): Promise<ApiUser> {
  return api.put<ApiUser>(`/api/admin/members/${id}`, data);
}

export async function deleteMember(id: number | string): Promise<void> {
  await api.delete(`/api/admin/members/${id}`);
}
