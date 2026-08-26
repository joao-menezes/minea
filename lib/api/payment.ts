import type { PixPayment } from '@/types';

import { apiFetch } from './client';

export function createPixPayment(appointmentId: string): Promise<PixPayment> {
  return apiFetch<PixPayment>('/payment/pix', {
    method: 'POST',
    body: JSON.stringify({ appointmentId }),
  });
}

export function getPayment(id: string): Promise<PixPayment> {
  return apiFetch<PixPayment>(`/payment/${id}`);
}
