'use client';

import { useEffect, useMemo, useState } from 'react';

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { MONTHS, WEEKDAYS } from '@/components/decor';
import { Appointment } from '@/types';
import { getAppointmentStatusLabel, sameDay } from '@/utils/utils';

type AppointmentCalendarProps = {
  selected: Date;
  week: Date[];
  appointmentCount: number;
  appointmentDates?: Date[];
  appointments?: Appointment[];
  onSelect: (date: Date) => void;
};

function buildCalendarDays(referenceDate: Date): Date[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(new Date(year, month, index - firstDay.getDay() + 1));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1];

    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }

  return days;
}

function buildWeekFromDate(date: Date): Date[] {
  const start = new Date(date);

  start.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);

    day.setDate(start.getDate() + index);

    return day;
  });
}

function shiftWeek(week: Date[], amount: number): Date[] {
  if (!week.length) return [];

  return week.map((day) => {
    const newDate = new Date(day);
    newDate.setDate(newDate.getDate() + amount);

    return newDate;
  });
}

export function AppointmentCalendar({
  selected,
  week,
  appointmentCount,
  appointmentDates,
  appointments = [],
  onSelect,
}: AppointmentCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const [displayedWeek, setDisplayedWeek] = useState<Date[]>(week);

  const hasAppointment = (date: Date) =>
    (appointmentDates ?? []).some((appointmentDate) => sameDay(appointmentDate, date));

  useEffect(() => {
    setDisplayedWeek(week);
  }, [week]);

  useEffect(() => {
    setCalendarMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [selected]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  const handleWeekSelect = (date: Date) => {
    onSelect(date);
  };

  const handleCalendarSelect = (date: Date) => {
    const newWeek = buildWeekFromDate(date);

    setDisplayedWeek(newWeek);
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));

    onSelect(date);
    setIsCalendarOpen(false);
  };

  const previousMonth = () => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    const todayWeek = buildWeekFromDate(today);

    setDisplayedWeek(todayWeek);
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));

    onSelect(today);
    setIsCalendarOpen(false);
  };

  const handlePreviousWeek = () => {
    const newWeek = shiftWeek(displayedWeek, -7);

    setDisplayedWeek(newWeek);

    const selectedIndex = displayedWeek.findIndex((day) => sameDay(day, selected));

    const nextSelected = selectedIndex >= 0 ? newWeek[selectedIndex] : newWeek[0];

    onSelect(nextSelected);
  };

  const handleNextWeek = () => {
    const newWeek = shiftWeek(displayedWeek, 7);

    setDisplayedWeek(newWeek);

    const selectedIndex = displayedWeek.findIndex((day) => sameDay(day, selected));

    const nextSelected = selectedIndex >= 0 ? newWeek[selectedIndex] : newWeek[0];

    onSelect(nextSelected);
  };

  const toggleCalendar = () => {
    if (!isCalendarOpen) {
      setCalendarMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }

    setIsCalendarOpen((current) => !current);
  };

  return (
    <section className="mt-9">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c7b0a6]">
            Sua agenda
          </p>

          <button
            type="button"
            onClick={toggleCalendar}
            className="group mt-2 flex items-center gap-2"
          >
            <h2 className="font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
              {selected.getDate()} de {MONTHS[selected.getMonth()]}
            </h2>

            <span
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full',
                'bg-[#f8f2ee] text-[#a98d81]',
                'transition-all duration-200',
                'group-hover:bg-[#f1e8e2]',
                isCalendarOpen ? 'rotate-180' : '',
              ].join(' ')}
            >
              <ChevronDown size={15} strokeWidth={2} />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAllAppointments(true)}
          className="group flex items-center gap-1.5 pb-0.5 text-[#b49b90] transition hover:text-[#806d64]"
        >
          <CalendarDays
            size={13}
            strokeWidth={1.7}
            className="transition-transform group-hover:scale-105"
          />

          <span className="text-[9px] font-bold uppercase tracking-wide">
            {appointmentCount} {appointmentCount === 1 ? 'agendamento' : 'agendamentos'}
          </span>
        </button>
      </div>

      {isCalendarOpen && (
        <div className="mb-3 rounded-[28px] border border-[#f1e8e2] bg-white/90 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.25)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#a98d81] transition hover:bg-[#f9f4f1]"
            >
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>

            <div className="text-center">
              <p className="font-display text-[17px] text-[#6b5850]">
                {MONTHS[calendarMonth.getMonth()]}
              </p>

              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#c7b0a6]">
                {calendarMonth.getFullYear()}
              </p>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#a98d81] transition hover:bg-[#f9f4f1]"
            >
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[8px] font-bold uppercase tracking-[0.08em] text-[#c9b6ac]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day) => {
              const isSelected = sameDay(day, selected);
              const hasAppointments = hasAppointment(day);
              const isToday = sameDay(day, new Date());

              const isCurrentMonth =
                day.getMonth() === calendarMonth.getMonth() &&
                day.getFullYear() === calendarMonth.getFullYear();

              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  onClick={() => handleCalendarSelect(day)}
                  className={[
                    'relative mx-auto flex h-9 w-9 items-center justify-center',
                    'rounded-full text-[12px] font-medium',
                    'transition-all duration-150',

                    isSelected
                      ? 'bg-[#a98d81] text-white shadow-[0_7px_16px_-8px_rgba(169,141,129,.7)]'
                      : isCurrentMonth
                        ? 'text-[#806d64] hover:bg-[#f9f4f1]'
                        : 'text-[#ded2cc]',
                  ].join(' ')}
                >
                  {day.getDate()}

                  {hasAppointments && (
                    <span
                      className={[
                        'absolute bottom-1 h-1 w-1 rounded-full',
                        isSelected ? 'bg-white/80' : 'bg-[#c49f91]',
                      ].join(' ')}
                    />
                  )}

                  {isToday && !hasAppointments && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-center border-t border-[#f5eeea] pt-3">
            <button
              type="button"
              onClick={goToToday}
              className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a98d81] transition hover:text-[#806d64]"
            >
              Ir para hoje
            </button>
          </div>
        </div>
      )}

      {!isCalendarOpen && (
        <div className="rounded-[28px] border border-[#f1e8e2] bg-white/85 p-2 shadow-[0_18px_40px_-30px_rgba(64,46,40,.2)] backdrop-blur">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePreviousWeek}
              aria-label="Semana anterior"
              className="flex h-12 w-9 shrink-0 items-center justify-center rounded-full text-[#a98d81] transition hover:bg-[#f9f4f1] active:scale-95"
            >
              <ChevronLeft size={17} strokeWidth={1.8} />
            </button>

            <div className="flex min-w-0 flex-1 justify-between">
              {displayedWeek.map((day) => {
                const isSelected = sameDay(day, selected);
                const hasAppointments = hasAppointment(day);
                const isToday = sameDay(day, new Date());

                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => handleWeekSelect(day)}
                    className={[
                      'relative flex h-[66px] w-[42px] flex-col items-center justify-center rounded-[19px] transition-all',
                      isSelected
                        ? 'bg-[#a98d81] text-white shadow-[0_10px_22px_-11px_rgba(169,141,129,.6)]'
                        : 'text-[#ab948a] hover:bg-[#f9f4f1]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-[8px] font-bold uppercase tracking-[0.08em]',
                        isSelected ? 'text-white/70' : 'text-[#c9b6ac]',
                      ].join(' ')}
                    >
                      {WEEKDAYS[day.getDay()]}
                    </span>

                    <span className="mt-1 text-[15px] font-semibold">{day.getDate()}</span>

                    {hasAppointments && (
                      <span
                        className={[
                          'absolute bottom-2 h-1 w-1 rounded-full',
                          isSelected ? 'bg-white/80' : 'bg-[#c49f91]',
                        ].join(' ')}
                      />
                    )}

                    {isToday && !hasAppointments && !isSelected && (
                      <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              aria-label="Próxima semana"
              className="flex h-12 w-9 shrink-0 items-center justify-center rounded-full text-[#a98d81] transition hover:bg-[#f9f4f1] active:scale-95"
            >
              <ChevronRight size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
      {showAllAppointments && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={() => setShowAllAppointments(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-[520px] overflow-hidden rounded-t-[30px] bg-[#fffdfc] shadow-[0_25px_80px_-30px_rgba(67,47,40,.45)] sm:rounded-[30px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eee4df] px-5 py-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c0a79c]">
                  Sua agenda
                </p>

                <h3 className="mt-1 font-display text-[25px] leading-none text-[#6b5850]">
                  Todos os agendamentos
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAllAppointments(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f2ee] text-[#907970] transition hover:bg-[#f1e8e2]"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5">
              {appointments.length === 0 ? (
                <div className="rounded-[22px] border border-[#eee4df] bg-[#faf7f5] px-5 py-10 text-center">
                  <CalendarDays size={24} strokeWidth={1.5} className="mx-auto text-[#b99d91]" />

                  <p className="mt-3 text-sm font-bold text-[#66534c]">Nenhum agendamento</p>

                  <p className="mt-1 text-[10px] leading-relaxed text-[#a58b81]">
                    Você ainda não possui agendamentos.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.date);

                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => {
                          onSelect(appointmentDate);
                          setShowAllAppointments(false);
                        }}
                        className="group w-full rounded-[22px] border border-[#eee4df] bg-white p-4 text-left transition hover:-translate-y-[1px] hover:border-[#dfd0c9] hover:bg-[#fdf9f7]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-[17px] bg-[#f3ece8]">
                            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#a98d81]">
                              {appointmentDate.toLocaleDateString('pt-BR', {
                                month: 'short',
                              })}
                            </span>

                            <span className="text-lg font-bold leading-none text-[#6b5850]">
                              {appointmentDate.getDate()}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-bold text-[#4b3b36]">
                              {appointment.title}
                            </p>

                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-[#9a837b]">
                                {appointmentDate.toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                })}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-[#d3beb5]" />

                              <span className="text-[10px] font-bold text-[#80665c]">
                                {appointment.time?.slice(0, 5)}
                              </span>
                            </div>

                            {appointment.local && (
                              <p className="mt-1 truncate text-[9px] text-[#b09a91]">
                                {appointment.local}
                              </p>
                            )}
                          </div>

                          <div
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide ${
                              appointment.status === 'confirmed'
                                ? 'bg-[#edf5ef] text-[#66816d]'
                                : appointment.status === 'cancelled'
                                  ? 'bg-[#fff1ef] text-[#a46c65]'
                                  : 'bg-[#f5eee9] text-[#907970]'
                            }`}
                          >
                            {getAppointmentStatusLabel(appointment.status)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
