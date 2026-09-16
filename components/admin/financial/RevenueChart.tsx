import { useEffect, useRef, useState } from 'react';

import { FileDown, MoreHorizontal, RefreshCw } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';
import type { FinancialReport } from '@/types';

type Props = {
  report: FinancialReport;
  onExport?: () => void;
  onRefresh?: () => void;
};

export function RevenueChart({ report, onExport, onRefresh }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  const lastMonthIndex = report.monthlyRevenue.length - 1;
  const maxValue = Math.max(...report.monthlyRevenue.map((item) => item.value), 0);
  const chartMaxValue = getChartMaxValue(maxValue);
  const gridValues = [1, 0.75, 0.5, 0.25, 0];

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

          </div>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee3dc] text-[#b49b90] transition hover:bg-[#faf6f3]"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 z-10 w-48 rounded-[16px] border border-[#eee3dc] bg-white p-1.5 shadow-[0_18px_40px_-15px_rgba(67,47,40,.35)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onRefresh?.();
                }}
                className="flex w-full items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-left text-[11px] font-medium text-[#66534c] transition hover:bg-[#faf4f1]"
              >
                <RefreshCw size={13} />
                Atualizar dados
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onExport?.();
                }}
                className="flex w-full items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-left text-[11px] font-medium text-[#66534c] transition hover:bg-[#faf4f1]"
              >
                <FileDown size={13} />
                Exportar PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-9 h-[230px]">
        <div className="absolute inset-0 flex flex-col justify-between">
          {gridValues.map((ratio) => (
            <div key={ratio} className="flex items-center gap-3">
              <span className="w-10 text-right text-[8px] text-[#c8b5ac]">
                {formatChartAxisValue(chartMaxValue * ratio)}
              </span>

              <div className="h-px flex-1 bg-[#f3ebe7]" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-[52px] right-0 top-0 flex items-end justify-around gap-4">
          {report.monthlyRevenue.map((item, index) => {
            const current = index === lastMonthIndex;

            const height = maxValue > 0 ? Math.min((item.value / chartMaxValue) * 100, 100) : 0;

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

function getChartMaxValue(value: number) {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.max(Math.floor(Math.log10(value)) - 1, 0);

  return Math.ceil(value / magnitude) * magnitude;
}

function formatChartAxisValue(value: number) {
  if (value === 0) return '0';
  if (value >= 1000) return `${Math.round(value / 1000)}k`;

  return String(Math.round(value));
}
