import { SignInData, SignUpData, User } from '@/types';

import { ApiRequestError, apiFetch } from './client';
import { TOKEN_KEY } from './client';
import { unregisterPushNotifications } from '@/lib/push-notifications';

const SESSION_KEY = 'minea_user';

export async function signIn({ cpf, password }: SignInData): Promise<User> {
  let data: {
    token?: string;
    user?: {
      token?: string;
    };
  };

  try {
    data = await apiFetch<{
      token?: string;
      user?: {
        token?: string;
      };
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        cpf: cpf.replace(/\D/g, ''),
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

  const token = data.token ?? data.user?.token;

  if (!token) {
    throw new Error('O servidor não retornou um token de autenticação.');
  }

  localStorage.setItem(TOKEN_KEY, token);

  const user = await apiFetch<{ user: User }>(`/auth/me/${getTokenSubject(token)}`);

  if (user.user.isActive === false) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    throw new Error('Sua conta está desativada. Entre em contato com a clínica.');
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user.user));
  return user.user;
}

export async function signUp({ cpf, name, birthDate, password }: SignUpData): Promise<User> {
  await apiFetch<{ user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      cpf: cpf.replace(/\D/g, ''),
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
