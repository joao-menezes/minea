import type { LucideIcon } from 'lucide-react';

type PaymentMethodProps = {
  icon: LucideIcon;
  label: string;
  percentage: number;
};

export function PaymentMethod({ icon: Icon, label, percentage }: PaymentMethodProps) {
  return (
    <div className="rounded-[18px] bg-[#f8f1ed] p-3 text-center transition-all hover:-translate-y-0.5 hover:bg-[#f5ebe6]">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[#a98d81] shadow-[0_6px_15px_-12px_rgba(64,46,40,.3)]">
        <Icon size={15} strokeWidth={1.7} />
      </div>

      <p className="mt-2 text-[9px] font-bold text-[#80685e]">{label}</p>

      <p className="mt-1 font-display text-[18px] text-[#6b5850]">{percentage}%</p>

      <div className="mx-auto mt-2 h-1 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#a98d81] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
