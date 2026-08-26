import { Clock3, Loader2 } from 'lucide-react';

type PaymentPixStatusProps = {
  remaining: string;
  progress: number;
};

export function PaymentPixStatus({ remaining, progress }: PaymentPixStatusProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-[20px] border border-[#eee4df] bg-[#f8f3f0]">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[#95786d]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#514742]">Aguardando pagamento</p>

          <p className="mt-0.5 text-[10px] text-[#95837c]">Estamos verificando seu PIX</p>
        </div>

        {remaining && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 shadow-sm">
            <Clock3 className="h-3.5 w-3.5 text-[#8e756b]" />

            <span className="font-mono text-[11px] font-bold text-[#6f5a52]">{remaining}</span>
          </div>
        )}
      </div>

      <div className="h-1 bg-[#eee5e1]">
        <div
          className="h-full rounded-full bg-[#a98b80] transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
