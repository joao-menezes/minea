import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types';

import { apiFetch } from './client';

export async function getAppointments(): Promise<Appointment[]> {
  return apiFetch<Appointment[]>('/api/appointments');
}

export async function getAppointment(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/api/appointments/${id}`);
}

export async function createAppointment(data: CreateAppointmentData): Promise<Appointment> {
  return apiFetch<Appointment>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData,
): Promise<Appointment> {
  return apiFetch<Appointment>(`/api/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiFetch<void>(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
}
