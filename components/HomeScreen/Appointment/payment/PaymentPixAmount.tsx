import { QrCode } from 'lucide-react';

type PaymentPixAmountProps = {
  amount: number;
};

export function PaymentPixAmount({ amount }: PaymentPixAmountProps) {
  return (
    <div className="relative mt-5 overflow-hidden rounded-[24px] bg-[#463b37] px-5 py-5 text-white shadow-[0_18px_40px_-25px_rgba(64,57,54,.8)]">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.05]" />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Total do agendamento
          </p>

          <p className="mt-1 text-[30px] font-bold tracking-[-0.04em]">{amount}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
          <QrCode className="h-5 w-5 text-white/80" />
        </div>
      </div>
    </div>
  );
}
