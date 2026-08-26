import { CreateServiceData, Service, UpdateServiceData } from '@/types';

import { apiFetch } from './client';

export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services');
}

export async function getActiveServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services?active=true');
}

export async function getService(id: string): Promise<Service> {
  return apiFetch<Service>(`/services/${id}`);
}

export async function createService(
  data: Omit<CreateServiceData, 'id' | 'active'>,
): Promise<Service> {
  return apiFetch<Service>('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateService(id: string, data: UpdateServiceData): Promise<Service> {
  return apiFetch<Service>(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch<void>(`/services/${id}`, {
    method: 'DELETE',
  });
}
