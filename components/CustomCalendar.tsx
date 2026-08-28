'use client';

import { useEffect, useMemo, useState } from 'react';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

import { MONTHS, WEEKDAYS } from '@/components/decor';

type CustomCalendarProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  referenceDate?: Date;
  minDate?: Date;
};

export function CustomCalendar({
  value,
  onChange,
  referenceDate = new Date(),
  minDate,
}: CustomCalendarProps) {
  const [displayedMonth, setDisplayedMonth] = useState(
    new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
  );
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: currentYear - 1900 + 11 }, (_, index) => currentYear + 10 - index),
    [currentYear],
  );
  const days = useMemo(() => buildCalendarDays(displayedMonth), [displayedMonth]);

  const selectedDateTime = value?.getTime() ?? null;
  const referenceYear = referenceDate.getFullYear();
  const referenceMonth = referenceDate.getMonth();

  useEffect(() => {
    const nextDate = value ?? referenceDate;
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();

    setDisplayedMonth((current) => {
      if (current.getFullYear() === nextYear && current.getMonth() === nextMonth) {
        return current;
      }

      return new Date(nextYear, nextMonth, 1);
    });
  }, [referenceMonth, referenceYear, selectedDateTime]);

  function changeMonth(amount: number) {
    setDisplayedMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  }

  return (
    <div className="rounded-[22px] border border-[#e7ded9] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={17} className="text-[#80665c]" />
          <p className="text-sm font-bold text-[#4b3b36]">Escolha uma data</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Mês anterior"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#a38379] transition hover:bg-[#f3ece8]"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Próximo mês"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#a38379] transition hover:bg-[#f3ece8]"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_84px] gap-2">
        <select
          aria-label="Selecionar mês"
          value={displayedMonth.getMonth()}
          onChange={(event) =>
            setDisplayedMonth(
              (current) => new Date(current.getFullYear(), Number(event.target.value), 1),
            )
          }
          className="h-9 rounded-[11px] border border-[#e7ded9] bg-[#fffdfc] px-2 text-xs font-semibold capitalize text-[#80665c] outline-none"
        >
          {MONTHS.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          aria-label="Selecionar ano"
          value={displayedMonth.getFullYear()}
          onChange={(event) =>
            setDisplayedMonth(
              (current) => new Date(Number(event.target.value), current.getMonth(), 1),
            )
          }
          className="h-9 rounded-[11px] border border-[#e7ded9] bg-[#fffdfc] px-2 text-xs font-semibold text-[#80665c] outline-none"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="text-center text-[9px] font-bold uppercase text-[#a38379]"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {days.map((date) => {
          const active = value ? sameDay(value, date) : false;
          const disabled = minDate ? isBeforeDay(date, minDate) : false;

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onChange(date)}
              disabled={disabled}
              className={`flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition ${
                active
                  ? 'bg-[#80665c] text-white'
                  : disabled
                    ? 'cursor-not-allowed text-[#d8ccc7]'
                    : 'text-[#5d4942] hover:bg-[#f3ece8]'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function sameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isBeforeDay(date: Date, minimum: Date): boolean {
  return (
    date.getFullYear() < minimum.getFullYear() ||
    (date.getFullYear() === minimum.getFullYear() && date.getMonth() < minimum.getMonth()) ||
    (date.getFullYear() === minimum.getFullYear() &&
      date.getMonth() === minimum.getMonth() &&
      date.getDate() < minimum.getDate())
  );
}

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
