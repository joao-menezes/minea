import type { BusinessHour } from '@/types';

import { apiFetch } from './client';

export async function getBusinessHours(): Promise<BusinessHour[]> {
  return apiFetch<BusinessHour[]>('/business-hours');
}

export async function updateBusinessHours(hours: BusinessHour[]): Promise<BusinessHour[]> {
  return apiFetch<BusinessHour[]>('/business-hours', {
    method: 'PUT',
    body: JSON.stringify(hours),
  });
}
