import { api } from './client';
import type { ApiUser, ApiRegistration } from './types';

export async function getMyProfile(): Promise<ApiUser> {
  return api.get<ApiUser>('/api/members/me/profile');
}

export async function getMyEvents(): Promise<ApiRegistration[]> {
  return api.get<ApiRegistration[]>('/api/members/me/events');
}
