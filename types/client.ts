export type ClientStatus = 'Ativa' | 'Inativa';

export type ClientFilter = 'Todos' | ClientStatus;

export type Client = {
  id: number;
  initials: string;
  name: string;
  phone: string;
  cpf: string;
  birthday: string;
  email: string;
  appointments: number;
  lastAppointment: string;
  nextAppointment?: string;
  favoriteService: string;
  status: ClientStatus;
  inDebt: boolean;
};
