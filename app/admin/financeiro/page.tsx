'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  DollarSign,
  Download,
  MoreHorizontal,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
  FileDown,
} from 'lucide-react'

import { AdminShell } from '@/components/admin/AdminShell'
import { exportFinancialReport } from '@/app/lib/exportFinancialReport'

const TRANSACTIONS = [
  {
    date: '17 ago',
    description: 'Design + Henna',
    client: 'Ana Silva',
    category: 'Serviço',
    method: 'Pix',
    value: 'R$ 85,00',
    type: 'income',
  },
  {
    date: '17 ago',
    description: 'Design + Tintura',
    client: 'Mariana Costa',
    category: 'Serviço',
    method: 'Cartão',
    value: 'R$ 120,00',
    type: 'income',
  },
  {
    date: '16 ago',
    description: 'Manutenção de tintura',
    client: 'Camila Souza',
    category: 'Serviço',
    method: 'Pix',
    value: 'R$ 75,00',
    type: 'income',
  },
  {
    date: '16 ago',
    description: 'Compra de materiais',
    client: 'Fornecedor',
    category: 'Despesa',
    method: 'Cartão',
    value: 'R$ 320,00',
    type: 'expense',
  },
  {
    date: '15 ago',
    description: 'Design de Sobrancelha',
    client: 'Juliana Alves',
    category: 'Serviço',
    method: 'Dinheiro',
    value: 'R$ 55,00',
    type: 'income',
  },
]

const MONTHS = [
  { month: 'Mar', value: 11200 },
  { month: 'Abr', value: 12800 },
  { month: 'Mai', value: 13900 },
  { month: 'Jun', value: 15100 },
  { month: 'Jul', value: 16400 },
  { month: 'Ago', value: 18450 },
]

