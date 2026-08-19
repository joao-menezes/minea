import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function SummaryRow({ icon: Icon, label, value }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf4f1] text-[#a98d81]">
          <Icon size={15} />
        </div>

        <span className="text-[11px] text-[#a48a7f]">{label}</span>
      </div>

      <strong className="text-sm text-[#6b5850]">{value}</strong>
    </div>
  );
}
