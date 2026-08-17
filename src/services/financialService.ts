import type { FinancialReport, FinancialTransaction } from '@/types/financial';

export interface FinancialRepository {
  findTransactions(params: { startDate?: Date; endDate?: Date }): Promise<FinancialTransaction[]>;
}

export class FinancialService {
  constructor(private readonly repository: FinancialRepository) {}

  async getReport(startDate?: Date, endDate?: Date): Promise<FinancialReport> {
    const transactions = await this.repository.findTransactions({
      startDate,
      endDate,
    });

    const revenue = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.value, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.value, 0);

    const profit = revenue - expenses;

    const appointmentsData = transactions
      .filter((transaction) => transaction.type === 'income')
      .map((transaction) => ({
        date: transaction.date,
        title: transaction.description,
        price: transaction.value,
      }));

    return {
      period: {
        startDate,
        endDate,
      },
      revenue,
      expenses,
      profit,
      appointments: appointmentsData.length,
      averageTicket: appointmentsData.length > 0 ? revenue / appointmentsData.length : 0,

      appointmentsData,
    };
  }
}
