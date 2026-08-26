import { QrCode } from 'lucide-react';

type PaymentPixErrorProps = {
  onBack: () => void;
};

export function PaymentPixError({ onBack }: PaymentPixErrorProps) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#fdf1ef]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe4e0]">
          <QrCode className="h-7 w-7 text-[#c4776b]" />
        </div>
      </div>

      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#bd776d]">
        Pagamento não concluído
      </p>

      <h2 className="mt-2 text-4xl font-[var(--font-cormorant)] font-semibold tracking-[-0.03em] text-[#403936]">
        Vamos tentar novamente?
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#817672]">
        Não conseguimos confirmar este pagamento.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 w-full rounded-2xl bg-[#403936] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#514945]"
      >
        Voltar para o pagamento
      </button>
    </div>
  );
}
