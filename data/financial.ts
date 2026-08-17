import type { Appointment } from '@/types';

export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Pix' | 'Cartão' | 'Dinheiro';

export type FinancialTransaction = {
  id: string;
  date: Date;
  description: string;
  client: string;
  category: 'Serviço' | 'Despesa';
  method: PaymentMethod;
  value: number;
  type: TransactionType;
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

  appointmentsData: Appointment[];

  transactions: FinancialTransaction[];

  monthlyRevenue: MonthlyRevenue[];

  paymentMethods: {
    method: PaymentMethod;
    value: number;
  }[];
};

export const financialMock: FinancialReport = {
  period: 'Agosto de 2026',
  revenue: 18450,
  expenses: 4280,
  profit: 14170,
  appointments: 82,
  averageTicket: 225,
  appointmentsData: [],
  transactions: [
    {
      id: 'transaction-1',
      date: new Date('2026-08-17T09:00:00'),
      description: 'Design + Henna',
      client: 'Ana Silva',
      category: 'Serviço',
      method: 'Pix',
      value: 85,
      type: 'income',
    },

    {
      id: 'transaction-2',
      date: new Date('2026-08-17T10:30:00'),
      description: 'Design + Tintura',
      client: 'Mariana Costa',
      category: 'Serviço',
      method: 'Cartão',
      value: 120,
      type: 'income',
    },

    {
      id: 'transaction-3',
      date: new Date('2026-08-16T14:00:00'),
      description: 'Manutenção de tintura',
      client: 'Camila Souza',
      category: 'Serviço',
      method: 'Pix',
      value: 75,
      type: 'income',
    },

    {
      id: 'transaction-4',
      date: new Date('2026-08-16T16:00:00'),
      description: 'Compra de materiais',
      client: 'Fornecedor',
      category: 'Despesa',
      method: 'Cartão',
      value: 320,
      type: 'expense',
    },

    {
      id: 'transaction-5',
      date: new Date('2026-08-15T15:30:00'),
      description: 'Design de Sobrancelha',
      client: 'Juliana Alves',
      category: 'Serviço',
      method: 'Dinheiro',
      value: 55,
      type: 'income',
    },
  ],

  monthlyRevenue: [
    {
      month: 'Mar',
      value: 11200,
    },
    {
      month: 'Abr',
      value: 12800,
    },
    {
      month: 'Mai',
      value: 13900,
    },
    {
      month: 'Jun',
      value: 15100,
    },
    {
      month: 'Jul',
      value: 16400,
    },
    {
      month: 'Ago',
      value: 18450,
    },
  ],

  paymentMethods: [
    {
      method: 'Cartão',
      value: 42,
    },
    {
      method: 'Pix',
      value: 38,
    },
    {
      method: 'Dinheiro',
      value: 20,
    },
  ],
};
