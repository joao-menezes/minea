const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
const API_URL = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/$/, '')
  : `${configuredApiUrl.replace(/\/$/, '')}/api`;

export const TOKEN_KEY = 'minea_access_token';
const SESSION_KEY = 'minea_user';

type ApiError = {
  message?: string;
  error?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

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
      window.dispatchEvent(new CustomEvent('minea:unauthorized'));
    }

    const messages: Record<number, string> = {
      400: 'Confira os dados informados.',
      401: 'Sua sessão expirou. Entre novamente.',
      403: 'Você não tem permissão para realizar esta ação.',
      404: 'Registro não encontrado.',
      409: 'Esta operação entra em conflito com um registro existente.',
      413: 'A requisição é muito grande.',
      429: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
      503: 'O serviço está temporariamente indisponível. Tente novamente em instantes.',
    };

    throw new ApiRequestError(
      error?.message ?? error?.error ?? messages[response.status] ?? 'Erro ao realizar requisição.',
      response.status,
    );
  }

  return data as T;
}
