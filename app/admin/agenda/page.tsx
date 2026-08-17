'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  LucideIcon,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

import { AdminShell } from '@/components/admin/AdminShell'

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled'

type Appointment = {
  id: string
  time: string
  duration: string
  client: string
  service: string
  professional: string
  status: AppointmentStatus
  price: string
  location?: string
}

const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '09:00',
    duration: '45 min',
    client: 'Ana Silva',
    service: 'Design de Sobrancelha',
    professional: 'Rebeca',
    status: 'confirmed',
    price: 'R$ 85',
  },
  {
    id: '2',
    time: '10:30',
    duration: '60 min',
    client: 'Mariana Costa',
    service: 'Manutenção de Tintura',
    professional: 'Rebeca',
    status: 'pending',
    price: 'R$ 120',
  },
  {
    id: '3',
    time: '12:00',
    duration: '45 min',
    client: '—',
    service: '',
    professional: '',
    status: 'cancelled',
    price: '',
  },
  {
    id: '4',
    time: '14:00',
    duration: '60 min',
    client: 'Camila Souza',
    service: 'Design + Tintura',
    professional: 'Rebeca',
    status: 'confirmed',
    price: 'R$ 145',
  },
  {
    id: '5',
    time: '15:30',
    duration: '60 min',
    client: 'Juliana Alves',
    service: 'Design + Henna',
    professional: 'Rebeca',
    status: 'confirmed',
    price: 'R$ 130',
  },
  {
    id: '6',
    time: '17:00',
    duration: '45 min',
    client: 'Beatriz Martins',
    service: 'Design de Sobrancelha',
    professional: 'Rebeca',
    status: 'pending',
    price: 'R$ 85',
  },
]

const DAYS = [
  { day: 'SEG', date: 17 },
  { day: 'TER', date: 18 },
  { day: 'QUA', date: 19 },
  { day: 'QUI', date: 20 },
  { day: 'SEX', date: 21 },
  { day: 'SÁB', date: 22 },
  { day: 'DOM', date: 23 },
]

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  cancelled: 'Cancelado',
}

