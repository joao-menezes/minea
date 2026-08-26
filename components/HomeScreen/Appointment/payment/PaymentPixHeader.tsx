import { ArrowLeft, ShieldCheck } from 'lucide-react';

type PaymentPixHeaderProps = {
  onBack: () => void;
};

export function PaymentPixHeader({ onBack }: PaymentPixHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f1ee] text-[#62544e] transition hover:bg-[#eee7e3]"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#ad958b]">Pagamento</p>

        <h2 className="mt-0.5 text-[28px] font-[var(--font-cormorant)] font-semibold leading-none tracking-[-0.02em] text-[#403936]">
          Pague com PIX
        </h2>
      </div>

      <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f1ee]">
        <ShieldCheck className="h-4 w-4 text-[#92796f]" />
      </div>
    </div>
  );
}
