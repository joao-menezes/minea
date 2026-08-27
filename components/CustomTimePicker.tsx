'use client';

import { Clock3 } from 'lucide-react';

type CustomTimePickerProps = {
  value: string | null;
  options?: string[];
  onChange: (time: string) => void;
};

export const DEFAULT_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export function CustomTimePicker({
  value,
  options = DEFAULT_TIMES,
  onChange,
}: CustomTimePickerProps) {
  return (
    <div className="mt-4 rounded-[22px] border border-[#e7ded9] bg-white p-4">
      <div className="flex items-center gap-2">
        <Clock3 size={17} className="text-[#80665c]" />
        <p className="text-sm font-bold text-[#4b3b36]">Horários disponíveis</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((time) => {
          const active = value === time;

          return (
            <button
              key={time}
              type="button"
              onClick={() => onChange(time)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                active
                  ? 'border-[#80665c] bg-[#80665c] text-white'
                  : 'border-[#e7ded9] bg-white text-[#775b52] hover:bg-[#f6efeb]'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