export default function AdminAgendaPage() {
  const [selectedDay, setSelectedDay] = useState(17)
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all')
  const [search, setSearch] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS.filter((appointment) => {
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter

      const searchValue = search.toLowerCase()

      const matchesSearch =
        !search ||
        appointment.client.toLowerCase().includes(searchValue) ||
        appointment.service.toLowerCase().includes(searchValue)

      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter])

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />
          <div className="absolute top-[40%] -left-40 h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />
          <div className="absolute bottom-0 right-[15%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
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
              className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
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

          {/* DATE NAVIGATION */}
          <section className="mt-8 rounded-[30px] border border-white/70 bg-white/85 p-4 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-4 lg:justify-start">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f1e8e2] bg-white text-[#a98d81] transition-all hover:bg-[#faf4f1]"
                >
                  <ArrowLeft size={15} />
                </button>

                <div className="text-center lg:text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">
                    Agosto 2026
                  </p>

                  <h2 className="mt-1 font-display text-[24px] tracking-[-0.025em] text-[#6b5850]">
                    Semana atual
                  </h2>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f1e8e2] bg-white text-[#a98d81] transition-all hover:bg-[#faf4f1]"
                >
                  <ArrowRight size={15} />
                </button>
              </div>

              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#f1e8e2] bg-[#faf6f3] px-4 text-[10px] font-bold text-[#92766b] transition-all hover:bg-[#f6ede8]"
              >
                <CalendarDays size={13} />
                Hoje
              </button>
            </div>

            {/* DAYS */}
            <div className="mt-5 grid grid-cols-7 gap-1.5 lg:gap-2">
              {DAYS.map((day) => {
                const selected = selectedDay === day.date
                const isToday = day.date === 17

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDay(day.date)}
                    className={[
                      'relative flex min-h-[76px] flex-col items-center justify-center rounded-[20px] transition-all',
                      selected
                        ? 'bg-[#a98d81] text-white shadow-[0_12px_25px_-13px_rgba(169,141,129,.7)]'
                        : 'text-[#a9948b] hover:bg-[#faf4f1]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-[8px] font-bold tracking-[0.1em]',
                        selected ? 'text-white/65' : 'text-[#c5b2a9]',
                      ].join(' ')}
                    >
                      {day.day}
                    </span>

                    <span className="mt-1 text-[17px] font-semibold">{day.date}</span>

                    {isToday && !selected && (
                      <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* TOOLBAR */}
          <section className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                Segunda-feira, 17 de agosto
              </p>

              <h2 className="mt-2 font-display text-[28px] leading-none tracking-[-0.025em] text-[#6b5850]">
                6 atendimentos
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
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

              {/* Filter */}
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
                  <option value="pending">Pendentes</option>
                  <option value="cancelled">Cancelados</option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b49b90]"
                />
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
            {/* TIMELINE */}
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
                {filteredAppointments.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => setSelectedAppointment(appointment)}
                  />
                ))}

                {filteredAppointments.length === 0 && <EmptyState />}
              </div>
            </div>

            {/* SIDE PANEL */}
            <aside className="space-y-5">
              {/* Summary */}
              <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Resumo do dia
                </p>

                <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                  Hoje
                </h2>

                <div className="mt-7 space-y-4">
                  <SummaryRow icon={CalendarCheckIcon} label="Agendamentos" value="6" />

                  <SummaryRow icon={Check} label="Confirmados" value="4" />

                  <SummaryRow icon={Clock3} label="Pendentes" value="2" />

                  <SummaryRow icon={DollarSignIcon} label="Faturamento previsto" value="R$ 650" />
                </div>
              </div>

              {/* Next appointment */}
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

                  <div className="mt-7">
                    <p className="text-[10px] font-bold text-[#a98d81]">09:00 · Hoje</p>

                    <p className="mt-2 font-display text-[27px] tracking-[-0.025em] text-[#6b5850]">
                      Ana Silva
                    </p>

                    <p className="mt-1 text-[10px] text-[#a48a7f]">Design de Sobrancelha</p>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/45 text-[#9d7e70]">
                      <Clock3 size={14} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-[#80685e]">Duração</p>

                      <p className="text-[9px] text-[#a48a7f]">45 minutos</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>

        {/* APPOINTMENT DETAIL */}
        {selectedAppointment && (
          <AppointmentDetails
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </main>
    </AdminShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Appointment row                                                           */
/* -------------------------------------------------------------------------- */

function AppointmentRow({
  appointment,
  onClick,
}: {
  appointment: Appointment
  onClick: () => void
}) {
  const cancelled = appointment.status === 'cancelled'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 py-4 text-left transition-all first:pt-3 last:pb-3 hover:px-2"
    >
      {/* TIME */}
      <div className="w-12 shrink-0">
        <p
          className={['text-xs font-bold', cancelled ? 'text-[#c8b9b2]' : 'text-[#80685e]'].join(
            ' ',
          )}
        >
          {appointment.time}
        </p>

        <p className="mt-1 text-[8px] text-[#c7b3aa]">{appointment.duration}</p>
      </div>

      {/* CONNECTOR */}
      <div className="relative hidden w-5 self-stretch sm:block">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#f1e8e2]" />

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#c8aea3]" />
      </div>

      {/* ICON */}
      <div
        className={[
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px]',
          cancelled ? 'bg-[#f7f2ef] text-[#c4b4ac]' : 'bg-[#f6ede8] text-[#ab8f83]',
        ].join(' ')}
      >
        {cancelled ? <X size={17} strokeWidth={1.7} /> : <Sparkles size={17} strokeWidth={1.6} />}
      </div>

      <div className="min-w-0 flex-1">
        {cancelled ? (
          <>
            <p className="text-[12px] font-bold text-[#b5a49d]">Horário disponível</p>

            <p className="mt-1 text-[10px] text-[#c7b7b0]">Este horário está livre</p>
          </>
        ) : (
          <>
            <p className="truncate text-[12px] font-bold text-[#6b5850]">{appointment.client}</p>

            <p className="mt-1 truncate text-[10px] text-[#b49b90]">{appointment.service}</p>
          </>
        )}
      </div>

      {/* STATUS */}
      {!cancelled && <StatusBadge status={appointment.status} />}

      {/* PRICE */}
      {!cancelled && (
        <span className="hidden text-[10px] font-bold text-[#80685e] md:block">
          {appointment.price}
        </span>
      )}

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#c9b6ac] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#a98d81]">
        <MoreHorizontal size={15} />
      </span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles = {
    confirmed: 'border-[#e2ebe4] bg-[#f1f6f2] text-[#718678]',
    pending: 'border-[#eee0d5] bg-[#faf3ed] text-[#9a775b]',
    cancelled: 'border-[#eee4df] bg-[#f8f3f0] text-[#ae9a91]',
  }

  return (
    <span
      className={[
        'hidden rounded-full border px-3 py-1.5 text-[8px] font-bold sm:block',
        styles[status],
      ].join(' ')}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f6ede8] text-[#ab8f83]">
        <Icon size={14} strokeWidth={1.7} />
      </div>

      <span className="flex-1 text-[10px] font-semibold text-[#9c8278]">{label}</span>

      <span className="text-[11px] font-bold text-[#6b5850]">{value}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f6ede8] text-[#b89a8d]">
        <CalendarDays size={19} strokeWidth={1.5} />
      </div>

      <p className="mt-4 font-display text-[24px] text-[#8a6f63]">Nenhum horário encontrado</p>

      <p className="mt-2 max-w-[230px] text-[10px] leading-relaxed text-[#b49b90]">
        Não existem agendamentos que correspondam aos filtros selecionados.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Detail modal                                                               */
/* -------------------------------------------------------------------------- */

function AppointmentDetails({
  appointment,
  onClose,
}: {
  appointment: Appointment
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#463933]/15 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-[30px] border border-white/70 bg-[#fffdfc] shadow-[0_30px_80px_-25px_rgba(64,46,40,.35)] sm:rounded-[30px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#f1e8e2] px-5 py-4">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">
              Detalhes
            </p>

            <h3 className="mt-1 font-display text-[23px] text-[#6b5850]">Agendamento</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf4f1] text-[#a98d81]"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-[23px] bg-[#f6ede8] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/70 text-[#ab8f83]">
                <UserRound size={18} />
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#6b5850]">{appointment.client}</p>

                <p className="mt-1 text-[10px] text-[#a48a7f]">{appointment.service}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <DetailItem
                icon={Clock3}
                label="Horário"
                value={`${appointment.time} · ${appointment.duration}`}
              />

              <DetailItem icon={Sparkles} label="Profissional" value={appointment.professional} />

              <DetailItem
                icon={MapPin}
                label="Local"
                value={appointment.location || 'Clínica Minea'}
              />

              <DetailItem icon={CalendarDays} label="Valor" value={appointment.price} />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center rounded-[15px] border border-[#eee3dd] bg-white text-[10px] font-bold text-[#8a6f63] transition-all hover:bg-[#faf4f1]"
            >
              Editar
            </button>

            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center rounded-[15px] bg-[#8a6f63] text-[10px] font-bold text-white shadow-[0_12px_25px_-15px_rgba(138,111,99,.5)] transition-all hover:bg-[#7c6156]"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-[16px] bg-white/65 p-3">
      <Icon size={13} className="text-[#ab8f83]" />

      <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#c1aaa0]">
        {label}
      </p>

      <p className="mt-1 truncate text-[9px] font-semibold text-[#80685e]">{value}</p>
    </div>
  )
}

function CalendarCheckIcon({
  size = 16,
  strokeWidth = 1.7,
}: {
  size?: number
  strokeWidth?: number
}) {
  return <CalendarDays size={size} strokeWidth={strokeWidth} />
}

function DollarSignIcon({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return <span className="text-[13px] font-bold leading-none">R$</span>
}
