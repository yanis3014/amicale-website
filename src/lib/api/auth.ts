import { api, setToken } from './client';
import type { ApiUser, AuthResponse, LoginPayload, RegisterPayload } from './types';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/login', payload);
  if (res.token) setToken(res.token);
  return res;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/register', payload);
  if (res.token) setToken(res.token);
  return res;
}

export async function getMe(): Promise<ApiUser> {
  return api.get<ApiUser>('/api/auth/me');
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return api.post('/api/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

export function logout(): void {
  setToken(null);
}
