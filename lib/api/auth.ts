import { unregisterPushNotifications } from '@/lib/push-notifications';
import { SignInData, SignUpData, User } from '@/types';
import { repairMojibake } from '@/utils/utils';

import { ApiRequestError, apiFetch } from './client';

// Cache só pra UI renderizar rápido/otimista; a sessão de verdade vive em cookies
// httpOnly que o front nunca lê. A fonte da verdade é sempre `/auth/me`.
const SESSION_KEY = 'minea_user';

export async function signIn({ phoneNumber, password }: SignInData): Promise<User> {
  let data: { user?: User };

  try {
    data = await apiFetch<{ user?: User }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        password,
      }),
    });
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 403 || /desativ|inativ|disabled|inactive/i.test(error.message))
    ) {
      throw new Error('Sua conta está desativada. Entre em contato com a clínica.');
    }

    throw error;
  }

  if (!data.user) {
    throw new Error('O servidor não retornou os dados do usuário.');
  }

  const user: User = { ...data.user, name: repairMojibake(data.user.name) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function signUp({ phoneNumber, name, birthDate, password }: SignUpData): Promise<User> {
  await apiFetch<{ user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      name,
      birthDate: birthDate ? toApiDate(birthDate) : undefined,
      password,
    }),
  });

  return signIn({ phoneNumber, password });
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { user } = await apiFetch<{ user: User }>('/auth/me');
    const normalized: User = { ...user, name: repairMojibake(user.name) };

    localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Falha de rede: cai pro último perfil conhecido em vez de deslogar à toa.
    const cached = localStorage.getItem(SESSION_KEY);

    if (!cached) {
      return null;
    }

    try {
      return JSON.parse(cached) as User;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}

export async function signOut(): Promise<void> {
  try {
    await unregisterPushNotifications();
  } catch (error) {
    console.warn('Não foi possível remover o token de notificações:', error);
  }

  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.warn('Não foi possível encerrar a sessão no servidor:', error);
  } finally {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function updateUserProfile(
  id: string,
  data: Pick<User, 'name' | 'birthDate'>,
): Promise<User> {
  const response = await apiFetch<User | { user: User }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  const updatedUser = 'user' in response ? response.user : response;
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export async function changeUserPassword(
  id: string,
  data: { currentPassword: string; newPassword: string },
): Promise<void> {
  await apiFetch<void>(`/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

function toApiDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}
