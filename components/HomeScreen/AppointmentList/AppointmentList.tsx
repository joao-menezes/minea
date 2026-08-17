import type { Appointment } from '@/types';

import { AppointmentCard } from './AppointmentCard';
import { EmptyAppointments } from './EmptyAppointments';

type AppointmentListProps = {
  appointments: Appointment[];
  onSelect: (appointment: Appointment) => void;
  onCreate: () => void;
};

export function AppointmentList({ appointments, onSelect, onCreate }: AppointmentListProps) {
  return (
    <section className="mt-8">
      {appointments.length === 0 ? (
        <EmptyAppointments onCreate={onCreate} />
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={() => onSelect(appointment)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
