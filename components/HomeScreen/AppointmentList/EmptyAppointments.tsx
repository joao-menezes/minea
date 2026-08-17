import { ChevronRight, Heart } from 'lucide-react';

type EmptyAppointmentsProps = {
  onCreate: () => void;
};

export function EmptyAppointments({ onCreate }: EmptyAppointmentsProps) {
  return (
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
          onClick={onCreate}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold text-[#937568] shadow-[0_8px_20px_-12px_rgba(67,48,42,.25)] transition-all hover:-translate-y-0.5 hover:bg-[#fffdfc]"
        >
          Encontrar um horário
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
