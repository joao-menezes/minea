import { CalendarDays, Clock3, LucideIcon, UserPlus, Users } from 'lucide-react';

type ClientStat = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
};

type ClientStatsProps = {
  activeClients: number;
  debtClients: number;
  newClients: number | undefined;
  monthlyAppointments: number;
};

export function ClientStats({
  activeClients,
  debtClients,
  newClients,
  monthlyAppointments,
}: ClientStatsProps) {
  const stats: ClientStat[] = [
    {
      label: 'Clientes ativos',
      value: String(activeClients),
      description: 'Base atual',
      icon: Users,
      enabled: true,
    },
    {
      label: 'Novos clientes',
      value: String(newClients),
      description: 'Nos últimos 30 dias',
      icon: UserPlus,
      enabled: true,
    },
    {
      label: 'Agendamentos',
      value: String(monthlyAppointments),
      description: 'Este mês',
      icon: CalendarDays,
      enabled: true,
    },
    {
      label: 'Pendências',
      value: String(debtClients),
      description: 'Clientes em dívida',
      icon: Clock3,
      enabled: true,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats
        .filter((item) => item.enabled)
        .map(({ label, value, description, icon: Icon }) => (
          <div
            key={label}
            className="group rounded-[25px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.28)] backdrop-blur transition-all hover:-translate-y-0.5 lg:p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
              <Icon size={16} strokeWidth={1.7} />
            </div>

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
              {label}
            </p>

            <p className="mt-1 font-display text-[27px] tracking-[-0.02em] text-[#6b5850]">
              {value}
            </p>

            <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
          </div>
        ))}
    </section>
  );
}
