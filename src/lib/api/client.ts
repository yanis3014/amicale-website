const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let token: string | null = null;

/** Getter injecté par AuthProvider pour garantir le token côté client (évite les 401 avec chunks Next.js). */
let tokenGetter: (() => string | null) | null = null;

export function setTokenGetter(getter: (() => string | null) | null): void {
  tokenGetter = getter;
}

export function getToken(): string | null {
  if (tokenGetter) {
    const fromGetter = tokenGetter();
    if (fromGetter) return fromGetter;
  }
  return token;
}

export function setToken(newToken: string | null): void {
  token = newToken ?? null;
}

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const chunk = document.cookie
    .split('; ')
    .find((part) => part.startsWith('csrf_token='));
  if (!chunk) return null;
  return decodeURIComponent(chunk.slice('csrf_token='.length));
}

function isUnsafeMethod(method?: string): boolean {
  if (!method) return false;
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

function clearInMemoryJwt() {
  token = null;
}

/**
 * Headers pour requetes authentifiees hors `api.post`/`get` (ex. FormData multipart).
 * Envoie le Bearer si disponible et le jeton CSRF si le cookie existe (sessions cookie).
 */
export function buildAuthenticatedFetchHeaders(
  extra?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = { ...(extra || {}) };
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  const csrfToken = getCsrfToken();
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  return headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: { error?: string; errors?: Array<{ msg: string }> }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const url = `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((rest.headers as Record<string, string>) || {}),
  };
  const t = getToken();
  if (t) (headers as Record<string, string>)['Authorization'] = `Bearer ${t}`;
  if (isUnsafeMethod(rest.method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) (headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? (JSON.stringify(body) as BodyInit) : undefined,
    credentials: 'include',
  });

  const data =
    res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.map((e: { msg: string }) => e.msg).join(', ') : null) ||
      res.statusText;
    throw new ApiError(msg || 'Erreur API', res.status, data);
  }
  if (path.includes('/auth/logout')) {
    clearInMemoryJwt();
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export function getBaseUrl(): string {
  return BASE_URL.replace(/\/$/, '');
}
