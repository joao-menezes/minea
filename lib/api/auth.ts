import { SignInData, SignUpData, User } from '@/types';

import { apiFetch } from './client';
import { TOKEN_KEY } from './client';

const SESSION_KEY = 'minea_user';

export async function signIn({ cpf, password }: SignInData): Promise<User> {
  const data = await apiFetch<{
    token?: string;
    user?: {
      token?: string;
    };
  }>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      cpf,
      password,
    }),
  });

  const token = data.token ?? data.user?.token;

  if (!token) {
    throw new Error('O servidor não retornou um token de autenticação.');
  }

  localStorage.setItem(TOKEN_KEY, token);

  const user = await apiFetch<{ user: User }>(`/auth/me/${getTokenSubject(token)}`);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user.user));
  return user.user;
}

export async function signUp({ cpf, name, birthDate, password }: SignUpData): Promise<User> {
  await apiFetch<{ user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      cpf,
      name,
      birthDate,
      password,
    }),
  });

  return signIn({ cpf, password });
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = localStorage.getItem(SESSION_KEY);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!value || !token) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

function getTokenSubject(token: string): string {
  const payload = token.split('.')[1];

  if (!payload) {
    throw new Error('Token de autenticação inválido.');
  }

  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
      id?: string;
    };

    if (!decoded.id) {
      throw new Error('Token de autenticação inválido.');
    }

    return decoded.id;
  } catch {
    throw new Error('Token de autenticação inválido.');
  }
}
