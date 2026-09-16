'use client';

import { Clock3 } from 'lucide-react';

type CustomTimePickerProps = {
  value: string | null;
  onChange: (time: string) => void;
  minTime?: string;
};

export function CustomTimePicker({ value, onChange, minTime }: CustomTimePickerProps) {
  return (
    <div className="mt-4 rounded-[22px] border border-[#e7ded9] bg-white p-4">
      <div className="flex items-center gap-2">
        <Clock3 size={17} className="text-[#80665c]" />
        <p className="text-sm font-bold text-[#4b3b36]">Horário</p>
      </div>

      <input
        type="time"
        value={value ?? ''}
        min={minTime}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 h-12 w-full rounded-xl border border-[#e7ded9] bg-white px-4 text-sm font-bold text-[#4b3b36] outline-none transition focus:border-[#b49a90]"
      />

      {minTime && (
        <p className="mt-2 text-[10px] text-[#9a837b]">
          Não é possível escolher um horário anterior ao horário atual.
        </p>
      )}
    </div>
  );
}
