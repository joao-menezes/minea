import { unregisterPushNotifications } from '@/lib/push-notifications';
import { SignInData, SignUpData, User } from '@/types';
import { repairMojibake } from '@/utils/utils';

import { ApiRequestError, apiFetch } from './client';
import { TOKEN_KEY } from './client';

const SESSION_KEY = 'minea_user';

export async function signIn({ phoneNumber, password }: SignInData): Promise<User> {
  let data: { token?: string; user?: { message?: string; token?: string } };

  try {
    data = await apiFetch<{ token?: string; user?: { message?: string; token?: string } }>(
      '/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          password,
        }),
      },
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 403 || /desativ|inativ|disabled|inactive/i.test(error.message))
    ) {
      throw new Error('Sua conta está desativada. Entre em contato com a clínica.');
    }

    throw error;
  }

  const token = data.user?.token ?? data.token;

  if (!token) {
    throw new Error('O servidor não retornou um token de autenticação.');
  }

  localStorage.setItem(TOKEN_KEY, token);

  const user = decodeUserFromToken(token);
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

  const value = localStorage.getItem(SESSION_KEY);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!value || !token) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  try {
    const user = JSON.parse(value) as User;
    user.name = repairMojibake(user.name);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await unregisterPushNotifications();
  } catch (error) {
    console.warn('Não foi possível remover o token de notificações:', error);
  } finally {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
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

function decodeUserFromToken(token: string): User {
  const payload = token.split('.')[1];

  if (!payload) {
    throw new Error('Token de autenticação inválido.');
  }

  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
      id?: string;
      sub?: string;
      userId?: string;
      name?: string;
      phoneNumber?: string | null;
      birthDate?: string | null;
      isAdmin?: boolean;
      role?: string;
    };

    const id = decoded.id ?? decoded.userId ?? decoded.sub;

    if (!id) {
      throw new Error('Token de autenticação inválido.');
    }

    return {
      id,
      name: repairMojibake(decoded.name ?? ''),
      phoneNumber: decoded.phoneNumber ?? null,
      birthDate: decoded.birthDate,
      isAdmin: decoded.isAdmin ?? decoded.role === 'admin',
    };
  } catch {
    throw new Error('Token de autenticação inválido.');
  }
}

function toApiDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}
