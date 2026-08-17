import { supabase } from '@/lib/supabase/client';

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';

export type Appointment = {
  id: string;
  time: string;
  duration: string;
  client: string;
  service: string;
  professional: string;
  status: AppointmentStatus;
  price: string;
  location?: string;
};

type AppointmentRow = {
  id: string;
  date: string;
  status: AppointmentStatus;
  price: number | null;
  location: string | null;

  client: {
    nome: string;
  } | null;

  service: {
    name: string;
    duration: number;
  } | null;

  professional: {
    nome: string;
  } | null;
};

function formatCurrency(value: number | null) {
  if (value == null) {
    return '';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export async function getAppointments(date: Date): Promise<Appointment[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
id,
  date,
  status,
  price,
  location,
  client:users!appointments_client_id_fkey (
  nome
),
  service:services (
  name,
  duration
),
  professional:users!appointments_professional_id_fkey (
  nome
)
  `,
    )
    .gte('date', start.toISOString())
    .lte('date', end.toISOString())
    .order('date', { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
  }

  return ((data ?? []) as unknown as AppointmentRow[]).map((appointment) => ({
    id: appointment.id,
    time: formatTime(appointment.date),
    duration: `${appointment.service?.duration ?? 0} min`,
    client: appointment.client?.nome ?? 'Cliente',
    service: appointment.service?.name ?? 'Serviço',
    professional: appointment.professional?.nome ?? 'Profissional',
    status: appointment.status,
    price: formatCurrency(appointment.price),
    location: appointment.location ?? undefined,
  }));
}
