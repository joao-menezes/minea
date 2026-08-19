import { Check, X } from 'lucide-react';

type StatusBadgeProps = {
  status: boolean;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[8px] font-bold',
        status ? 'bg-[#f3e9e4] text-[#8f7165]' : 'bg-[#f5f1ee] text-[#b4a098]',
      ].join(' ')}
    >
      {status ? <Check size={9} /> : <X size={9} />}

      {status ? 'Ativo' : 'Inativo'}
    </span>
  );
}
