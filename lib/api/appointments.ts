import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types';

import { apiFetch } from './client';

export async function getAppointments(_userId?: string, page = 1, limit = 50): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/appointments?page=${page}&limit=${limit}`);
}

export async function getAllAppointment(page = 1, limit = 100): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/appointments?page=${page}&limit=${limit}`);
}

export async function createAppointment(data: CreateAppointmentData): Promise<Appointment> {
  return apiFetch<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData,
): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id: string, _userId?: string): Promise<void> {
  await apiFetch<void>(`/appointments/${id}`, { method: 'DELETE' });
}
