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
  appointmentId?: string;
  clientId?: string;
  serviceId?: string;
};

export type FinancialAppointmentData = {
  date: string;
  title: string;
  price?: number;
};

export type FinancialPeriod = {
  startDate?: Date;
  endDate?: Date;
};

export type FinancialReport = {
  period: FinancialPeriod;
  revenue: number;
  expenses: number;
  profit: number;
  appointments: number;
  averageTicket: number;
  appointmentsData: FinancialAppointmentData[];
};

export type FinancialSummary = {
  revenue: number;
  expenses: number;
  balance: number;
  transactionCount: number;
  averageTransaction: number;
};
