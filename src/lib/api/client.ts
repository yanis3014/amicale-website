const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let token: string | null = null;

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || token;
  }
  return token;
}

export function setToken(newToken: string | null): void {
  token = newToken ?? null;
  if (typeof window !== 'undefined') {
    if (newToken) localStorage.setItem('auth_token', newToken);
    else localStorage.removeItem('auth_token');
  }
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
  options: RequestInit & { body?: unknown } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const url = `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((rest.headers as Record<string, string>) || {}),
  };
  const t = getToken();
  if (t) (headers as Record<string, string>)['Authorization'] = `Bearer ${t}`;

  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
