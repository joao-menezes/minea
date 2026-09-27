'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AmbientBackground } from '@/components/HomeScreen/AmbientBackground';
import { AppointmentCalendar } from '@/components/HomeScreen/Appointment/AppointmentCalendar';
import { AppointmentHistoryModal } from '@/components/HomeScreen/Appointment/AppointmentHistoryModal';
import { AppointmentList } from '@/components/HomeScreen/Appointment/AppointmentList';
import { AppointmentModal } from '@/components/HomeScreen/Appointment/AppointmentModal';
import { NewAppointmentButton } from '@/components/HomeScreen/Appointment/NewAppointmentButton';
import { ClinicLocationFooter } from '@/components/HomeScreen/ClinicLocationFooter';
import { HomeHeader } from '@/components/HomeScreen/HomeHeader';
import { InstallAppPrompt } from '@/components/HomeScreen/InstallAppPrompt';
import { deleteAppointment, updateAppointment } from '@/lib/api/appointments';
import type { Appointment, User } from '@/types';
import { buildWeekStrip, isLateCancellation, sameDay } from '@/utils/utils';

import { HomeHero } from './HomeHero';

type HomeScreenProps = {
  user: User;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onLogout: () => void;
  openNew: () => void;
  onProfile: () => void;
};

export default function Page({
  user,
  appointments,
  setAppointments,
  onLogout,
  openNew,
  onProfile,
}: HomeScreenProps) {
  const [selected, setSelected] = useState(new Date());

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

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

      <div className="relative mx-auto min-h-screen max-w-md px-5 pb-32 pt-6 md:max-w-2xl md:px-8 lg:max-w-6xl lg:px-10 lg:pt-10">
        <HomeHeader user={user} onLogout={onLogout} onProfile={onProfile} />

        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <div>
            <HomeHero appointment={nextAppointment} />

            <NewAppointmentButton onClick={openNew} variant="primary" />

            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border border-[#eaded8] bg-white/75 text-[10px] font-bold text-[#9a8076] transition hover:bg-white"
            >
              Ver histórico de procedimentos
            </button>
          </div>

          {/*
            No desktop a coluna da direita fica fora do fluxo (absolute) para não
            aumentar a altura da linha: ela acompanha a coluna da esquerda e a
            lista de agendamentos rola por dentro, sem empurrar o mapa.
            O calendário tem mt-9; -mt-2 alinha o topo com o card da esquerda (mt-7).
          */}
          <div className="lg:relative">
            <div className="lg:absolute lg:inset-0 lg:-mt-2 lg:flex lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
              <AppointmentCalendar
                selected={selected}
                week={week}
                appointmentCount={appointments.length}
                appointmentDates={appointments.map((appointment) => new Date(appointment.date))}
                appointments={appointments}
                onSelect={setSelected}
              />

              <div className="lg:-mx-2 lg:min-h-[180px] lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden lg:px-2 lg:pb-8 lg:[mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)]">
                <AppointmentList
                  appointments={dayAppointments}
                  onSelect={setSelectedAppointment}
                  onCreate={openNew}
                />
              </div>
            </div>
          </div>
        </div>

        <ClinicLocationFooter />
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
          if (appointment.status === 'confirmed' && isLateCancellation(appointment)) {
            const updated = await updateAppointment(appointment.id, { status: 'completed' });

            setAppointments((current) =>
              current.map((item) => (item.id === updated.id ? updated : item)),
            );
          } else {
            await deleteAppointment(appointment.id, user.id);

            setAppointments((current) => current.filter((item) => item.id !== appointment.id));
          }

          setSelectedAppointment(null);
        }}
        isAdmin={user.isAdmin}
      />

      {historyOpen && (
        <AppointmentHistoryModal
          appointments={appointments}
          onClose={() => setHistoryOpen(false)}
        />
      )}

      <InstallAppPrompt />
    </main>
  );
}
