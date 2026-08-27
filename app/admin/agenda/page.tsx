'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppointmentRow, SummaryRow } from 'components/admin/agenda';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  DollarSign,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';

import { EmptyRow } from '@/components/EmptyRow';
import { AppointmentModal } from '@/components/HomeScreen/Appointment/AppointmentModal';
import { BookingFlow } from '@/components/HomeScreen/Appointment/NewAppointmentSheet';
import { AdminShell } from '@/components/admin/AdminShell';
import { getAllAppointment, updateAppointment } from '@/lib/api/appointments';
import { getClients } from '@/lib/api/clients';
import { getServices } from '@/lib/api/services';
import type { Appointment, AppointmentStatus, Client, Service } from '@/types';
import { buildWeekStrip, sameDay } from '@/utils/utils';

export default function AdminAgendaPage() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [displayedWeek, setDisplayedWeek] = useState(() => buildWeekStrip(new Date()));
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAppointments() {
      try {
        setLoading(true);
        setError('');

        const data = await getAllAppointment();

        if (!controller.signal.aborted) {
          setAppointments(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);

          setAppointments([]);
          setError('Não foi possível carregar a agenda.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => controller.abort();
  }, []);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const matchesDay =
        sameDay(appointmentDate, selectedDay) ||
        (appointmentDate.getUTCFullYear() === selectedDay.getFullYear() &&
          appointmentDate.getUTCMonth() === selectedDay.getMonth() &&
          appointmentDate.getUTCDate() === selectedDay.getDate());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

      const matchesSearch =
        !query ||
        appointment.clientName?.toLowerCase().includes(query) ||
        appointment.title.toLowerCase().includes(query);

      return matchesDay && matchesStatus && matchesSearch;
    });
  }, [appointments, search, selectedDay, statusFilter]);

  const selectDay = (date: Date) => {
    setSelectedDay(date);
  };

  const shiftWeek = (amount: number) => {
    const nextWeek = displayedWeek.map((date) => {
      const shifted = new Date(date);
      shifted.setDate(shifted.getDate() + amount);
      return shifted;
    });

    const selectedIndex = displayedWeek.findIndex((date) => sameDay(date, selectedDay));
    setDisplayedWeek(nextWeek);
    setSelectedDay(nextWeek[selectedIndex >= 0 ? selectedIndex : 3]);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDay(today);
    setDisplayedWeek(buildWeekStrip(today));
  };

  async function handleNewAppointment() {
    try {
      setLoadingServices(true);
      setServicesError(null);

      const [serviceData, clientData] = await Promise.all([getServices(), getClients()]);

      setServices(serviceData);
      setClients(clientData);
      setShowNewAppointment(true);
    } catch (error) {
      console.error(error);

      setServicesError(error instanceof Error ? error.message : 'Erro ao carregar serviços');

      setShowNewAppointment(true);
    } finally {
      setLoadingServices(false);
    }
  }

  const confirmedCount = filteredAppointments.filter((item) => item.status === 'confirmed').length;

  const pendingCount = filteredAppointments.filter((item) => item.status === 'scheduled').length;

  const revenue = useMemo(() => {
    return filteredAppointments.reduce((total, appointment) => {
      const value =
        typeof appointment.price === 'number'
          ? appointment.price
          : Number(
              String(appointment.price)
                .replace(/[^\d,.-]/g, '')
                .replace(/\./g, '')
                .replace(',', '.'),
            );

      return Number.isFinite(value) ? total + value : total;
    }, 0);
  }, [filteredAppointments]);

  const formattedRevenue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(revenue);

  const nextAppointment = useMemo(() => {
    return (
      filteredAppointments
        .filter((item) => item.status !== 'cancelled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null
    );
  }, [filteredAppointments]);
  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/*<div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />*/}
          {/*<div className="absolute -left-40 top-[40%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />*/}
          {/*<div className="absolute bottom-0 right-[15%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />*/}
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
                  Minea
                </span>

                <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
                  Agenda
                </span>
              </div>

              <h1 className="mt-3 font-display text-[34px] leading-none tracking-[-0.035em] text-[#6b5850] lg:text-[42px]">
                Agenda
              </h1>

              <p className="mt-3 text-xs text-[#a48a7f]">
                Organize seus horários e acompanhe os próximos atendimentos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewAppointment}
              className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/15">
                  <Plus size={16} strokeWidth={1.8} />
                </span>
                Novo agendamento
              </span>

              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </header>

          <section className="mt-8 rounded-[30px] border border-white/70 bg-white/85 p-4 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-4 lg:justify-start">
                <button
                  type="button"
                  onClick={() => shiftWeek(-7)}
                  aria-label="Semana anterior"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f1e8e2] bg-white text-[#a98d81] transition-all hover:bg-[#faf4f1]"
                >
                  <ArrowLeft size={15} />
                </button>

                <div className="text-center lg:text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">
                    {selectedDay.toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  <h2 className="mt-1 font-display text-[24px] tracking-[-0.025em] text-[#6b5850]">
                    Semana atual
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => shiftWeek(7)}
                  aria-label="Próxima semana"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f1e8e2] bg-white text-[#a98d81] transition-all hover:bg-[#faf4f1]"
                >
                  <ArrowRight size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={goToToday}
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#f1e8e2] bg-[#faf6f3] px-4 text-[10px] font-bold text-[#92766b] transition-all hover:bg-[#f6ede8]"
              >
                <CalendarDays size={13} />
                Hoje
              </button>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5 lg:gap-2">
              {displayedWeek.map((date) => {
                const selected = sameDay(selectedDay, date);
                const isToday = sameDay(new Date(), date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => selectDay(date)}
                    className={[
                      `relative flex min-h-[76px] flex-col items-center justify-center rounded-[20px] transition-all`,
                      selected
                        ? `bg-[#a98d81] text-white shadow-[0_12px_25px_-13px_rgba(169,141,129,.7)]`
                        : `text-[#a9948b] hover:bg-[#faf4f1]`,
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-[8px] font-bold tracking-[0.1em]',
                        selected ? 'text-white/65' : 'text-[#c5b2a9]',
                      ].join(' ')}
                    >
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                    </span>

                    <span className="mt-1 text-[17px] font-semibold">{date.getDate()}</span>

                    {isToday && !selected && (
                      <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
          <section className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                {selectedDay.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>

              <h2 className="mt-2 font-display text-[28px] leading-none tracking-[-0.025em] text-[#6b5850]">
                {loading ? 'Carregando...' : `${filteredAppointments.length} atendimentos`}
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c1aaa0]"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar cliente..."
                  className="h-10 w-full rounded-[14px] border border-[#f0e6e0] bg-white/80 pl-9 pr-4 text-[10px] text-[#80685e] outline-none placeholder:text-[#c4b2aa] focus:border-[#d9c5bc] sm:w-[190px]"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as 'all' | AppointmentStatus)
                  }
                  className="h-10 w-full appearance-none rounded-[14px] border border-[#f0e6e0] bg-white/80 px-4 pr-9 text-[10px] font-semibold text-[#80685e] outline-none sm:w-[150px]"
                >
                  <option value="all">Todos os status</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="scheduled">Agendados</option>
                  <option value="completed">Concluídos</option>
                  <option value="no_show">Não compareceram</option>
                  <option value="cancelled">Cancelados</option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b49b90]"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-5 rounded-[20px] border border-[#f1d9d4] bg-[#fbefed] px-4 py-3 text-xs text-[#9b5d53]">
              {error}
            </div>
          )}

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
            <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 size={14} className="text-[#ab8f83]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a98d81]">
                    Horários do dia
                  </span>
                </div>

                <span className="text-[9px] font-semibold text-[#c1aaa0]">08:00 — 18:00</span>
              </div>

              <div className="divide-y divide-[#f3ebe7]">
                {loading ? (
                  <div className="py-16 text-center text-[10px] text-[#b49b90]">
                    Carregando agenda...
                  </div>
                ) : (
                  <>
                    {filteredAppointments.map((appointment) => (
                      <AppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => setSelectedAppointment(appointment)}
                      />
                    ))}

                    {filteredAppointments.length === 0 && (
                      <EmptyRow
                        title={'Agenda livre'}
                        message={'Nenhum atendimento encontrado para este dia.'}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Resumo do dia
                </p>

                <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                  {selectedDay.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </h2>

                <div className="mt-7 space-y-4">
                  <SummaryRow
                    icon={CalendarDays}
                    label="Agendamentos"
                    value={String(filteredAppointments.length)}
                  />

                  <SummaryRow icon={Check} label="Confirmados" value={String(confirmedCount)} />

                  <SummaryRow icon={Clock3} label="Pendentes" value={String(pendingCount)} />

                  <SummaryRow
                    icon={DollarSign}
                    label="Faturamento previsto"
                    value={formattedRevenue}
                  />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[30px] border border-white/30 bg-[#e8d4c9] p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.55),transparent_28%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#dfc5b9_100%)]" />

                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/30 bg-white/15" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a98d81]">
                      Próximo atendimento
                    </p>

                    <Sparkles size={14} className="text-[#a98d81]" />
                  </div>

                  {nextAppointment ? (
                    <>
                      <div className="mt-7">
                        <p className="text-[10px] font-bold text-[#a98d81]">
                          {nextAppointment.date}
                        </p>

                        <p className="mt-2 font-display text-[27px] tracking-[-0.025em] text-[#6b5850]">
                          {nextAppointment.clientName ?? 'Cliente não informado'}
                        </p>

                        <p className="mt-1 text-[10px] text-[#a48a7f]">{nextAppointment.title}</p>
                      </div>

                      <div className="mt-6 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/45 text-[#9d7e70]">
                          <Clock3 size={14} />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold text-[#80685e]">Duração</p>

                          <p className="text-[9px] text-[#a48a7f]">{nextAppointment.duration}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-7">
                      <p className="font-display text-[24px] text-[#80685e]">Agenda livre</p>

                      <p className="mt-2 text-[10px] text-[#a48a7f]">
                        Nenhum próximo atendimento encontrado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>

        <AppointmentModal
          appointment={selectedAppointment}
          open={selectedAppointment !== null}
          onClose={() => setSelectedAppointment(null)}
          onSave={async (updatedAppointment) => {
            const updated = await updateAppointment(updatedAppointment.id, {
              date: updatedAppointment.date,
              time: updatedAppointment.time,
            });

            setAppointments((current) =>
              current.map((item) => (item.id === updated.id ? updated : item)),
            );
            setSelectedAppointment(updated);
          }}
          onComplete={async (appointment) => {
            const updated = await updateAppointment(appointment.id, {
              status: 'completed',
            });

            setAppointments((current) =>
              current.map((item) => (item.id === updated.id ? updated : item)),
            );
            setSelectedAppointment(updated);
          }}
        />

        {showNewAppointment && (
          <BookingFlow
            userId=""
            adminMode
            clients={clients}
            services={services}
            loadingServices={loadingServices}
            servicesError={servicesError}
            onClose={() => setShowNewAppointment(false)}
            onComplete={(appointment) => {
              setAppointments((current) => [...current, appointment]);

              setShowNewAppointment(false);
            }}
          />
        )}
      </main>
    </AdminShell>
  );
}
