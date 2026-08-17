'use client';

import { useMemo, useState } from 'react';

import { AmbientBackground } from '@/components/HomeScreen/AmbientBackground';
import { AppointmentCalendar } from '@/components/HomeScreen/AppointmentList/AppointmentCalendar';
import { AppointmentList } from '@/components/HomeScreen/AppointmentList/AppointmentList';
import { AppointmentModal } from '@/components/HomeScreen/AppointmentList/AppointmentModal';
import { NewAppointmentButton } from '@/components/HomeScreen/AppointmentList/NewAppointmentButton';
import { HomeHeader } from '@/components/HomeScreen/HomeHeader';
import { buildWeekStrip, sameDay } from '@/components/decor';
import type { Appointment, User } from '@/types';

import { HomeHero } from './HomeHero';

type HomeScreenProps = {
  user: User;
  appointments: Appointment[];
  onLogout: () => void;
  openNew: () => void;
};

export default function Page({ user, appointments, onLogout, openNew }: HomeScreenProps) {
  const [selected, setSelected] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const week = useMemo(() => buildWeekStrip(new Date()), []);

  const dayAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => sameDay(appointment.date, selected))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [appointments, selected],
  );

  const nextAppointment = useMemo(() => {
    const now = new Date();

    return [...appointments]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .find((appointment) => appointment.date >= now);
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

      <NewAppointmentButton onClick={openNew} variant="bottom" />

      <AppointmentModal
        appointment={selectedAppointment}
        open={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        onSave={(updatedAppointment) => {
          console.log(updatedAppointment);
          setSelectedAppointment(null);
        }}
      />
    </main>
  );
}
