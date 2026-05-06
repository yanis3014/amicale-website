import { api, buildAuthenticatedFetchHeaders, getBaseUrl, ApiError } from './client';
import type { ApiActivity } from './types';

export type ActivityCategory = ApiActivity['category'];

export interface ActivitiesQuery {
  category?: ActivityCategory;
  search?: string;
  all?: boolean; // admin: inclure non publiées
}

export async function getActivities(params?: ActivitiesQuery): Promise<ApiActivity[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.search) search.set('search', params.search);
  if (params?.all === true) search.set('all', 'true');
  const q = search.toString();
  return api.get<ApiActivity[]>(`/api/activities${q ? `?${q}` : ''}`);
}

export async function getActivity(
  id: number | string,
  options?: { admin?: boolean }
): Promise<ApiActivity> {
  const search = options?.admin ? '?admin=true' : '';
  return api.get<ApiActivity>(`/api/activities/${id}${search}`);
}

export async function createActivity(data: {
  title: string;
  summary?: string;
  content?: string;
  category: ActivityCategory;
}): Promise<ApiActivity> {
  return api.post<ApiActivity>('/api/activities', data);
}

export async function updateActivity(
  id: number | string,
  data: Partial<{ title: string; summary: string; content: string; category: ActivityCategory }>
): Promise<ApiActivity> {
  return api.put<ApiActivity>(`/api/activities/${id}`, data);
}

export async function deleteActivity(id: number | string): Promise<void> {
  await api.delete(`/api/activities/${id}`);
}

export async function publishActivity(id: number | string): Promise<ApiActivity> {
  return api.patch<ApiActivity>(`/api/activities/${id}/publish`, {});
}

export async function uploadActivityImage(
  id: number | string,
  file: File
): Promise<ApiActivity> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${getBaseUrl()}/api/activities/${id}/upload-image`, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error || res.statusText, res.status, data);
  return data;
}

export async function uploadActivityGallery(
  id: number | string,
  files: File[]
): Promise<ApiActivity> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const res = await fetch(`${getBaseUrl()}/api/activities/${id}/upload-gallery`, {
    method: 'POST',
    headers: buildAuthenticatedFetchHeaders(),
    body: formData,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error || res.statusText, res.status, data);
  return data;
}

export async function deleteActivityGalleryImage(
  id: number | string,
  index: number
): Promise<ApiActivity> {
  return api.delete<ApiActivity>(`/api/activities/${id}/gallery/${index}`);
}
