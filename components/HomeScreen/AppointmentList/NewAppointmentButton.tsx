import { ArrowUpRight, Plus } from 'lucide-react';

type NewAppointmentButtonProps = {
  onClick: () => void;
  variant: 'primary' | 'bottom';
};

export function NewAppointmentButton({ onClick, variant }: NewAppointmentButtonProps) {
  if (variant === 'bottom') {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-md bg-gradient-to-t from-[#faf6f3] via-[#faf6f3]/95 to-transparent px-5 pb-5 pt-12">
          <button
            type="button"
            onClick={onClick}
            className="pointer-events-auto flex h-[58px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#8a6f63] text-[13px] font-bold text-white shadow-[0_18px_38px_-14px_rgba(138,111,99,.5)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
          >
            <Plus size={18} strokeWidth={2} />
            Novo agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-4 flex h-[58px] w-full items-center justify-between rounded-[20px] bg-[#8a6f63] px-5 text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156] active:scale-[.985]"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/15">
          <Plus size={17} strokeWidth={1.8} />
        </span>

        <span className="text-[13px] font-semibold tracking-[-0.01em]">Novo agendamento</span>
      </span>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
        <ArrowUpRight size={16} strokeWidth={1.7} />
      </span>
    </button>
  );
}
