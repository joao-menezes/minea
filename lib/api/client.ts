const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
const API_URL = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/$/, '')
  : `${configuredApiUrl.replace(/\/$/, '')}/api`;

// O token de acesso e o refresh token vivem em cookies httpOnly setados pela API;
// o front nunca os lê nem os guarda. Isso só cacheia o perfil pra UI renderizar rápido.
const SESSION_KEY = 'minea_user';

// Endpoints cujo 401 significa "credencial errada", não "sessão expirou" — não deve
// disparar uma tentativa de refresh (evitaria um loop ou um refresh sem sentido).
const AUTH_ENDPOINTS_WITHOUT_REFRESH = ['/auth/signin', '/auth/signup', '/auth/refresh', '/auth/logout'];

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

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

async function doFetch(endpoint: string, options: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let response = await doFetch(endpoint, options);

  if (response.status === 401 && !AUTH_ENDPOINTS_WITHOUT_REFRESH.includes(endpoint)) {
    const refreshed = await refreshSession();

    if (refreshed) {
      response = await doFetch(endpoint, options);
    }
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiError | null;

    if (response.status === 401 && typeof window !== 'undefined') {
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
