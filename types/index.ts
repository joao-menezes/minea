// ============================================================
// SERVICE
// ============================================================

export type Service = {
  id: string;

  name: string;
  description: string | null;

  duration: number;
  price: number;

  active: boolean;

  createdAt: string;
  updatedAt: string;
};

export type UpdateServiceData = {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  active?: boolean;
};

export type CreateServiceData = {
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
};

// ============================================================
// CLIENT
// ============================================================

export type ClientFilter = 'Todos' | 'Ativa' | 'Inativa';

export type Client = {
  id: string;

  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  birthDate: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  appointments?: number;
  totalSpent?: number;
  lastAppointmentAt?: string | null;
  favoriteServices?: Service[];
  inDebt?: boolean;
};

// ============================================================
// AUTH
// ============================================================

export type User = {
  id: string;
  name: string;
  cpf: string;
  birthDate?: string | null;
  isActive?: boolean;
  isAdmin?: boolean;
};

export type CreateClientData = {
  name: string;
  cpf: string;
  birthDate?: string;
  password: string;
  isAdmin?: boolean;
};

export type SignInData = {
  cpf: string;
  password: string;
};

export type SignUpData = {
  cpf: string;
  name: string;
  birthDate?: string;
  password: string;
};

// ============================================================
// APPOINTMENT
// ============================================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type Appointment = {
  id: string;

  title: string;

  time: string;
  date: string;

  local: string;

  services: string[];

  duration: number;
  price: number;

  categoria: string;
  cor: string;

  status: AppointmentStatus;

  userId?: string;
  clientName?: string;
};

// ============================================================
// APPOINTMENT INPUT
// ============================================================

export type CreateAppointmentData = {
  date: string;
  time: string;
  userId: string;
  serviceId: string;
  notes?: string | null;
};

export type UpdateAppointmentData = Partial<CreateAppointmentData> & {
  status?: AppointmentStatus;
};

// ============================================================
// FINANCIAL
// ============================================================

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
  userId?: string;
  serviceId?: string;
};

export type CreateFinancialTransactionData = {
  type: FinancialTransactionType;
  category: string;
  description: string;
  value: number;
  date: string;
  method: FinancialPaymentMethod;
  client?: string;
};

// ============================================================
// FINANCIAL REPORT
// ============================================================

export type FinancialPeriod = {
  startDate: Date;
  endDate: Date;
  label: string;
};

export type FinancialMonthlyRevenue = {
  month: string;
  value: number;
};

export type FinancialAppointmentData = {
  date: string;
  time: string;
  title: string;
  price: number;
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

// ============================================================
// PAYMENT
// ============================================================

export type PixPayment = {
  id: string;
  status: PixPaymentStatus;
  transactionAmount: number;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  dateOfExpiration: string | null;
  statusDetail?: string | null;
};

export type PixPaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

export type PendingAppointment = {
  appointmentId: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  service: Service;
};
