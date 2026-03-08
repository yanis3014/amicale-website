import { api, getToken, getBaseUrl, ApiError } from './client';
import type { ApiEvent, ApiRegistration } from './types';

export interface EventsQuery {
  categorie?: string;
  search?: string;
  upcoming?: boolean;
  past?: boolean;
}

export async function getEvents(params?: EventsQuery): Promise<ApiEvent[]> {
  const search = new URLSearchParams();
  if (params?.categorie) search.set('categorie', params.categorie);
  if (params?.search) search.set('search', params.search);
  if (params?.upcoming === true) search.set('upcoming', 'true');
  if (params?.past === true) search.set('past', 'true');
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

/** Upload image for an event (multipart/form-data). */
export async function uploadEventImage(
  eventId: number | string,
  file: File
): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const token = getToken();
  const url = `${getBaseUrl()}/api/events/${eventId}/upload-image`;
  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data?.error || res.statusText, res.status, data);
  }
  return data;
}

/** Upload gallery images for an event (past event = annonce). */
export async function uploadEventGallery(
  eventId: number | string,
  files: File[]
): Promise<{ gallery_images: string[] }> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const token = getToken();
  const url = `${getBaseUrl()}/api/events/${eventId}/upload-gallery`;
  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data?.error || res.statusText, res.status, data);
  }
  return data;
}

/** Delete one image from event gallery by index. */
export async function deleteEventGalleryImage(
  eventId: number | string,
  index: number
): Promise<{ gallery_images: string[] }> {
  return api.delete<{ gallery_images: string[] }>(`/api/events/${eventId}/gallery/${index}`);
}
