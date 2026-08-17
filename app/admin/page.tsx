'use client';

import { useEffect, useState } from 'react';

import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  DollarSign,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

import { AdminShell } from '@/components/admin/AdminShell';
import { formatCurrency } from '@/lib/financial';
import { getServices } from '@/src/services/serviceService';
import type { Service } from '@/types';

const APPOINTMENTS = [
  {
    time: '09:00',
    client: 'Ana Silva',
    service: 'Design de Sobrancelha',
    status: 'Confirmado',
  },
  {
    time: '10:30',
    client: 'Mariana Costa',
    service: 'Manutenção de tintura',
    status: 'Pendente',
  },
  {
    time: '14:00',
    client: 'Camila Souza',
    service: 'Design + Tintura',
    status: 'Confirmado',
  },
  {
    time: '15:30',
    client: 'Juliana Alves',
    service: 'Design + Henna',
    status: 'Confirmado',
  },
];

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        setLoadingServices(true);
        setServicesError(null);

        const data = await getServices();

        if (mounted) {
          setServices(data);
        }
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);

        if (mounted) {
          setServicesError('Não foi possível carregar os serviços.');
        }
      } finally {
        if (mounted) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

          <div className="absolute -left-40 top-[38%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

          <div className="absolute bottom-0 right-[18%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          {/* HEADER */}

          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
                  Minea
                </span>

                <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
                  Gestão & Bem-estar
                </span>
              </div>

              <h1 className="mt-3 font-display text-[32px] leading-none tracking-[-0.03em] text-[#6b5850] lg:text-[39px]">
                Bom dia, Rebeca
              </h1>

              <p className="mt-3 text-xs text-[#a48a7f]">Aqui está o resumo da sua clínica hoje.</p>
            </div>

            <button
              type="button"
              className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/15">
                  <PlusIcon />
                </span>
                Novo agendamento
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </section>

          {/* STATS */}

          <section className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Agendamentos hoje"
              value="8"
              description="2 a mais que ontem"
              icon={CalendarCheck}
              trend="+12,5%"
            />

            <StatCard
              label="Confirmados"
              value="6"
              description="75% dos horários"
              icon={Clock3}
              trend="+8,2%"
            />

            <StatCard
              label="Faturamento hoje"
              value="R$ 1.240"
              description="Estimativa do dia"
              icon={DollarSign}
              trend="+14,6%"
            />

            <StatCard
              label="Clientes ativos"
              value="248"
              description="Neste mês"
              icon={Users}
              trend="+5,4%"
            />
          </section>

          {/* MAIN */}

          <section className="mt-7 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            {/* AGENDA */}

            <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                    Sua agenda
                  </p>

                  <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                    Hoje
                  </h2>
                </div>

                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-[10px] font-bold text-[#a98d81] transition-colors hover:text-[#80655b]"
                >
                  Ver agenda
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>

              <div className="mt-6 divide-y divide-[#f1e8e2]">
                {APPOINTMENTS.map((appointment) => (
                  <div
                    key={`${appointment.time}-${appointment.client}`}
                    className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-12 shrink-0">
                      <p className="text-xs font-bold text-[#80685e]">{appointment.time}</p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
                      <Sparkles size={17} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-[#6b5850]">
                        {appointment.client}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-[#b49b90]">
                        {appointment.service}
                      </p>
                    </div>

                    <span
                      className={[
                        'hidden rounded-full px-3 py-1.5 text-[8px] font-bold sm:block',
                        appointment.status === 'Confirmado'
                          ? 'border border-[#dce9df] bg-[#edf4ee] text-[#66806d]'
                          : 'border border-[#eee0d5] bg-[#f8f0e8] text-[#9a775b]',
                      ].join(' ')}
                    >
                      {appointment.status}
                    </span>

                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#d0beb5] transition-all hover:bg-[#faf4f1] hover:text-[#a98d81]"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVIÇOS */}

            <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Desempenho
                </p>

                <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                  Serviços populares
                </h2>
              </div>

              <div className="mt-8 space-y-5">
                {loadingServices && (
                  <div className="space-y-5">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="animate-pulse">
                        <div className="h-3 w-32 rounded-full bg-[#eee3dd]" />

                        <div className="mt-3 h-2 w-full rounded-full bg-[#f2eae6]" />
                      </div>
                    ))}
                  </div>
                )}

                {!loadingServices && servicesError && (
                  <div className="rounded-[18px] border border-[#f1d9d4] bg-[#fbefed] px-4 py-3">
                    <p className="text-[10px] font-medium text-[#9b5d53]">{servicesError}</p>
                  </div>
                )}

                {!loadingServices && !servicesError && services.length === 0 && (
                  <div className="rounded-[18px] bg-[#f8f1ed] px-4 py-5 text-center">
                    <p className="text-[10px] font-medium text-[#a98d81]">
                      Nenhum serviço cadastrado.
                    </p>
                  </div>
                )}

                {!loadingServices &&
                  !servicesError &&
                  services.map((service) => <ServiceRow key={service.id} service={service} />)}
              </div>

              {/* INSIGHT */}

              <div className="relative mt-8 overflow-hidden rounded-[21px] bg-[#f6ede8] p-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/50" />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/70 bg-white/70 text-[#a98d81]">
                    <TrendingUp size={16} strokeWidth={1.7} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#80685e]">Serviços cadastrados</p>

                    <p className="mt-1 text-[9px] leading-relaxed text-[#b49b90]">
                      {services.length}{' '}
                      {services.length === 1 ? 'serviço disponível' : 'serviços disponíveis'} no
                      catálogo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM */}

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* REVENUE */}

            <div className="group relative min-h-[180px] overflow-hidden rounded-[30px] border border-white/30 bg-[#e8d4c9] p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.55),transparent_28%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#dfc5b9_100%)]" />

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/40 bg-white/15" />

              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#c9ac9e]/15 blur-xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#a98d81]">
                    Faturamento
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur">
                    <TrendingUp size={14} />
                  </div>
                </div>

                <div className="mt-7 flex items-end justify-between gap-5">
                  <div>
                    <p className="font-display text-[35px] tracking-[-0.03em] text-[#6b5850]">
                      R$ 18.450
                    </p>

                    <p className="mt-1 text-[10px] text-[#a48a7f]">faturamento em agosto</p>
                  </div>

                  <div className="rounded-full bg-white/40 px-3 py-1.5 text-[9px] font-bold text-[#8f7165] backdrop-blur">
                    +12,4%
                  </div>
                </div>
              </div>
            </div>

            {/* CLIENTS */}

            <div className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f4e9e3]/60 blur-2xl" />

              <div className="relative">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Próximos clientes
                </p>

                <div className="mt-7 flex items-center">
                  {['AS', 'MC', 'CS', 'JA'].map((initials, index) => (
                    <div
                      key={initials}
                      className={[
                        'flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[#c9afa5] text-[9px] font-bold text-white shadow-sm',
                        index > 0 ? '-ml-3' : '',
                      ].join(' ')}
                    >
                      {initials}
                    </div>
                  ))}

                  <div className="ml-5">
                    <p className="text-xs font-bold text-[#6b5850]">4 clientes hoje</p>

                    <p className="mt-1 text-[9px] text-[#b49b90]">Próximo atendimento às 09:00</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[#b49b90]">
                  <CalendarDays size={12} />

                  <span className="text-[9px] font-semibold">
                    Agenda com 4 horários confirmados
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-[#6b5850]">{service.name}</p>

          <p className="mt-1 text-[9px] text-[#b49b90]">{service.duration} min</p>
        </div>

        <p className="shrink-0 text-[11px] font-bold text-[#80685e]">
          {formatCurrency(service.price)}
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f1e8e2]">
        <div
          className="h-full rounded-full bg-[#b89a8e] transition-all duration-500"
          style={{
            width: '65%',
          }}
        />
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
};

function StatCard({ label, value, description, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="group rounded-[25px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.28)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-28px_rgba(64,46,40,.32)] lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
          <Icon size={16} strokeWidth={1.7} />
        </div>

        <span className="rounded-full border border-[#dce9df] bg-[#edf4ee] px-2.5 py-1 text-[8px] font-bold text-[#66806d]">
          {trend}
        </span>
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
        {label}
      </p>

      <p className="mt-1 font-display text-[27px] tracking-[-0.02em] text-[#6b5850]">{value}</p>

      <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
    </div>
  );
}
