'use client';

import { useEffect, useState } from 'react';

import { BookingFlow } from '@/components/HomeScreen/Appointment/NewAppointmentSheet';
import HomeScreen from '@/components/HomeScreen/page';
import LoginScreen from '@/components/LoginScreen';
import SignupScreen from '@/components/SignupScreen';
import { getAppointments } from '@/lib/api/appointments';
import { getCurrentUser, signIn, signOut, signUp } from '@/lib/api/auth';
import { getServices } from '@/lib/api/services';
import type { Appointment, Service, User } from '@/types';

type SignupData = {
  birthDate?: string;
  cpf: string;
  name: string;
  password: string;
};

type Screen = 'login' | 'signup' | 'home';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          return;
        }

        setUser(currentUser);
        setScreen('home');

        const userAppointments = await getAppointments(currentUser.id);

        setAppointments(userAppointments);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadSession();
  }, []);

  async function handleLogin(cpf: string, password: string) {
    try {
      const user = await signIn({
        cpf,
        password,
      });

      const userAppointments = await getAppointments(user.id);

      setUser(user);
      setAppointments(userAppointments);
      setScreen('home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      throw new Error(error instanceof Error ? error.message : 'CPF ou senha incorretos.');
    }
  }

  async function handleSignup(data: SignupData) {
    try {
      const createdUser = await signUp({
        cpf: data.cpf.replace(/\D/g, ''),
        name: data.name,
        birthDate: data.birthDate,
        password: data.password,
      });

      setUser(createdUser);
      setScreen('home');

      const userAppointments = await getAppointments(createdUser.id);

      setAppointments(userAppointments);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw new Error(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    }
  }

  async function handleLogout() {
    try {
      await signOut();

      setUser(null);
      setAppointments([]);
      setShowNewAppointment(false);
      setScreen('login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }

  async function openNewAppointment() {
    try {
      setLoadingServices(true);
      setServicesError(null);

      const data = await getServices();

      setServices(data);
      setShowNewAppointment(true);
    } catch (error) {
      setServicesError(error instanceof Error ? error.message : 'Erro ao carregar procedimentos');

      setShowNewAppointment(true);
    } finally {
      setLoadingServices(false);
    }
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
      <main className="flex min-h-screen items-center justify-center bg-[#faf6f3]">
        <span className="text-sm text-[#80665c]">Carregando...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full">
      {screen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          error={loginError}
          goSignup={() => setScreen('signup')}
        />
      )}

      {screen === 'signup' && (
        <SignupScreen onCreated={handleSignup} goBack={() => setScreen('login')} />
      )}

      {screen === 'home' && user && (
        <HomeScreen
          user={user}
          appointments={appointments}
          setAppointments={setAppointments}
          onLogout={handleLogout}
          openNew={openNewAppointment}
        />
      )}

      {showNewAppointment && user && (
        <BookingFlow
          userId={user.id}
          services={services}
          loadingServices={loadingServices}
          servicesError={servicesError}
          onClose={closeNewAppointment}
          onComplete={handleSaveAppointment}
        />
      )}
    </main>
  );
}
