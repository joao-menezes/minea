import { MoreHorizontal, TrendingUp } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';
import type { FinancialReport } from '@/types';

const CHART_MAX_VALUE = 20000;

type Props = {
  report: FinancialReport;
};

export function RevenueChart({ report }: Props) {
  const lastMonthIndex = report.monthlyRevenue.length - 1;

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur lg:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
            Evolução
          </p>

          <h2 className="mt-2 font-display text-[27px] text-[#6b5850]">Faturamento</h2>

          <div className="mt-3 flex items-center gap-2">
            <span className="font-display text-[25px] text-[#80685e]">
              {formatCurrency(report.revenue)}
            </span>

            <span className="flex items-center gap-1 rounded-full bg-[#edf4ee] px-2 py-1 text-[8px] font-bold text-[#66806d]">
              <TrendingUp size={10} />
              12,4%
            </span>
          </div>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee3dc] text-[#b49b90]">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="relative mt-9 h-[230px]">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[20, 15, 10, 5, 0].map((value) => (
            <div key={value} className="flex items-center gap-3">
              <span className="w-10 text-right text-[8px] text-[#c8b5ac]">
                {value === 0 ? '0' : `${value}k`}
              </span>

              <div className="h-px flex-1 bg-[#f3ebe7]" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-[52px] right-0 top-0 flex items-end justify-around gap-4">
          {report.monthlyRevenue.map((item, index) => {
            const current = index === lastMonthIndex;

            const height = Math.min((item.value / CHART_MAX_VALUE) * 100, 100);

            return (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="flex h-[190px] w-full max-w-[52px] items-end">
                  <div
                    className={[
                      `relative w-full rounded-t-[14px]`,
                      current ? 'bg-[#8a6f63]' : 'bg-[#eadbd4]',
                    ].join(' ')}
                    style={{
                      height: `${height}%`,
                    }}
                  >
                    {current && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-[#8a6f63] px-2 py-1 text-[8px] font-bold text-white">
                        {formatCurrency(item.value)}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[9px] font-bold text-[#c1aaa0]">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