export default function FinanceiroPage() {
  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />
          <div className="absolute top-[40%] -left-40 h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />
          <div className="absolute bottom-0 right-[18%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          {/* HEADER */}
          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
                onClick={() => {
                  exportFinancialReport({
                    period: 'Agosto de 2026',
                    revenue: 18450,
                    expenses: 4280,
                    profit: 14170,
                    appointments: 82,
                    averageTicket: 225,
                    appointmentsData: [
                      {
                        date: new Date('2026-08-17T09:00:00'),
                        client: 'Ana Silva',
                        service: 'Design + Henna',
                        status: 'Confirmado',
                        value: 120,
                      },
                      {
                        date: new Date('2026-08-17T10:30:00'),
                        client: 'Mariana Costa',
                        service: 'Manutenção de tintura',
                        status: 'Pendente',
                        value: 90,
                      },
                      {
                        date: new Date('2026-08-17T14:00:00'),
                        client: 'Camila Souza',
                        service: 'Design + Tintura',
                        status: 'Confirmado',
                        value: 150,
                      },
                      {
                        date: new Date('2026-08-17T15:30:00'),
                        client: 'Juliana Alves',
                        service: 'Design + Henna',
                        status: 'Confirmado',
                        value: 120,
                      },
                    ],
                  })
                }}
                className="
    group
    flex h-11 items-center gap-2
    rounded-[16px]
    border border-[#eaded8]
    bg-white/80
    px-4
    text-[11px]
    font-bold
    text-[#80685e]
    shadow-[0_10px_25px_-18px_rgba(64,46,40,.3)]
    backdrop-blur
    transition-all
    hover:-translate-y-0.5
    hover:bg-white
  "
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
          </section>

          {/* PERIOD FILTER */}
          <section className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {['Hoje', '7 dias', 'Este mês', 'Últimos 6 meses'].map((period, index) => (
                <button
                  key={period}
                  type="button"
                  className={[
                    'rounded-full px-4 py-2 text-[9px] font-bold transition-all',
                    index === 2
                      ? 'bg-[#8a6f63] text-white shadow-[0_10px_20px_-13px_rgba(138,111,99,.6)]'
                      : 'border border-[#eee3dc] bg-white/70 text-[#aa9085] hover:bg-white',
                  ].join(' ')}
                >
                  {period}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-full border border-[#eee3dc] bg-white/70 px-4 py-2 text-[9px] font-bold text-[#aa9085] backdrop-blur"
            >
              <CalendarDays size={12} />
              Agosto 2026
              <ChevronRight size={12} />
            </button>
          </section>

          {/* STATS */}
          <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <FinancialStat
              label="Faturamento"
              value="R$ 18.450"
              description="Total recebido no mês"
              trend="+12,4%"
              icon={TrendingUp}
              positive
            />

            <FinancialStat
              label="Despesas"
              value="R$ 4.280"
              description="Custos no período"
              trend="-6,2%"
              icon={TrendingDown}
              positive
            />

            <FinancialStat
              label="Lucro estimado"
              value="R$ 14.170"
              description="Receita menos despesas"
              trend="+16,8%"
              icon={Wallet}
              positive
            />

            <FinancialStat
              label="Ticket médio"
              value="R$ 92,25"
              description="Por atendimento"
              trend="+4,6%"
              icon={Receipt}
              positive
            />
          </section>

          {/* MAIN */}
          <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            {/* CHART */}
            <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                    Evolução
                  </p>

                  <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
                    Faturamento mensal
                  </h2>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-display text-[25px] tracking-[-0.02em] text-[#80685e]">
                      R$ 18.450
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-[#edf4ee] px-2 py-1 text-[8px] font-bold text-[#66806d]">
                      <TrendingUp size={10} />
                      12,4%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee3dc] bg-white text-[#b49b90]"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Chart */}
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
                    {MONTHS.map((item) => {
                      const height = (item.value / 20000) * 100

                      return (
                        <div
                          key={item.month}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                        >
                          <div className="relative flex h-[190px] w-full max-w-[52px] items-end">
                            <div
                              className={[
                                'w-full rounded-t-[14px] transition-all',
                                item.month === 'Ago'
                                  ? 'bg-[#8a6f63]'
                                  : 'bg-[#eadbd4] hover:bg-[#d9c4ba]',
                              ].join(' ')}
                              style={{
                                height: `${height}%`,
                              }}
                            >
                              {item.month === 'Ago' && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#8a6f63] px-2.5 py-1 text-[8px] font-bold text-white shadow-sm">
                                  R$ 18,4k
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={[
                              'text-[9px] font-bold',
                              item.month === 'Ago' ? 'text-[#80685e]' : 'text-[#c1aaa0]',
                            ].join(' ')}
                          >
                            {item.month}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* BREAKDOWN */}
            <div className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
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
                  value="R$ 18.450"
                  positive
                />

                <MoneyBreakdown
                  icon={ArrowUpRight}
                  label="Despesas"
                  description="Custos operacionais"
                  value="R$ 4.280"
                />

                <div className="h-px bg-[#f1e8e2]" />

                <div className="rounded-[21px] bg-[#f6ede8] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b49b90]">
                        Resultado
                      </p>

                      <p className="mt-1 font-display text-[25px] tracking-[-0.02em] text-[#6b5850]">
                        R$ 14.170
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/70 text-[#a98d81]">
                      <DollarSign size={18} strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-[#a98d81]" style={{ width: '77%' }} />
                  </div>

                  <p className="mt-2 text-[9px] text-[#b49b90]">
                    77% da receita permanece após despesas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TRANSACTIONS */}
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
              {TRANSACTIONS.map((transaction) => (
                <div
                  key={`${transaction.date}-${transaction.description}-${transaction.client}`}
                  className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  {/* Icon */}
                  <div
                    className={[
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]',
                      transaction.type === 'income'
                        ? 'bg-[#edf4ee] text-[#66806d]'
                        : 'bg-[#f8eeea] text-[#a68173]',
                    ].join(' ')}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowDownRight size={16} strokeWidth={1.7} />
                    ) : (
                      <ArrowUpRight size={16} strokeWidth={1.7} />
                    )}
                  </div>

                  {/* Date */}
                  <div className="hidden w-14 shrink-0 sm:block">
                    <p className="text-[9px] font-bold text-[#80685e]">{transaction.date}</p>
                  </div>

                  {/* Info */}
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

                  {/* Category */}
                  <span className="hidden rounded-full bg-[#f7f0ec] px-3 py-1.5 text-[8px] font-bold text-[#a98d81] md:block">
                    {transaction.category}
                  </span>

                  {/* Value */}
                  <div className="text-right">
                    <p
                      className={[
                        'text-[11px] font-bold',
                        transaction.type === 'income' ? 'text-[#66806d]' : 'text-[#a68173]',
                      ].join(' ')}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.value}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#d0beb5] transition-all hover:bg-[#faf4f1] hover:text-[#a98d81]"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* BOTTOM INSIGHTS */}
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Best day */}
            <div className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-white/30 bg-[#e8d4c9] p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.35)]">
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
                  <p className="font-display text-[31px] tracking-[-0.03em] text-[#6b5850]">
                    Sexta-feira
                  </p>

                  <p className="mt-1 text-[10px] text-[#a48a7f]">Seu dia de maior faturamento.</p>

                  <div className="mt-4 inline-flex rounded-full bg-white/40 px-3 py-1.5 text-[9px] font-bold text-[#8f7165] backdrop-blur">
                    R$ 2.840 em média
                  </div>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="relative min-h-[180px] overflow-hidden rounded-[30px] border border-[#f1e8e2] bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f4e9e3]/60 blur-2xl" />

              <div className="relative">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
                  Recebimentos
                </p>

                <h2 className="mt-2 font-display text-[25px] tracking-[-0.02em] text-[#6b5850]">
                  Formas de pagamento
                </h2>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <PaymentMethod icon={CreditCard} label="Cartão" percentage="42%" />

                  <PaymentMethod icon={Wallet} label="Pix" percentage="38%" />

                  <PaymentMethod icon={DollarSign} label="Dinheiro" percentage="20%" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

type FinancialStatProps = {
  label: string
  value: string
  description: string
  trend: string
  icon: LucideIcon
  positive?: boolean
}

function FinancialStat({ label, value, description, trend, icon: Icon }: FinancialStatProps) {
  return (
    <div className="group rounded-[25px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-30px_rgba(64,46,40,.28)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-28px_rgba(64,46,40,.32)] lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f6ede8] text-[#ab8f83] transition-transform group-hover:scale-[1.03]">
          <Icon size={16} strokeWidth={1.7} />
        </div>

        <span className="rounded-full border border-[#dce9df] bg-[#edf4ee] px-2.5 py-1 text-[8px] font-bold text-[#66806d]">
          {trend}
        </span>
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
        {label}
      </p>

      <p className="mt-1 font-display text-[27px] tracking-[-0.02em] text-[#6b5850]">{value}</p>

      <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
    </div>
  )
}

type MoneyBreakdownProps = {
  icon: LucideIcon
  label: string
  description: string
  value: string
  positive?: boolean
}

function MoneyBreakdown({ icon: Icon, label, description, value, positive }: MoneyBreakdownProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]',
          positive ? 'bg-[#edf4ee] text-[#66806d]' : 'bg-[#f8eeea] text-[#a68173]',
        ].join(' ')}
      >
        <Icon size={17} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-[#80685e]">{label}</p>

        <p className="mt-1 text-[9px] text-[#b49b90]">{description}</p>
      </div>

      <p
        className={['text-[12px] font-bold', positive ? 'text-[#66806d]' : 'text-[#a68173]'].join(
          ' ',
        )}
      >
        {positive ? '+' : '-'}
        {value}
      </p>
    </div>
  )
}

type PaymentMethodProps = {
  icon: LucideIcon
  label: string
  percentage: string
}

function PaymentMethod({ icon: Icon, label, percentage }: PaymentMethodProps) {
  return (
    <div className="rounded-[18px] bg-[#f8f1ed] p-3 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[#a98d81]">
        <Icon size={15} strokeWidth={1.7} />
      </div>

      <p className="mt-2 text-[9px] font-bold text-[#80685e]">{label}</p>

      <p className="mt-1 font-display text-[18px] text-[#6b5850]">{percentage}</p>
    </div>
  )
}
