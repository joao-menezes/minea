import { Check } from 'lucide-react';

type PaymentPixSuccessProps = {
  onConfirmed?: () => void;
};

export function PaymentPixSuccess({ onConfirmed }: PaymentPixSuccessProps) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#f1f6ef]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f0df]">
          <Check className="h-7 w-7 text-[#62865b]" strokeWidth={2.5} />
        </div>
      </div>

      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#78956f]">
        Pagamento confirmado
      </p>

      <h2 className="mt-2 text-4xl font-[var(--font-cormorant)] font-semibold tracking-[-0.03em] text-[#403936]">
        Tudo certo ✨
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#817672]">
        Seu pagamento foi confirmado e seu horário na Minea está reservado.
      </p>

      <button
        type="button"
        onClick={onConfirmed}
        className="mt-8 w-full rounded-2xl bg-[#403936] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(64,57,54,.6)] transition hover:-translate-y-0.5 hover:bg-[#514945]"
      >
        Ver meu agendamento
      </button>
    </div>
  );
}
