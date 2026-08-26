const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const TOKEN_KEY = 'minea_access_token';

type ApiError = {
  message?: string;
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiError | null;

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
    }

    throw new Error(error?.message ?? 'Erro ao realizar requisição.');
  }

  return data as T;
}

const SESSION_KEY = 'minea_user';
