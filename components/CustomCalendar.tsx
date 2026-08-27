'use client';

import { useMemo } from 'react';

import { CalendarDays } from 'lucide-react';

import { WEEKDAYS } from '@/components/decor';

type CustomCalendarProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  referenceDate?: Date;
};

export function CustomCalendar({
  value,
  onChange,
  referenceDate = new Date(),
}: CustomCalendarProps) {
  const days = useMemo(() => buildCalendarDays(referenceDate), [referenceDate]);

  return (
    <div className="rounded-[22px] border border-[#e7ded9] bg-white p-4">
      <div className="flex items-center gap-2">
        <CalendarDays size={17} className="text-[#80665c]" />
        <p className="text-sm font-bold text-[#4b3b36]">Escolha uma data</p>
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

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onChange(date)}
              className={`flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition ${
                active ? 'bg-[#80665c] text-white' : 'text-[#5d4942] hover:bg-[#f3ece8]'
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
