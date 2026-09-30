'use client';

import { useEffect, useState } from 'react';

import { notFound } from 'next/navigation';

import { ApiRequestError } from '@/lib/api/client';
import { getClients } from '@/lib/api/clients';
import type { Client } from '@/types';

import AdminClientsPage from './AdminClientsPage';

export default function Page() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState('');
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((reason: unknown) => {
        if (reason instanceof ApiRequestError && (reason.status === 401 || reason.status === 403)) {
          // Sem sessão de admin: mostra 404 em vez de revelar que essa rota existe.
          setDenied(true);
          return;
        }

        console.error('Erro ao carregar clientes:', reason);
        setError(
          reason instanceof Error ? reason.message : 'Não foi possível carregar os clientes.',
        );
      });
  }, []);

  if (denied) {
    notFound();
  }

  if (clients === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] text-sm text-[#80665c]">
        {error || 'Carregando clientes...'}
      </main>
    );
  }

  return <AdminClientsPage clients={clients} />;
}
