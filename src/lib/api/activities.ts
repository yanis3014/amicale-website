import { api } from './client';
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
