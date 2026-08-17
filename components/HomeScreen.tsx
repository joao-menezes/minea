'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  LogOut,
  MapPin,
  Plus,
  Sparkles,
  Heart,
} from 'lucide-react'

import { WEEKDAYS, MONTHS, buildWeekStrip, sameDay } from './decor'
import type { Appointment, User } from '@/types'
import { AppointmentModal } from '@/components/AppointmentModal'

type HomeScreenProps = {
  user: User
  appointments: Appointment[]
  onLogout: () => void
  openNew: () => void
}

export default function HomeScreen({ user, appointments, onLogout, openNew }: HomeScreenProps) {
  const [selected, setSelected] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const week = useMemo(() => buildWeekStrip(new Date()), [])

  const dayAppointments = appointments
    .filter((a) => sameDay(a.date, selected))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const nextAppointment = [...appointments]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .find((a) => a.date >= new Date())

  const firstName = user.nome?.split(' ')[0] || 'você'

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    })

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <main className="min-h-screen bg-[#faf6f3] text-[#5c4a43] selection:bg-[#e9d3c8]/40">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />
        <div className="absolute top-[42%] -left-40 h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-md px-5 pb-32 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
                Minea
              </span>
              <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
                Estética & Bem-estar
              </span>
            </div>

            <h1 className="mt-2 font-display text-[31px] leading-none tracking-[-0.03em] text-[#6b5850]">
              Olá, {firstName}
              <span className="ml-1.5 inline-block align-middle"></span>
            </h1>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Sair"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#f0e6de] bg-white/80 text-[#a68b7f] shadow-[0_10px_30px_-18px_rgba(66,48,42,.25)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            <LogOut
              size={16}
              strokeWidth={1.7}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </button>
        </header>

        {/* Premium hero */}
        <section className="group relative mt-7 min-h-[250px] overflow-hidden rounded-[34px] border border-white/60 bg-[#f2e2d9] shadow-[0_28px_60px_-32px_rgba(80,56,48,.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,.65),transparent_28%),linear-gradient(135deg,#faf3ee_0%,#f1e1d8_48%,#e3c9bb_100%)]" />

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/40 bg-white/15" />
          <div className="absolute -right-4 top-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-[#c9ac9e]/15 blur-xl" />

          <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/30 text-[#9b7c6e] backdrop-blur-md transition-transform duration-500 group-hover:rotate-6">
            <ArrowUpRight size={18} strokeWidth={1.7} />
          </div>

          <div className="relative flex min-h-[250px] flex-col justify-between p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1.5 backdrop-blur-md">
              <Sparkles size={11} className="text-[#a3806f]" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a3806f]">
                Seu próximo cuidado
              </span>
            </div>

            {nextAppointment ? (
              <div className="pb-1">
                <p className="max-w-[275px] font-display text-[31px] leading-[1.04] tracking-[-0.025em] text-[#6b5850]">
                  {nextAppointment.title}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1.5 text-[#9b7c6e] backdrop-blur-sm">
                    <CalendarDays size={12} />
                    <span className="text-[10px] font-semibold">
                      {formatDate(nextAppointment.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1.5 text-[#9b7c6e] backdrop-blur-sm">
                    <Clock3 size={12} />
                    <span className="text-[10px] font-semibold">
                      {formatTime(nextAppointment.date)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pb-1">
                <p className="max-w-[290px] font-display text-[31px] leading-[1.04] tracking-[-0.025em] text-[#6b5850]">
                  Um momento só seu.
                </p>

                <p className="mt-3 max-w-[260px] text-[11px] leading-relaxed text-[#a48a7f]">
                  Seu próximo ritual de autocuidado começa com um simples agendamento.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Main CTA */}
        <button
          type="button"
          onClick={openNew}
          className="group mt-4 flex h-[58px] w-full items-center justify-between rounded-[20px] bg-[#8a6f63] px-5 text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/15">
              <Plus size={17} strokeWidth={1.8} />
            </span>
            <span className="text-[13px] font-semibold tracking-[-0.01em]">Novo agendamento</span>
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight size={16} strokeWidth={1.7} />
          </span>
        </button>

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c7b0a6]">
                Sua agenda
              </p>
              <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                {selected.getDate()} de {MONTHS[selected.getMonth()]}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 pb-0.5 text-[#b49b90]">
              <CalendarDays size={13} strokeWidth={1.7} />
              <span className="text-[9px] font-bold uppercase tracking-wide">
                {dayAppointments.length}{' '}
                {dayAppointments.length === 1 ? 'agendamento' : 'agendamentos'}
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#f1e8e2] bg-white/85 p-2 shadow-[0_18px_40px_-30px_rgba(64,46,40,.2)] backdrop-blur">
            <div className="flex justify-between">
              {week.map((day, index) => {
                const isSelected = sameDay(day, selected)
                const isToday = sameDay(day, new Date())

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelected(day)}
                    className={`relative flex h-[66px] w-[42px] flex-col items-center justify-center rounded-[19px] transition-all ${
                      isSelected
                        ? 'bg-[#a98d81] text-white shadow-[0_10px_22px_-11px_rgba(169,141,129,.6)]'
                        : 'text-[#ab948a] hover:bg-[#f9f4f1]'
                    }`}
                  >
                    <span
                      className={`text-[8px] font-bold uppercase tracking-[0.08em] ${
                        isSelected ? 'text-white/70' : 'text-[#c9b6ac]'
                      }`}
                    >
                      {WEEKDAYS[day.getDay()]}
                    </span>

                    <span className="mt-1 text-[15px] font-semibold">{day.getDate()}</span>

                    {isToday && !isSelected && (
                      <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Appointments */}
        <section className="mt-8">
          {dayAppointments.length === 0 ? (
            <div className="relative overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-[#f6efe9] px-6 py-9 text-center shadow-[0_16px_35px_-28px_rgba(67,48,42,.2)]">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40" />
              <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[#e6d3c7]/25" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[21px] border border-white/70 bg-white/70 text-[#b89a8d] shadow-sm">
                  <Heart size={20} strokeWidth={1.5} />
                </div>

                <p className="mt-4 font-display text-[25px] tracking-[-0.02em] text-[#8a6f63]">
                  Seu dia está livre.
                </p>

                <p className="mx-auto mt-2 max-w-[235px] text-[11px] leading-relaxed text-[#b49b90]">
                  Que tal reservar um momento para cuidar de você?
                </p>

                <button
                  type="button"
                  onClick={openNew}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold text-[#937568] shadow-[0_8px_20px_-12px_rgba(67,48,42,.25)] transition-all hover:-translate-y-0.5 hover:bg-[#fffdfc]"
                >
                  Encontrar um horário
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {dayAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="group rounded-[25px] border border-[#f1e8e2] bg-white/90 p-4 shadow-[0_13px_30px_-25px_rgba(64,46,40,.3)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#ecdfd7] hover:shadow-[0_18px_34px_-24px_rgba(64,46,40,.35)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-[#f6ede8] text-[#ab8f83]">
                      <Sparkles size={18} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#6b5850]">
                        {appointment.title}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-[10px] text-[#b49b90]">
                          <Clock3 size={11} />
                          {formatTime(appointment.date)}
                        </span>

                        {appointment.local && (
                          <span className="flex min-w-0 items-center gap-1 truncate text-[10px] text-[#b49b90]">
                            <MapPin size={11} />
                            {appointment.local}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(appointment)}
                      aria-label={`Abrir ${appointment.title}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#c9b6ac] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#a98d81]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-md px-5 pb-5 pt-12 bg-gradient-to-t from-[#faf6f3] via-[#faf6f3]/95 to-transparent">
          <button
            type="button"
            onClick={openNew}
            className="pointer-events-auto flex h-[58px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#8a6f63] text-[13px] font-bold text-white shadow-[0_18px_38px_-14px_rgba(138,111,99,.5)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
          >
            <Plus size={18} strokeWidth={2} />
            Novo agendamento
          </button>
        </div>
      </div>
      <AppointmentModal
        appointment={selectedAppointment}
        open={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        onSave={(updatedAppointment) => {
          console.log(updatedAppointment)
          setSelectedAppointment(null)
        }}
      />
    </main>
  )
}
