import type { LucideIcon } from 'lucide-react';

type FinancialStatProps = {
  label: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
  positive?: boolean;
};

export function FinancialStat({
  label,
  value,
  description,
  trend,
  icon: Icon,
  positive = true,
}: FinancialStatProps) {
  return (
    <div className="group rounded-[25px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.28)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-28px_rgba(64,46,40,.32)] lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
          <Icon size={16} strokeWidth={1.7} />
        </div>

        <span
          className={[
            'rounded-full border px-2.5 py-1 text-[8px] font-bold',
            positive
              ? 'border-[#dce9df] bg-[#edf4ee] text-[#66806d]'
              : 'border-[#eadbd4] bg-[#f8eeea] text-[#a68173]',
          ].join(' ')}
        >
          {trend}
        </span>
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
        {label}
      </p>

      <p className="mt-1 truncate font-display text-[27px] tracking-[-0.02em] text-[#6b5850]">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
    </div>
  );
}
