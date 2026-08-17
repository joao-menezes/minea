'use client';

import { useState } from 'react';

import HomeScreen from '@/components/HomeScreen/page';
import LoginScreen from '@/components/LoginScreen';
import NewAppointmentSheet from '@/components/NewAppointmentSheet';
import SignupScreen from '@/components/SignupScreen';
import type { Appointment, LoginUser, SignupUser, User } from '@/types';

type Screen = 'login' | 'signup' | 'home';

function createSeedAppointments(): Appointment[] {
  const createAppointment = (
    hour: number,
    minute: number,
    title: string,
    local: string,
  ): Appointment => {
    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return {
      id: Math.random(),
      title,
      date,
      local,
      categoria: 'Autocuidado',
      cor: 'rosa',
    };
  };

  return [
    createAppointment(10, 0, 'Limpeza de pele', 'Studio Bella'),
    createAppointment(15, 30, 'Design de sobrancelhas', 'Studio Bella'),
  ];
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>(createSeedAppointments);

  function handleLogin(user: LoginUser) {
    setUser(user);
    setScreen('home');
  }

  function handleSignup(user: SignupUser) {
    setUser(user);
    setScreen('home');
  }

  function handleLogout() {
    setUser(null);
    setScreen('login');
  }

  function openNewAppointment() {
    setShowNewAppointment(true);
  }

  function closeNewAppointment() {
    setShowNewAppointment(false);
  }

  function handleSaveAppointment(appointment: Appointment) {
    setAppointments((current) => [...current, appointment]);

    closeNewAppointment();
  }

  return (
    <main className="min-h-screen w-full">
      {screen === 'login' && (
        <LoginScreen onLogin={handleLogin} goSignup={() => setScreen('signup')} />
      )}

      {screen === 'signup' && (
        <SignupScreen onCreated={handleSignup} goBack={() => setScreen('login')} />
      )}

      {screen === 'home' && user && (
        <HomeScreen
          user={user}
          appointments={appointments}
          onLogout={handleLogout}
          openNew={openNewAppointment}
        />
      )}

      {showNewAppointment && (
        <NewAppointmentSheet onClose={closeNewAppointment} onSave={handleSaveAppointment} />
      )}
    </main>
  );
}
