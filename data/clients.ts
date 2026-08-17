import { Client } from '@/types/client';

export const CLIENTS: Client[] = [
  {
    id: 1,
    initials: 'AS',
    name: 'Ana Silva',
    phone: '(11) 99999-1234',
    email: 'ana.silva@email.com',
    cpf: '55284742052',
    birthday: '17-08-2006',
    appointments: 12,
    lastAppointment: '14 ago',
    nextAppointment: '22 ago · 09:00',
    favoriteService: 'Design + Henna',
    status: 'Ativa',
    inDebt: false,
  },

  {
    id: 2,
    initials: 'MC',
    name: 'Mariana Costa',
    phone: '(11) 98888-2345',
    email: 'mariana@email.com',
    cpf: '92072959039',
    birthday: '17-11-2004',
    appointments: 8,
    lastAppointment: '12 ago',
    nextAppointment: '20 ago · 10:30',
    favoriteService: 'Design + Tintura',
    status: 'Ativa',
    inDebt: false,
  },

  {
    id: 3,
    initials: 'CS',
    name: 'Camila Souza',
    phone: '(11) 97777-3456',
    email: 'camila.souza@email.com',
    cpf: '72967271012',
    birthday: '07-02-1992',
    appointments: 15,
    lastAppointment: '10 ago',
    nextAppointment: '25 ago · 14:00',
    favoriteService: 'Design de Sobrancelha',
    status: 'Ativa',
    inDebt: true,
  },

  // ...
];
