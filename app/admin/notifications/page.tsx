'use client';

import { useMemo, useState } from 'react';

import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  Filter,
  Mail,
  MessageCircle,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';

import { AdminShell } from '@/components/admin/AdminShell';

type NotificationType = 'appointment' | 'reminder' | 'message' | 'system' | 'client';

type NotificationPeriod = 'Hoje' | 'Ontem' | 'Mais antigas';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  date: string;
  period: NotificationPeriod;
  read: boolean;
  client?: string;
  service?: string;
  action?: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Novo agendamento',
    description: 'Mariana Oliveira agendou uma Limpeza de Pele.',
    time: '14:24',
    date: 'Hoje',
    period: 'Hoje',
    read: false,
    client: 'Mariana Oliveira',
    service: 'Limpeza de Pele',
    action: 'Ver agendamento',
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Atendimento próximo',
    description: 'Seu próximo atendimento começa às 14:30.',
    time: '13:42',
    date: 'Hoje',
    period: 'Hoje',
    read: false,
    client: 'Ana Clara',
    service: 'Design de Sobrancelhas',
    action: 'Abrir agenda',
  },
  {
    id: '3',
    type: 'message',
    title: 'Nova mensagem',
    description: 'Ana Clara enviou uma mensagem pelo WhatsApp.',
    time: '12:18',
    date: 'Hoje',
    period: 'Hoje',
    read: false,
    client: 'Ana Clara',
    action: 'Ver conversa',
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Agendamento confirmado',
    description: 'Camila confirmou o procedimento de hoje.',
    time: '10:35',
    date: 'Hoje',
    period: 'Hoje',
    read: true,
    client: 'Camila Santos',
    service: 'Massagem Relaxante',
    action: 'Ver agendamento',
  },
  {
    id: '5',
    type: 'client',
    title: 'Novo cliente cadastrado',
    description: 'Beatriz Almeida criou uma conta na sua clínica.',
    time: '09:12',
    date: 'Hoje',
    period: 'Hoje',
    read: true,
    client: 'Beatriz Almeida',
    action: 'Ver cliente',
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Lembrete enviado',
    description: 'O lembrete do atendimento de Júlia foi enviado com sucesso.',
    time: '18:40',
    date: 'Ontem',
    period: 'Ontem',
    read: true,
    client: 'Júlia Martins',
    service: 'Limpeza de Pele',
  },
  {
    id: '7',
    type: 'appointment',
    title: 'Agendamento cancelado',
    description: 'Fernanda cancelou o horário das 16:00.',
    time: '16:21',
    date: 'Ontem',
    period: 'Ontem',
    read: true,
    client: 'Fernanda Costa',
    service: 'Peeling Facial',
    action: 'Ver agenda',
  },
  {
    id: '8',
    type: 'system',
    title: 'Configurações atualizadas',
    description: 'As preferências de notificações foram atualizadas.',
    time: '11:05',
    date: '12 Ago',
    period: 'Mais antigas',
    read: true,
    action: 'Ver configurações',
  },
  {
    id: '9',
    type: 'system',
    title: 'Backup concluído',
    description: 'Os dados da clínica foram sincronizados com sucesso.',
    time: '08:30',
    date: '10 Ago',
    period: 'Mais antigas',
    read: true,
  },
];

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'Não lidas' },
  { id: 'appointment', label: 'Agendamentos' },
  { id: 'reminder', label: 'Lembretes' },
  { id: 'system', label: 'Sistema' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'unread'
            ? !notification.read
            : notification.type === activeFilter;

      if (!matchesFilter) return false;

      if (!normalizedSearch) return true;

      return [
        notification.title,
        notification.description,
        notification.client,
        notification.service,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch));
    });
  }, [notifications, activeFilter, search]);

  const groupedNotifications = useMemo(() => {
    return FILTER_PERIODS.map((period) => ({
      period,
      notifications: filteredNotifications.filter((notification) => notification.period === period),
    })).filter((group) => group.notifications.length > 0);
  }, [filteredNotifications]);

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

  function handleNotificationClick(notification: Notification) {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <NotificationsBackground />

        <div className="relative mx-auto max-w-[1200px] px-4 py-6 sm:px-5 lg:px-8 lg:py-9">
          <NotificationsHeader unreadCount={unreadCount} onMarkAllAsRead={markAllAsRead} />

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0">
              <NotificationToolbar
                search={search}
                onSearchChange={setSearch}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              <div className="mt-5 space-y-7">
                {groupedNotifications.length === 0 ? (
                  <EmptyState
                    search={search}
                    onClear={() => {
                      setSearch('');
                      setActiveFilter('all');
                    }}
                  />
                ) : (
                  groupedNotifications.map((group) => (
                    <NotificationGroup
                      key={group.period}
                      period={group.period}
                      notifications={group.notifications}
                      onSelect={handleNotificationClick}
                    />
                  ))
                )}
              </div>
            </div>

            <NotificationsSummary total={notifications.length} unread={unreadCount} />
          </div>
        </div>

        {selectedNotification && (
          <NotificationDetails
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
      </main>
    </AdminShell>
  );
}

const FILTER_PERIODS: NotificationPeriod[] = ['Hoje', 'Ontem', 'Mais antigas'];

function NotificationsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

      <div className="absolute -left-40 top-[45%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

      <div className="absolute bottom-0 right-[20%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
    </div>
  );
}

