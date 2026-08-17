'use client'

import { useState } from 'react'
import LoginScreen from '@/components/LoginScreen'
import SignupScreen from '@/components/SignupScreen'
import HomeScreen from '@/components/HomeScreen'
import NewAppointmentSheet from '@/components/NewAppointmentSheet'
import type { Appointment, LoginUser, SignupUser, User } from '@/types'

function seedAppointments(): Appointment[] {
  const mk = (
    h: number,
    m: number,
    title: string,
    local: string,
    categoria: 'Autocuidado',
    cor: 'rosa',
  ): Appointment => {
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return { id: Math.random(), title, date: d, local, categoria, cor }
  }
  return [
    mk(10, 0, 'Limpeza de pele', 'Studio Bella', 'Autocuidado', 'rosa'),
    mk(15, 30, 'Design de sobrancelhas', 'Studio Bella', 'Autocuidado', 'rosa'),
  ]
}

export default function Page() {
  type Screen = 'login' | 'signup' | 'home'

  const [screen, setScreen] = useState<Screen>('login')
  const [user, setUser] = useState<User | null>(null)
  const [showNew, setShowNew] = useState<boolean>(false)
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)

  function handleLogin(u: LoginUser) {
    setUser(u)
    setScreen('home')
  }
  function handleCreated(u: SignupUser) {
    setUser(u)
    setScreen('home')
  }
  function handleLogout() {
    setUser(null)
    setScreen('login')
  }
  function handleSaveAppointment(appt: Appointment) {
    setAppointments((prev) => [...prev, appt])
    setShowNew(false)
  }

  return (
    <main className="min-h-screen w-full">
      {screen === 'login' && (
        <LoginScreen onLogin={handleLogin} goSignup={() => setScreen('signup')} />
      )}
      {screen === 'signup' && (
        <SignupScreen onCreated={handleCreated} goBack={() => setScreen('login')} />
      )}
      {screen === 'home' && user && (
        <HomeScreen
          user={user}
          appointments={appointments}
          onLogout={handleLogout}
          openNew={() => setShowNew(true)}
        />
      )}
      {showNew && (
        <NewAppointmentSheet onClose={() => setShowNew(false)} onSave={handleSaveAppointment} />
      )}
    </main>
  )
}
