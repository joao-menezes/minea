'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

import { apiFetch } from '@/lib/api/client';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  );
}

async function getMessagingClient(): Promise<{ messaging: Messaging; registration: ServiceWorkerRegistration } | null> {
  if (typeof window === 'undefined' || !isConfigured() || !(await isSupported())) {
    return null;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const registration = await navigator.serviceWorker.register('/sw.js');

  return { messaging: getMessaging(app), registration };
}

export async function enablePushNotifications(): Promise<'enabled' | 'unsupported' | 'denied'> {
  const client = await getMessagingClient();
  if (!client || !('Notification' in window)) {
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return 'denied';
  }

  const token = await getToken(client.messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: client.registration,
  });

  if (!token) {
    return 'unsupported';
  }

  await apiFetch<void>('/users/me/push-tokens', {
    method: 'POST',
    body: JSON.stringify({ token, platform: 'web' }),
  });

  return 'enabled';
}

export async function unregisterPushNotifications(): Promise<void> {
  const client = await getMessagingClient();
  if (!client) {
    return;
  }

  const token = await getToken(client.messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: client.registration,
  });

  if (token) {
    await apiFetch<void>('/users/me/push-tokens', {
      method: 'DELETE',
      body: JSON.stringify({ token }),
    });
  }

  await deleteToken(client.messaging);
}
