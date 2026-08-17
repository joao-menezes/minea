import type { FinancialReport, FinancialTransaction } from '@/types/financial';

export interface FinancialRepository {
  findTransactions(params: { startDate?: Date; endDate?: Date }): Promise<FinancialTransaction[]>;
}

export class FinancialService {
  constructor(private readonly repository: FinancialRepository) {}

  async getReport(startDate?: Date, endDate?: Date): Promise<FinancialReport> {
    const start = startDate ?? this.getStartOfMonth(new Date());
    const end = endDate ?? this.getEndOfMonth(new Date());

    const transactions = await this.repository.findTransactions({
      startDate: start,
      endDate: end,
    });

    const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income');

    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === 'expense',
    );

    const revenue = incomeTransactions.reduce((total, transaction) => total + transaction.value, 0);

    const expenses = expenseTransactions.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const profit = revenue - expenses;

    const appointmentsData = incomeTransactions.map((transaction) => ({
      date: transaction.date,
      client: transaction.client ?? 'Cliente não informado',
      service: transaction.description || 'Serviço não informado',
      value: transaction.value,
      status: 'Concluído',
    }));

    const appointments = appointmentsData.length;

    const averageTicket = appointments > 0 ? revenue / appointments : 0;

    return {
      period: {
        startDate: start,
        endDate: end,
        label: this.formatPeriod(start, end),
      },

      revenue,
      expenses,
      profit,

      appointments,
      averageTicket,

      transactions,

      monthlyRevenue: [],

      appointmentsData,
    };
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  private formatPeriod(start: Date, end: Date): string {
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
}
