'use client';

import { useEffect, useState } from 'react';

import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

import { enablePushNotifications } from '@/lib/push-notifications';

export function PushNotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    'unsupported',
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (permission === 'granted') {
      void enablePushNotifications().catch((error) => {
        console.error('Erro ao sincronizar token de push:', error);
      });
    }
  }, [permission]);

  async function enable() {
    setLoading(true);
    try {
      const result = await enablePushNotifications();
      setPermission('Notification' in window ? Notification.permission : 'unsupported');

      if (result === 'enabled') {
        toast.success('Notificações ativadas.');
      } else if (result === 'denied') {
        toast.error('Permita as notificações nas configurações do navegador.');
      } else {
        toast.error('Não foi possível ativar notificações neste dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao ativar push:', error);
      toast.error('Não foi possível ativar notificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (permission === 'granted') {
    return <Bell size={16} strokeWidth={1.7} aria-label="Notificações ativadas" />;
  }

  return (
    <button
      type="button"
      onClick={() => void enable()}
      disabled={loading || permission === 'denied'}
      aria-label="Ativar notificações"
      title={
        permission === 'denied'
          ? 'Permita as notificações nas configurações do navegador'
          : 'Ativar notificações'
      }
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#f0e6de] bg-white/80 text-[#a68b7f] shadow-[0_10px_30px_-18px_rgba(66,48,42,.25)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <BellOff size={16} strokeWidth={1.7} className="transition-transform group-hover:scale-105" />
    </button>
  );
}
