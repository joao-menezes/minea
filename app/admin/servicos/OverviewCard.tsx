import { Sparkles } from 'lucide-react';

export function OverviewCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Sparkles;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-[26px] border p-4 shadow-[0_20px_45px_-32px_rgba(64,46,40,.3)] backdrop-blur transition-all hover:-translate-y-0.5 lg:p-5',
        accent ? 'border-[#eadbd4] bg-[#f5ebe6]' : 'border-white/80 bg-white/80',
      ].join(' ')}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f4e9e3]/50 blur-xl" />

      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f5ebe7] text-[#a88a7e] transition-transform group-hover:scale-105">
          <Icon size={16} strokeWidth={1.6} />
        </div>

        <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#bea398]">
          {label}
        </p>

        <p className="mt-1 truncate font-display text-[27px] tracking-[-0.025em] text-[#624f48]">
          {value}
        </p>

        <p className="mt-1 text-[9px] text-[#b1998f]">{description}</p>
      </div>
    </div>
  );
}
