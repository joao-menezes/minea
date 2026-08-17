export type AppointmentCategory = 'Autocuidado';

export type AppointmentColor = 'rosa' | 'lilas' | 'menta' | 'pessego';

export type User = {
  id?: string;
  nome: string;
  cpf: string;
  aniversario?: string | null;
};

export type LoginUser = {
  cpf: string;
  nome: string;
};

export type SignupUser = {
  nome: string;
  cpf: string;
  aniversario?: string | null;
};

export type Appointment = {
  id: number;
  title: string;
  date: Date;
  local?: string;
  services?: string[];
  duration?: number;
  price?: number;
  categoria: AppointmentCategory;
  cor: AppointmentColor;
};

export type Service = {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  appointments: number;
  clients: number;
  active: boolean;
  popular?: boolean;
};