function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
}: {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}) {
  return (
    <header>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
              Minea
            </span>

            <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
              Central
            </span>
          </div>

          <h1 className="mt-3 font-display text-[34px] leading-none tracking-[-0.035em] text-[#6b5850] sm:text-[40px]">
            Notificações
          </h1>

          <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#a48a7f]">
            Acompanhe tudo o que acontece na sua clínica em um só lugar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-[14px] border border-[#eee3dd] bg-white/80 px-3">
            <Bell size={14} className="text-[#a88b80]" />

            <span className="text-[9px] font-bold text-[#80685e]">{unreadCount}</span>

            <span className="text-[9px] text-[#b49b90]">não lidas</span>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="flex h-10 items-center gap-2 rounded-[14px] border border-[#eee3dd] bg-white/80 px-3 text-[9px] font-bold text-[#80685e] transition hover:bg-[#f8f1ee]"
            >
              <CheckCheck size={13} />
              <span className="hidden sm:inline">Marcar todas como lidas</span>
              <span className="sm:hidden">Lidas</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function NotificationToolbar({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: FilterId;
  onFilterChange: (value: FilterId) => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_22px_50px_-34px_rgba(64,46,40,.22)] backdrop-blur">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b49b90]" />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar notificações..."
            className="h-10 w-full rounded-[13px] border border-[#eee4df] bg-[#fffdfc] pl-10 pr-4 text-[10px] font-medium text-[#80685e] outline-none transition placeholder:text-[#c5b4ac] focus:border-[#d5beb4] focus:ring-2 focus:ring-[#f4ebe7]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <Filter size={13} className="ml-1 shrink-0 text-[#b49b90]" />

          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={[
                  'shrink-0 rounded-[11px] px-3 py-2',
                  'text-[9px] font-bold',
                  'transition-all',
                  active
                    ? 'bg-[#493a35] text-white shadow-[0_8px_20px_-12px_rgba(54,39,34,.7)]'
                    : 'bg-[#f8f2ef] text-[#9c847a] hover:bg-[#f1e8e4] hover:text-[#6b5850]',
                ].join(' ')}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotificationGroup({
  period,
  notifications,
  onSelect,
}: {
  period: NotificationPeriod;
  notifications: Notification[];
  onSelect: (notification: Notification) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#b09a91]">{period}</p>

        <div className="h-px flex-1 bg-[#e9dfda]" />

        <span className="text-[8px] font-medium text-[#c2afa7]">{notifications.length}</span>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/85 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={() => onSelect(notification)}
          />
        ))}
      </div>
    </section>
  );
}

function NotificationCard({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const Icon = NOTIFICATION_ICONS[notification.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full gap-3 border-b border-[#f2eae6] p-4 text-left',
        'last:border-b-0',
        'transition-all hover:bg-[#fdf9f7]',
        !notification.read ? 'bg-[#fdf9f7]' : 'bg-white/70',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]',
          !notification.read ? 'bg-[#f1e3dd] text-[#967569]' : 'bg-[#f7efeb] text-[#b09a90]',
        ].join(' ')}
      >
        <Icon size={15} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {!notification.read && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a86f64]" />
              )}

              <p className="truncate text-[10px] font-bold text-[#6b5850]">{notification.title}</p>
            </div>

            <p className="mt-1.5 text-[9px] leading-relaxed text-[#a48a7f]">
              {notification.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {notification.client && (
                <span className="flex items-center gap-1 text-[8px] font-medium text-[#b09a91]">
                  <UserRound size={10} />
                  {notification.client}
                </span>
              )}

              {notification.service && (
                <span className="flex items-center gap-1 text-[8px] font-medium text-[#b09a91]">
                  <Sparkles size={10} />
                  {notification.service}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-[8px] font-medium text-[#c0aaa0]">{notification.time}</span>

            <ChevronRight
              size={13}
              className="text-[#c7b5ad] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </div>
        </div>

        {notification.action && (
          <span className="mt-3 inline-flex items-center gap-1 text-[8px] font-bold text-[#9a7669]">
            {notification.action}
            <ChevronRight size={10} />
          </span>
        )}
      </div>
    </button>
  );
}

function NotificationsSummary({ total, unread }: { total: number; unread: number }) {
  const read = total - unread;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 space-y-4">
        <div className="rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#f6ede8] text-[#ab8f83]">
              <Bell size={16} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c2a99d]">
                Resumo
              </p>

              <p className="mt-1 text-[13px] font-bold text-[#6b5850]">Atividade recente</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <SummaryRow label="Total" value={total} icon={Bell} />

            <SummaryRow label="Não lidas" value={unread} icon={Mail} highlight={unread > 0} />

            <SummaryRow label="Lidas" value={read} icon={Check} />
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[22px] border border-white/70 bg-white/75 p-4 text-left shadow-[0_18px_40px_-30px_rgba(64,46,40,.22)] transition hover:bg-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f6ede8] text-[#ab8f83]">
            <Settings2 size={14} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold text-[#80685e]">Preferências</p>

            <p className="mt-1 text-[8px] leading-relaxed text-[#b49b90]">
              Controle como deseja receber suas notificações.
            </p>
          </div>

          <ChevronRight size={13} className="text-[#c7b5ad]" />
        </button>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: typeof Bell;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-[#faf6f3] px-3 py-2.5">
      <Icon size={13} className="text-[#b09a91]" />

      <span className="flex-1 text-[9px] font-medium text-[#9f887e]">{label}</span>

      <span
        className={['text-[10px] font-bold', highlight ? 'text-[#a86f64]' : 'text-[#80685e]'].join(
          ' ',
        )}
      >
        {value}
      </span>
    </div>
  );
}

function NotificationDetails({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const Icon = NOTIFICATION_ICONS[notification.type];

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-[#493a35]/15 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-[201] flex h-dvh w-full max-w-[430px] flex-col border-l border-[#e9e1dc] bg-[#fffdfc] shadow-[-20px_0_60px_-30px_rgba(73,58,53,.35)]">
        <div className="flex h-[76px] items-center justify-between border-b border-[#eee5e1] px-5">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">
              Detalhes
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#6b5850]">Notificação</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#a48a7f] transition hover:bg-[#f5efec]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#f3e7e1] text-[#967569]">
            <Icon size={18} />
          </div>

          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#c2a99d]">
            {notification.date} · {notification.time}
          </p>

          <h3 className="mt-2 font-display text-[28px] leading-tight tracking-[-0.025em] text-[#6b5850]">
            {notification.title}
          </h3>

          <p className="mt-3 text-[11px] leading-6 text-[#9f887e]">{notification.description}</p>

          {(notification.client || notification.service) && (
            <div className="mt-6 space-y-2">
              {notification.client && (
                <DetailRow icon={UserRound} label="Cliente" value={notification.client} />
              )}

              {notification.service && (
                <DetailRow icon={Sparkles} label="Serviço" value={notification.service} />
              )}
            </div>
          )}

          <div className="mt-6 rounded-[18px] bg-[#faf6f3] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#a88b80]" />

              <p className="text-[9px] font-bold text-[#80685e]">Registro da atividade</p>
            </div>

            <p className="mt-2 text-[8px] leading-relaxed text-[#b49b90]">
              Esta atividade foi registrada automaticamente pelo sistema da clínica.
            </p>
          </div>
        </div>

        {notification.action && (
          <div className="border-t border-[#eee5e1] p-5">
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#493a35] text-[9px] font-bold text-white shadow-[0_15px_30px_-18px_rgba(54,39,34,.7)] transition hover:bg-[#3e302c]"
            >
              {notification.action}

              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[15px] border border-[#eee5e1] bg-white p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f6ede8] text-[#ab8f83]">
        <Icon size={13} />
      </div>

      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c0aaa0]">{label}</p>

        <p className="mt-1 text-[9px] font-semibold text-[#80685e]">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div className="rounded-[26px] border border-white/70 bg-white/85 px-6 py-16 text-center shadow-[0_22px_50px_-34px_rgba(64,46,40,.25)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[17px] bg-[#f6ede8] text-[#b49b90]">
        {search ? <Search size={20} /> : <Bell size={20} />}
      </div>

      <h2 className="mt-4 text-[13px] font-bold text-[#80685e]">
        {search ? 'Nenhuma notificação encontrada' : 'Tudo tranquilo por aqui'}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-[9px] leading-relaxed text-[#b49b90]">
        {search
          ? 'Tente buscar por outro termo ou altere os filtros.'
          : 'Quando alguma atividade acontecer na sua clínica, ela aparecerá aqui.'}
      </p>

      {search && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-[12px] bg-[#493a35] px-4 py-2.5 text-[9px] font-bold text-white"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

const NOTIFICATION_ICONS: Record<NotificationType, typeof CalendarDays> = {
  appointment: CalendarDays,
  reminder: Clock3,
  message: MessageCircle,
  system: Bell,
  client: UserRound,
};
