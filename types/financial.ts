export type FinancialAppointmentStatus = 'Confirmado' | 'Pendente' | 'Cancelado';

export type FinancialAppointment = {
  date: Date;
  client: string;
  service: string;
  status: FinancialAppointmentStatus;
  value: number;
};

export type FinancialTransaction = {
  id: string;
  date: string;
  description: string;
  client: string;
  category: 'Serviço' | 'Despesa';
  method: 'Pix' | 'Cartão' | 'Dinheiro';
  value: number;
  type: 'income' | 'expense';
};

export type MonthlyRevenue = {
  month: string;
  value: number;
};

export type FinancialReport = {
  period: string;

  revenue: number;
  expenses: number;
  profit: number;

  appointments: number;
  averageTicket: number;

  currentMonth: string;

  monthlyRevenue: MonthlyRevenue[];

  appointmentsData: FinancialAppointment[];

  transactions: FinancialTransaction[];
};
