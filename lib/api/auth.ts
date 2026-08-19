import { SignInData, SignUpData, User } from '@/types';

import { apiFetch } from './client';

const SESSION_KEY = 'tua_agenda_user';

export async function signIn({ cpf, password }: SignInData): Promise<User> {
  const data = await apiFetch<{ user: User }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      cpf,
      password,
    }),
  });

  localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

  return data.user;
}

export async function signUp({ cpf, name, password }: SignUpData): Promise<User> {
  const data = await apiFetch<{ user: User }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      cpf,
      name,
      password,
    }),
  });

  localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

  return data.user;
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = localStorage.getItem(SESSION_KEY);

  if (!value) {
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
}
