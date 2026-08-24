import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types';

import { apiFetch } from './client';

export async function getAppointments(userId: string): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/appointments?userId=${encodeURIComponent(userId)}`);
}

export async function getAppointment(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`);
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

export async function deleteAppointment(id: string): Promise<void> {
  await apiFetch<void>(`/appointments/${id}`, {
    method: 'DELETE',
  });
}
