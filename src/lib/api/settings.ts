import { api, buildAuthenticatedFetchHeaders } from './client';
import type { ApiAdministrativeDocument } from './types';

export async function getPageSetting(key: string): Promise<{ key: string; value: string | null }> {
  return api.get<{ key: string; value: string | null }>(`/api/settings/${key}`);
}

export async function setPageSetting(key: string, value: string): Promise<{ key: string; value: string }> {
  return api.put<{ key: string; value: string }>(`/api/admin/settings/${key}`, { value });
}

export async function uploadEnseignantsHeaderImage(file: File): Promise<{ key: string; value: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/admin/pages/enseignants/header`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}

const A_PROPOS_PAGE_KEYS = [
  'mot_du_president',
  'presentation',
  'historique',
  'missions_visions',
  'valeurs',
  'documents',
] as const;

export type AProposPageKey = (typeof A_PROPOS_PAGE_KEYS)[number];

export function isAProposPageKey(key: string): key is AProposPageKey {
  return A_PROPOS_PAGE_KEYS.includes(key as AProposPageKey);
}

export async function uploadAProposPageImage(
  pageKey: AProposPageKey,
  file: File
): Promise<{ key: string; value: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/admin/pages/a-propos/${pageKey}/image`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}

export async function uploadHomeHeroImage(file: File): Promise<{ key: string; value: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/admin/pages/home/hero-image`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}

export async function uploadCertificateTemplatePdf(file: File): Promise<{ key: string; value: string }> {
  const formData = new FormData();
  formData.append('template', file);
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/admin/pages/certificates/template`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}

export async function uploadAdministrativeDocument(
  file: File,
  title: string
): Promise<ApiAdministrativeDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title.trim());
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${base.replace(/\/$/, '')}/api/admin/pages/documents/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || res.statusText || 'Upload échoué');
  }
  return res.json();
}

export async function getAdministrativeDocumentsAdmin(): Promise<ApiAdministrativeDocument[]> {
  return api.get<ApiAdministrativeDocument[]>('/api/admin/pages/documents');
}

export async function deleteAdministrativeDocumentAdmin(docId: string): Promise<void> {
  await api.delete(`/api/admin/pages/documents/${docId}`);
}

/** Clés des paramètres de la page d'accueil (lecture publique) */
export const HOME_SETTING_KEYS = [
  'home_banderole',
  'home_video_url',
  'home_hero_image',
  'home_hero_text',
  'home_hero_title',
  'home_members_count_text',
] as const;
