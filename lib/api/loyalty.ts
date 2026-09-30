import type { LoyaltyStatus } from '@/types';

import { apiFetch } from './client';

export async function getMyLoyaltyStatus(): Promise<LoyaltyStatus> {
  return apiFetch<LoyaltyStatus>('/loyalty/me');
}

export async function getUserLoyaltyStatus(userId: string): Promise<LoyaltyStatus> {
  return apiFetch<LoyaltyStatus>(`/loyalty/users/${userId}`);
}

export async function generateLoyaltyQr(
  appointmentId: string,
): Promise<{ token: string; expiresInSeconds: number }> {
  return apiFetch<{ token: string; expiresInSeconds: number }>(
    `/loyalty/appointments/${appointmentId}/qr`,
    { method: 'POST' },
  );
}

export async function redeemLoyaltyToken(token: string): Promise<LoyaltyStatus> {
  return apiFetch<LoyaltyStatus>('/loyalty/redeem', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function redeemLoyaltyReward(userId: string): Promise<LoyaltyStatus> {
  return apiFetch<LoyaltyStatus>(`/loyalty/users/${userId}/redeem-reward`, {
    method: 'POST',
  });
}
