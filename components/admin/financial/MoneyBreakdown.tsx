import type { LucideIcon } from 'lucide-react';

type MoneyBreakdownProps = {
  icon: LucideIcon;
  label: string;
  description: string;
  value: string;
  positive?: boolean;
};

export function MoneyBreakdown({
  icon: Icon,
  label,
  description,
  value,
  positive = false,
}: MoneyBreakdownProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]',
          positive ? 'bg-[#edf4ee] text-[#66806d]' : 'bg-[#f8eeea] text-[#a68173]',
        ].join(' ')}
      >
        <Icon size={17} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-[#80685e]">{label}</p>

        <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
      </div>

      <p
        className={[
          'shrink-0 text-[12px] font-bold',
          positive ? 'text-[#66806d]' : 'text-[#a68173]',
        ].join(' ')}
      >
        {positive ? '+' : '-'}
        {value}
      </p>
    </div>
  );
}
