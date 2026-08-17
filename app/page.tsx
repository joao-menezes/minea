'use client';

import { useEffect, useState } from 'react';

import HomeScreen from '@/components/HomeScreen/page';
import LoginScreen from '@/components/LoginScreen';
import NewAppointmentSheet from '@/components/NewAppointmentSheet';
import SignupScreen from '@/components/SignupScreen';
import { getCurrentUser, signIn, signOut, signUp } from '@/src/services/authService';
import type { Appointment, SignupUser, User } from '@/types';

type Screen = 'login' | 'signup' | 'home';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('login');

  const [user, setUser] = useState<User | null>(null);

  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          setScreen('home');
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function handleLogin(cpf: string, password: string) {
    try {
      const authenticatedUser = await signIn(cpf, password);

      setUser(authenticatedUser);
      setScreen('home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async function handleSignup(input: SignupUser, password: string) {
    try {
      const createdUser = await signUp(input, password);

      setUser(createdUser);
      setScreen('home');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  }

  async function handleLogout() {
    try {
      await signOut();

      setUser(null);
      setScreen('login');
      setAppointments([]);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span>Carregando...</span>
      </main>
    );
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
