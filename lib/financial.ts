import type { FinancialReportData } from '@/lib/exportFinancialReport';
import { supabase } from '@/lib/supabase/client';
import type {
  FinancialAppointmentData,
  FinancialMonthlyRevenue,
  FinancialPaymentMethod,
  FinancialReport,
  FinancialTransaction,
} from '@/types/financial';

export type BestRevenueDay = {
  date: Date;
  value: number;
};

export type PaymentMethodPercentage = {
  method: FinancialPaymentMethod;
  total: number;
  percentage: number;
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export async function getFinancialReport(
  startDate?: Date,
  endDate?: Date,
): Promise<FinancialReport> {
  const start = startDate ?? getStartOfMonth(new Date());
  const end = endDate ?? getEndOfMonth(new Date());

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      id,
      date,
      description,
      client,
      method,
      category,
      value,
      type,
      appointment_id,
      client_id,
      service_id
    `,
    )
    .gte('date', start.toISOString())
    .lte('date', end.toISOString())
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar dados financeiros: ${error.message}`);
  }

  const transactions: FinancialTransaction[] = (data ?? []).map((transaction) => ({
    id: String(transaction.id),
    date: new Date(transaction.date).toISOString(),
    description: String(transaction.description ?? ''),
    client: String(transaction.client ?? ''),
    method: normalizePaymentMethod(transaction.method),
    category: String(transaction.category ?? ''),
    value: Number(transaction.value ?? 0),
    type: transaction.type === 'expense' ? 'expense' : 'income',

    appointmentId: transaction.appointment_id ? String(transaction.appointment_id) : undefined,

    clientId: transaction.client_id ? String(transaction.client_id) : undefined,

    serviceId: transaction.service_id ? String(transaction.service_id) : undefined,
  }));

  const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income');

  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  const revenue = sumTransactions(incomeTransactions);
  const expenses = sumTransactions(expenseTransactions);
  const profit = revenue - expenses;

  const appointments = incomeTransactions.length;

  const averageTicket = appointments > 0 ? revenue / appointments : 0;

  const monthlyRevenue = await getMonthlyRevenue();

  const appointmentsData: FinancialAppointmentData[] = incomeTransactions.map((transaction) => ({
    date: transaction.date,
    client: transaction.client ?? 'Cliente não informado',
    service: transaction.description || 'Serviço não informado',
    value: transaction.value,
    status: 'Concluído',
  }));

  return {
    period: {
      startDate: start,
      endDate: end,
      label: formatPeriod(start, end),
    },

    revenue,
    expenses,
    profit,

    appointments,
    averageTicket,

    transactions,
    monthlyRevenue,
    appointmentsData,
  };
}

export function getBestRevenueDay(transactions: FinancialTransaction[]): BestRevenueDay | null {
  const dailyRevenue = new Map<string, BestRevenueDay>();

  for (const transaction of transactions) {
    if (transaction.type !== 'income') {
      continue;
    }

    const date = new Date(transaction.date);
    const key = formatDateKey(date);

    const current = dailyRevenue.get(key);

    if (current) {
      current.value += transaction.value;
      continue;
    }

    dailyRevenue.set(key, {
      date,
      value: transaction.value,
    });
  }

  const days = Array.from(dailyRevenue.values());

  if (days.length === 0) {
    return null;
  }

  return days.reduce((best, current) => (current.value > best.value ? current : best));
}

export function getPaymentMethodPercentages(
  transactions: FinancialTransaction[],
): PaymentMethodPercentage[] {
  const totals = new Map<FinancialPaymentMethod, number>();

  for (const transaction of transactions) {
    if (transaction.type !== 'income') {
      continue;
    }

    totals.set(transaction.method, (totals.get(transaction.method) ?? 0) + transaction.value);
  }

  const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return [];
  }

  return Array.from(totals.entries())
    .map(([method, value]) => ({
      method,
      total: value,
      percentage: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

export function getProfitMargin(report: FinancialReport): number {
  if (report.revenue <= 0) {
    return 0;
  }

  return (report.profit / report.revenue) * 100;
}

export function toFinancialReportData(report: FinancialReport): FinancialReportData {
  return {
    period: report.period.label,

    revenue: report.revenue,
    expenses: report.expenses,
    profit: report.profit,

    averageTicket: report.averageTicket,
    appointments: report.appointments,

    transactions: report.transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      client: transaction.client ?? '',
      method: transaction.method,
      category: transaction.category,
      value: transaction.value,
      type: transaction.type,
    })),

    monthlyRevenue: report.monthlyRevenue,

    appointmentsData: report.appointmentsData,
  };
}

async function getMonthlyRevenue(): Promise<FinancialMonthlyRevenue[]> {
  const today = new Date();

  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1, 0, 0, 0, 0);

  const { data, error } = await supabase
    .from('transactions')
    .select('date, value, type')
    .eq('type', 'income')
    .gte('date', start.toISOString())
    .lte('date', today.toISOString());

  if (error) {
    throw new Error(`Erro ao buscar faturamento mensal: ${error.message}`);
  }

  const months = createLastSixMonths();

  const totals = new Map<string, number>();

  for (const transaction of data ?? []) {
    const date = new Date(transaction.date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    totals.set(key, (totals.get(key) ?? 0) + Number(transaction.value ?? 0));
  }

  return months.map((month) => ({
    month: month.label,
    value: totals.get(`${month.year}-${month.month}`) ?? 0,
  }));
}

function createLastSixMonths() {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),

      label: date
        .toLocaleDateString('pt-BR', {
          month: 'short',
        })
        .replace('.', ''),
    };
  });
}

function normalizePaymentMethod(method: unknown): FinancialPaymentMethod {
  const value = String(method ?? '')
    .trim()
    .toLowerCase();

  switch (value) {
    case 'pix':
    case 'pix_payment':
      return 'pix';

    case 'credit_card':
    case 'credit':
    case 'credito':
    case 'crédito':
    case 'card':
    case 'cartao':
    case 'cartão':
      return 'credit_card';

    case 'debit_card':
    case 'debit':
    case 'debito':
    case 'débito':
      return 'debit_card';

    case 'cash':
    case 'money':
    case 'dinheiro':
      return 'cash';

    case 'transfer':
    case 'ted':
    case 'doc':
    case 'transferencia':
    case 'transferência':
      return 'transfer';

    default:
      return 'other';
  }
}

function sumTransactions(transactions: FinancialTransaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.value, 0);
}

function formatDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function formatPeriod(start: Date, end: Date): string {
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return start.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }

  return `${start.toLocaleDateString('pt-BR')} — ${end.toLocaleDateString('pt-BR')}`;
}
