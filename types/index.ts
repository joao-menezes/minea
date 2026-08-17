export type AppointmentCategory = 'Autocuidado';

export type AppointmentColor = 'rosa' | 'lilas' | 'menta' | 'pessego';

export type User = {
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

export type LoginUser = {
  cpf: string;
  nome: string;
};

export type SignupUser = User;

export type Service = {
  id: string;
  name: string;
  desc: string;
  duration: number;
  price: number;
};
