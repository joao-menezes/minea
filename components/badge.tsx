import { Check } from 'lucide-react';

export function StatusBadge({ status }: { status: any }) {
  const active = status === 'Ativa';

  return (
    <span
      className={[
        'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[8px] font-bold',
        active ? 'bg-[#f3e9e4] text-[#8f7165]' : 'bg-[#f5f1ee] text-[#b4a098]',
      ].join(' ')}
    >
      {active && <Check size={9} />}

      {status}
    </span>
  );
}
