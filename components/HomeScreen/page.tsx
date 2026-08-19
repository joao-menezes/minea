'use client';

import { useMemo, useState } from 'react';

import { AmbientBackground } from '@/components/HomeScreen/AmbientBackground';
import { AppointmentCalendar } from '@/components/HomeScreen/AppointmentList/AppointmentCalendar';
import { AppointmentList } from '@/components/HomeScreen/AppointmentList/AppointmentList';
import { AppointmentModal } from '@/components/HomeScreen/AppointmentList/AppointmentModal';
import { NewAppointmentButton } from '@/components/HomeScreen/AppointmentList/NewAppointmentButton';
import { HomeHeader } from '@/components/HomeScreen/HomeHeader';
import { buildWeekStrip, sameDay } from '@/components/decor';
import { deleteAppointment, updateAppointment } from '@/lib/api/appointments';
import type { Appointment, User } from '@/types';

import { HomeHero } from './HomeHero';

type HomeScreenProps = {
  user: User;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onLogout: () => void;
  openNew: () => void;
};

export default function Page({
  user,
  appointments,
  setAppointments,
  onLogout,
  openNew,
}: HomeScreenProps) {
  const [selected, setSelected] = useState(new Date());

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const week = useMemo(() => buildWeekStrip(new Date()), []);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => sameDay(new Date(appointment.date), selected))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments, selected]);

  const nextAppointment = useMemo(() => {
    const now = new Date();

    return [...appointments]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .find((appointment) => new Date(appointment.date) >= now);
  }, [appointments]);

  return (
    <main className="min-h-screen bg-[#faf6f3] text-[#5c4a43] selection:bg-[#e9d3c8]/40">
      <AmbientBackground />

      <div className="relative mx-auto min-h-screen max-w-md px-5 pb-32 pt-6">
        <HomeHeader user={user} onLogout={onLogout} />

        <HomeHero appointment={nextAppointment} />

        <NewAppointmentButton onClick={openNew} variant="primary" />

        <AppointmentCalendar
          selected={selected}
          week={week}
          appointmentCount={dayAppointments.length}
          onSelect={setSelected}
        />

        <AppointmentList
          appointments={dayAppointments}
          onSelect={setSelectedAppointment}
          onCreate={openNew}
        />
      </div>

      <AppointmentModal
        appointment={selectedAppointment}
        open={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}

        onSave={async (updatedAppointment) => {
          const updated = await updateAppointment(updatedAppointment.id, {
            date: updatedAppointment.date,
            time: updatedAppointment.time,
          });

          setAppointments((current) =>
            current.map((item) => (item.id === updated.id ? updated : item)),
          );

          setSelectedAppointment(null);
        }}

        onCancel={async (appointment) => {
          await deleteAppointment(appointment.id);

          setAppointments((current) => current.filter((item) => item.id !== appointment.id));

          setSelectedAppointment(null);
        }}
      />
    </main>
  );
}
