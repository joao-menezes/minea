import { CreditCard, DollarSign, TrendingUp, Wallet } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';

type BestDay = {
  date: Date;
  value: number;
} | null;

type PaymentMethod = {
  method: string;
  percentage: number;
};

type Props = {
  bestDay: BestDay;
  paymentMethods: PaymentMethod[];
};

function formatBestDay(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function getPercentage(methods: PaymentMethod[], method: string) {
  return methods.find((item) => item.method === method)?.percentage ?? 0;
}

export function FinanceInsights({ bestDay, paymentMethods }: Props) {
  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-2">
      <section className="relative min-h-[180px] overflow-hidden rounded-[30px] bg-[#ead7cd] p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.55),transparent_28%)]" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#a98d81]">
              Melhor resultado
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 text-[#9b7c6e]">
              <TrendingUp size={14} />
            </div>
          </div>

          <div className="mt-7">
            {bestDay ? (
              <>
                <p className="font-display text-[25px] capitalize text-[#6b5850]">
                  {formatBestDay(bestDay.date)}
                </p>

                <p className="mt-1 text-[10px] text-[#a48a7f]">Seu dia de maior faturamento.</p>

                <span className="mt-4 inline-flex rounded-full bg-white/40 px-3 py-1.5 text-[9px] font-bold text-[#8f7165]">
                  {formatCurrency(bestDay.value)}
                </span>
              </>
            ) : (
              <p className="text-sm text-[#a48a7f]">Nenhum faturamento registrado.</p>
            )}
          </div>
        </div>
      </section>

      <section className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-white/85 p-6 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
          Recebimentos
        </p>

        <h2 className="mt-2 font-display text-[25px] text-[#6b5850]">Formas de pagamento</h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Payment
            icon={CreditCard}
            label="Cartão"
            value={getPercentage(paymentMethods, 'credit_card')}
          />

          <Payment icon={Wallet} label="Pix" value={getPercentage(paymentMethods, 'pix')} />

          <Payment
            icon={DollarSign}
            label="Dinheiro"
            value={getPercentage(paymentMethods, 'cash')}
          />
        </div>
      </section>
    </section>
  );
}

function Payment({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[18px] bg-[#f8f1ed] p-3 text-center">
      <Icon size={16} className="mx-auto text-[#a98d81]" />

      <p className="mt-2 text-[9px] font-bold text-[#80685e]">{label}</p>

      <p className="mt-1 text-[12px] font-bold text-[#6b5850]">{value}%</p>
    </div>
  );
}
