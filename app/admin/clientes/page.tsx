'use client';

import { useEffect, useState } from 'react';

import { getClients } from '@/lib/api/clients';
import type { Client } from '@/types';

import AdminClientsPage from './AdminClientsPage';

export default function Page() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((reason: unknown) => {
        console.error('Erro ao carregar clientes:', reason);
        setError(
          reason instanceof Error ? reason.message : 'Não foi possível carregar os clientes.',
        );
      });
  }, []);

  if (clients === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] text-sm text-[#80665c]">
        {error || 'Carregando clientes...'}
      </main>
    );
  }

  return <AdminClientsPage clients={clients} />;
}
