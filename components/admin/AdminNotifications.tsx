'use client';

import { useEffect, useRef, useState } from 'react';

import { Bell, CalendarDays, Check, ChevronRight, Clock3, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NotificationType = 'appointment' | 'reminder' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Novo agendamento',
    description: 'Mariana agendou Limpeza de Pele.',
    time: 'há 5 min',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Atendimento próximo',
    description: 'Seu próximo atendimento começa às 14:30.',
    time: 'há 18 min',
    read: false,
  },
  {
    id: '3',
    type: 'appointment',
    title: 'Agendamento confirmado',
    description: 'Ana confirmou o procedimento de hoje.',
    time: 'há 1h',
    read: true,
  },
];

const NOTIFICATION_ICONS: Record<NotificationType, typeof CalendarDays> = {
  appointment: CalendarDays,
  reminder: Clock3,
  system: Bell,
};

export function AdminNotifications() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          'relative flex h-10 w-10 items-center justify-center rounded-xl',
          'text-[#806f68] transition-all duration-200',
          open ? 'bg-[#f5efec] text-[#493a35]' : 'hover:bg-[#f5efec]',
        ].join(' ')}
      >
        <Bell size={17} strokeWidth={open ? 2 : 1.7} />

        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a86f64] opacity-40" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#a86f64]" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] overflow-hidden rounded-[22px] border border-[#e9e1dc] bg-white/95 shadow-[0_24px_60px_-25px_rgba(73,58,53,.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-[#f0e8e4] px-4 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[12px] font-bold text-[#493a35]">Notificações</h3>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#f3e8e3] px-1.5 py-0.5 text-[8px] font-bold text-[#9a7669]">
                    {unreadCount} novas
                  </span>
                )}
              </div>

              <p className="mt-1 text-[9px] text-[#b09a91]">
                Acompanhe as novidades da sua clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#b09a91] transition hover:bg-[#f7f1ee] hover:text-[#806f68]"
              aria-label="Fechar notificações"
            >
              <X size={14} />
            </button>
          </div>

          {unreadCount > 0 && (
            <div className="flex justify-end border-b border-[#f5eeea] px-4 py-2">
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-[8px] font-bold text-[#9a7669] transition hover:text-[#6b5147]"
              >
                <Check size={11} />
                Marcar todas como lidas
              </button>
            </div>
          )}

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <EmptyNotifications />
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-1.5 border-t border-[#f0e8e4] bg-[#fcfaf9] text-[9px] font-bold text-[#80685e] transition hover:bg-[#f7f0ed]"
            onClick={() => router.push('/admin/notifications')}
          >
            Ver todas as notificações
            <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  const Icon = NOTIFICATION_ICONS[notification.type];

  return (
    <button
      type="button"
      onClick={onRead}
      className={[
        'group flex w-full gap-3 px-4 py-3.5 text-left',
        'border-b border-[#f5eeea]',
        'transition-colors hover:bg-[#fcf8f6]',
        !notification.read ? 'bg-[#fdf9f7]' : 'bg-white',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]',
          notification.read ? 'bg-[#f6efeb] text-[#b19a90]' : 'bg-[#f2e5df] text-[#967569]',
        ].join(' ')}
      >
        <Icon size={14} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[9px] font-bold text-[#6b5850]">{notification.title}</p>

          {!notification.read && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a86f64]" />
          )}
        </div>

        <p className="mt-1 text-[9px] leading-relaxed text-[#a48a7f]">{notification.description}</p>

        <p className="mt-1.5 text-[8px] font-medium text-[#c0aaa0]">{notification.time}</p>
      </div>
    </button>
  );
}

function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#b49b90]">
        <Bell size={17} strokeWidth={1.6} />
      </div>

      <p className="mt-3 text-[10px] font-bold text-[#80685e]">Tudo tranquilo por aqui</p>

      <p className="mt-1 max-w-[220px] text-[8px] leading-relaxed text-[#b49b90]">
        Você não possui novas notificações no momento.
      </p>
    </div>
  );
}
