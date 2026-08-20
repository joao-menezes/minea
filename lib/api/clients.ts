import { Client, User } from '@/types';

import { apiFetch } from './client';

export async function getClients(): Promise<Client[]> {
  return apiFetch<Client[]>('/users');
}

export async function getClient(id: string): Promise<Client> {
  return apiFetch<Client>(`/users/${id}`);
}

export async function updateClient(id: string, data: Partial<Omit<Client, 'id'>>): Promise<Client> {
  return apiFetch<Client>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id: string): Promise<void> {
  await apiFetch<void>(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function updateUserStatus(id: string, isActive: boolean) {
  return apiFetch<User>(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      isActive,
    }),
  });
}
