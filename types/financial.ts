export type FinancialTransactionType = 'income' | 'expense';

export type FinancialPaymentMethod =
  'cash' | 'credit_card' | 'debit_card' | 'pix' | 'transfer' | 'other';

export type FinancialTransaction = {
  id: string;
  type: FinancialTransactionType;
  category: string;
  description: string;
  value: number;
  date: string;
  method: FinancialPaymentMethod;

  client?: string;

  appointmentId?: string;
  clientId?: string;
  serviceId?: string;
};

export type FinancialAppointmentData = {
  date: string;
  client: string;
  service: string;
  value: number;
  status: string;
};

export type FinancialPeriod = {
  startDate: Date;
  endDate: Date;
  label: string;
};

export type FinancialMonthlyRevenue = {
  month: string;
  value: number;
};

export type FinancialReport = {
  period: FinancialPeriod;

  revenue: number;
  expenses: number;
  profit: number;

  appointments: number;
  averageTicket: number;

  transactions: FinancialTransaction[];

  monthlyRevenue: FinancialMonthlyRevenue[];

  appointmentsData: FinancialAppointmentData[];
};

export type FinancialSummary = {
  revenue: number;
  expenses: number;
  balance: number;
  transactionCount: number;
  averageTransaction: number;
};
