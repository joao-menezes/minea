'use client';

import { useMemo, useState } from 'react';

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileDown,
  MoreHorizontal,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { AdminShell } from '@/components/admin/AdminShell';
import { FinancialStat } from '@/components/admin/financial/FinancialStat';
import { MoneyBreakdown } from '@/components/admin/financial/MoneyBreakdown';
import { PaymentMethod } from '@/components/admin/financial/PaymentMethod';
import { exportFinancialReport } from '@/lib/exportFinancialReport';
import {
  formatCurrency,
  getBestRevenueDay,
  getFinancialReport,
  getPaymentMethodPercentages,
  getProfitMargin,
  toFinancialReportData,
} from '@/lib/financial';

type Period = 'Hoje' | '7 dias' | 'Este mês' | 'Últimos 6 meses';

const PERIODS: Period[] = ['Hoje', '7 dias', 'Este mês', 'Últimos 6 meses'];

const CHART_MAX_VALUE = 20_000;

function formatTransactionDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function formatBestDay(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function getPaymentPercentage(
  methods: ReturnType<typeof getPaymentMethodPercentages>,
  method: string,
) {
  return methods.find((item) => item.method === method)?.percentage ?? 0;
}

export default async function FinanceiroPage() {
  const [period, setPeriod] = useState<Period>('Este mês');

  const report = await getFinancialReport();

  const margin = useMemo(() => getProfitMargin(report), [report]);

  const bestDay = useMemo(() => getBestRevenueDay(report.transactions), [report.transactions]);

  const paymentMethods = useMemo(
    () => getPaymentMethodPercentages(report.transactions),
    [report.transactions],
  );

  const handleExport = () => {
    const data = toFinancialReportData(report);

    exportFinancialReport(data);
  };

  const lastMonthIndex = report.monthlyRevenue.length - 1;

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        {/* Background decoration */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

          <div className="absolute -left-40 top-[40%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

          <div className="absolute bottom-0 right-[18%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
                  Minea
                </span>

                <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
                  Gestão financeira
                </span>
              </div>

              <h1 className="mt-3 font-display text-[32px] leading-none tracking-[-0.03em] text-[#6b5850] lg:text-[39px]">
                Financeiro
              </h1>

              <p className="mt-3 text-xs text-[#a48a7f]">
                Acompanhe o desempenho financeiro da sua clínica.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="group flex h-11 items-center gap-2 rounded-[16px] border border-[#eaded8] bg-white/80 px-4 text-[11px] font-bold text-[#80685e] shadow-[0_10px_25px_-18px_rgba(64,46,40,.3)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                <FileDown
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                Exportar PDF
              </button>

              <button
                type="button"
                className="group flex h-11 items-center gap-3 rounded-[16px] bg-[#8a6f63] px-4 text-[11px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition-all hover:-translate-y-0.5 hover:bg-[#7c6156]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-white/15">
                  <Plus size={15} />
                </span>
                Nova movimentação
              </button>
            </div>
          </header>

          <section className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {PERIODS.map((item) => {
                const active = period === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={[
                      'rounded-full px-4 py-2 text-[9px] font-bold transition-all',
                      active
                        ? 'bg-[#8a6f63] text-white shadow-[0_10px_20px_-13px_rgba(138,111,99,.6)]'
                        : 'border border-[#eee3dc] bg-white/70 text-[#aa9085] hover:bg-white',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-full border border-[#eee3dc] bg-white/70 px-4 py-2 text-[9px] font-bold text-[#aa9085] backdrop-blur transition-all hover:bg-white"
            >
              <CalendarDays size={12} />

              {report.period.label}

              <ChevronRight size={12} />
            </button>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <FinancialStat
              label="Faturamento"
              value={formatCurrency(report.revenue)}
              description="Total recebido no período"
              trend="+12,4%"
              icon={TrendingUp}
            />

            <FinancialStat
              label="Despesas"
              value={formatCurrency(report.expenses)}
              description="Custos operacionais"
              trend="-6,2%"
              icon={TrendingDown}
              positive={false}
            />

            <FinancialStat
              label="Lucro estimado"
              value={formatCurrency(report.profit)}
              description="Receita menos despesas"
              trend="+16,8%"
              icon={Wallet}
            />

            <FinancialStat
              label="Ticket médio"
              value={formatCurrency(report.averageTicket)}
              description={`${report.appointments} atendimentos`}
              trend="+4,6%"
              icon={Receipt}
            />
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                    Evolução
                  </p>

                  <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                    Faturamento
                  </h2>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-display text-[25px] tracking-[-0.02em] text-[#80685e]">
                      {formatCurrency(report.revenue)}
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-[#edf4ee] px-2 py-1 text-[8px] font-bold text-[#66806d]">
                      <TrendingUp size={10} />
                      12,4%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Mais opções"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee3dc] bg-white text-[#b49b90] transition-all hover:bg-[#faf4f1]"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mt-9">
                <div className="relative h-[230px]">
                  {/* Grid */}
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

                  {/* Bars */}
                  <div className="absolute bottom-0 left-[52px] right-0 top-0 flex items-end justify-around gap-4">
                    {report.monthlyRevenue.map((item, index) => {
                      const current = index === lastMonthIndex;

                      const height = Math.min((item.value / CHART_MAX_VALUE) * 100, 100);

                      return (
                        <div
                          key={item.month}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                        >
                          <div className="relative flex h-[190px] w-full max-w-[52px] items-end">
                            <div
                              className={[
                                'w-full rounded-t-[14px] transition-all',
                                current ? 'bg-[#8a6f63]' : 'bg-[#eadbd4] hover:bg-[#d9c4ba]',
                              ].join(' ')}
                              style={{
                                height: `${height}%`,
                              }}
                            >
                              {current && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#8a6f63] px-2.5 py-1 text-[8px] font-bold text-white shadow-sm">
                                  {formatCurrency(item.value)}
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={[
                              'text-[9px] font-bold',
                              current ? 'text-[#80685e]' : 'text-[#c1aaa0]',
                            ].join(' ')}
                          >
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* BREAKDOWN                                                     */}
            {/* ============================================================ */}

            <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                Resumo
              </p>

              <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                Entradas & saídas
              </h2>

              <div className="mt-7 space-y-4">
                <MoneyBreakdown
                  icon={ArrowDownRight}
                  label="Entradas"
                  description="Serviços realizados"
                  value={formatCurrency(report.revenue)}
                  positive
                />

                <MoneyBreakdown
                  icon={ArrowUpRight}
                  label="Despesas"
                  description="Custos operacionais"
                  value={formatCurrency(report.expenses)}
                />

                <div className="h-px bg-[#f1e8e2]" />

                <div className="rounded-[21px] bg-[#f6ede8] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b49b90]">
                        Resultado
                      </p>

                      <p className="mt-1 font-display text-[25px] tracking-[-0.02em] text-[#6b5850]">
                        {formatCurrency(report.profit)}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/70 text-[#a98d81]">
                      <DollarSign size={18} strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#a98d81]"
                      style={{
                        width: `${Math.min(Math.max(margin, 0), 100)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[9px] text-[#b49b90]">
                    {margin.toFixed(0)}% da receita permanece após despesas.
                  </p>
                </div>
              </div>
            </section>
          </section>

          {/* ================================================================ */}
          {/* TRANSACTIONS                                                     */}
          {/* ================================================================ */}

          <section className="mt-5 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Movimentações
                </p>

                <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                  Transações recentes
                </h2>
              </div>

              <button
                type="button"
                className="flex w-fit items-center gap-1.5 text-[10px] font-bold text-[#a98d81] transition-colors hover:text-[#80655b]"
              >
                Ver todas
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="mt-6 divide-y divide-[#f1e8e2]">
              {report.transactions.slice(0, 5).map((transaction) => {
                const income = transaction.type === 'income';

                return (
                  <div
                    key={transaction.id}
                    className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div
                      className={[
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]',
                        income ? 'bg-[#edf4ee] text-[#66806d]' : 'bg-[#f8eeea] text-[#a68173]',
                      ].join(' ')}
                    >
                      {income ? (
                        <ArrowDownRight size={16} strokeWidth={1.7} />
                      ) : (
                        <ArrowUpRight size={16} strokeWidth={1.7} />
                      )}
                    </div>

                    <div className="hidden w-14 shrink-0 sm:block">
                      <p className="text-[9px] font-bold text-[#80685e]">
                        {formatTransactionDate(transaction.date)}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-[#6b5850]">
                        {transaction.description}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="truncate text-[9px] text-[#b49b90]">
                          {transaction.client}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#d8c3ba]" />

                        <span className="text-[9px] text-[#b49b90]">{transaction.method}</span>
                      </div>
                    </div>

                    <span className="hidden rounded-full bg-[#f7f0ec] px-3 py-1.5 text-[8px] font-bold text-[#a98d81] md:block">
                      {transaction.category}
                    </span>

                    <div className="text-right">
                      <p
                        className={[
                          'text-[11px] font-bold',
                          income ? 'text-[#66806d]' : 'text-[#a68173]',
                        ].join(' ')}
                      >
                        {income ? '+' : '-'}
                        {formatCurrency(transaction.value)}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Ver transação"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#d0beb5] transition-all hover:bg-[#faf4f1] hover:text-[#a98d81]"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================================ */}
          {/* INSIGHTS                                                         */}
          {/* ================================================================ */}

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Best day */}
            <section className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-white/30 bg-[#e8d4c9] p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.55),transparent_28%),linear-gradient(135deg,#f7eee9_0%,#ead7cd_52%,#dfc5b9_100%)]" />

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/40 bg-white/15" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#a98d81]">
                    Melhor resultado
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur">
                    <TrendingUp size={14} />
                  </div>
                </div>

                <div className="mt-7">
                  {bestDay ? (
                    <>
                      <p className="font-display text-[25px] capitalize tracking-[-0.03em] text-[#6b5850]">
                        {formatBestDay(bestDay.date)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#a48a7f]">
                        Seu dia de maior faturamento.
                      </p>

                      <div className="mt-4 inline-flex rounded-full bg-white/40 px-3 py-1.5 text-[9px] font-bold text-[#8f7165] backdrop-blur">
                        {formatCurrency(bestDay.value)}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#a48a7f]">Nenhum faturamento registrado.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f4e9e3]/60 blur-2xl" />

              <div className="relative">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Recebimentos
                </p>

                <h2 className="mt-2 font-display text-[25px] tracking-[-0.02em] text-[#6b5850]">
                  Formas de pagamento
                </h2>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <PaymentMethod
                    icon={CreditCard}
                    label="Cartão"
                    percentage={getPaymentPercentage(paymentMethods, 'card')}
                  />

                  <PaymentMethod
                    icon={Wallet}
                    label="Pix"
                    percentage={getPaymentPercentage(paymentMethods, 'pix')}
                  />

                  <PaymentMethod
                    icon={DollarSign}
                    label="Dinheiro"
                    percentage={getPaymentPercentage(paymentMethods, 'cash')}
                  />
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}
