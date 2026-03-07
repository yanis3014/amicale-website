import { api } from './client';
import type { ApiEvent, ApiRegistration } from './types';

export interface EventsQuery {
  categorie?: string;
  search?: string;
  upcoming?: boolean;
}

export async function getEvents(params?: EventsQuery): Promise<ApiEvent[]> {
  const search = new URLSearchParams();
  if (params?.categorie) search.set('categorie', params.categorie);
  if (params?.search) search.set('search', params.search);
  if (params?.upcoming === true) search.set('upcoming', 'true');
  const q = search.toString();
  return api.get<ApiEvent[]>(`/api/events${q ? `?${q}` : ''}`);
}

export async function getEvent(id: number | string): Promise<ApiEvent> {
  return api.get<ApiEvent>(`/api/events/${id}`);
}

export async function createEvent(
  data: Partial<ApiEvent> & {
    titre: string;
    date: string;
  }
): Promise<ApiEvent> {
  return api.post<ApiEvent>('/api/events', data);
}

export async function updateEvent(
  id: number | string,
  data: Partial<ApiEvent>
): Promise<ApiEvent> {
  return api.put<ApiEvent>(`/api/events/${id}`, data);
}

export async function deleteEvent(id: number | string): Promise<void> {
  await api.delete(`/api/events/${id}`);
}

export async function publishEvent(id: number | string): Promise<ApiEvent> {
  return api.patch<ApiEvent>(`/api/events/${id}/publish`, {});
}

export async function getRegistrations(eventId: number | string): Promise<ApiRegistration[]> {
  return api.get<ApiRegistration[]>(`/api/events/${eventId}/registrations`);
}

export async function registerToEvent(
  eventId: number | string
): Promise<ApiRegistration> {
  return api.post<ApiRegistration>(`/api/events/${eventId}/register`, {});
}

export async function confirmRegistration(
  eventId: number | string,
  regId: number | string
): Promise<ApiRegistration> {
  return api.patch<ApiRegistration>(
    `/api/events/${eventId}/registrations/${regId}/confirm`,
    {}
  );
}

export async function cancelRegistration(
  eventId: number | string,
  regId: number | string
): Promise<ApiRegistration> {
  return api.patch<ApiRegistration>(
    `/api/events/${eventId}/registrations/${regId}/cancel`,
    {}
  );
}
