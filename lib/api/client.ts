const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

type ApiError = {
  message?: string;
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiError | null;

    throw new Error(error?.message ?? 'Erro ao realizar requisição.');
  }

  return data as T;
}
