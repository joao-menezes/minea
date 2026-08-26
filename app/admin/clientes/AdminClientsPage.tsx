'use client';

import { useMemo, useState } from 'react';

import { ClientHeader } from '@/app/admin/clientes/ClientHeader';
import { ClientModal } from '@/app/admin/clientes/ClientModal';
import { ClientStats } from '@/app/admin/clientes/ClientStats';
import { ClientTable } from '@/app/admin/clientes/ClientTable';
import { ClientToolbar } from '@/app/admin/clientes/ClientToolbar';
import { EmptyRow } from '@/components/EmptyRow';
import { AdminShell } from '@/components/admin/AdminShell';
import type { Client, ClientFilter } from '@/types';

type AdminClientsPageProps = {
  clients: Client[];
};

function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function AdminClientsPage({ clients: initialClients }: AdminClientsPageProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientFilter>('Todos');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    const query = normalize(search);

    return clients.filter((client) => {
      const searchableContent = [client.name, client.phone, client.email, client.cpf]
        .filter(Boolean)
        .map((value) => normalize(value))
        .join(' ');

      const matchesSearch = query.length === 0 || searchableContent.includes(query);

      const matchesStatus =
        status === 'Todos' ||
        (status === 'Ativa' && client.isActive) ||
        (status === 'Inativa' && !client.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, status]);

  const activeClients = useMemo(() => {
    return clients.filter((client) => client.isActive);
  }, [clients]);

  const debtClients = useMemo(() => {
    return clients.filter((client) => client.inDebt);
  }, [clients]);

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

          <div className="absolute -left-40 top-[38%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

          <div className="absolute bottom-0 right-[18%] h-80 w-80 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
          <ClientHeader />

          <div className="mt-8">
            <ClientStats activeClients={activeClients.length} debtClients={debtClients.length} />
          </div>

          <section className="mt-7 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
            <ClientToolbar
              search={search}
              status={status}
              count={filteredClients.length}
              onSearch={setSearch}
              onStatus={setStatus}
            />

            {filteredClients.length > 0 ? (
              <ClientTable clients={filteredClients} onSelect={setSelectedClient} />
            ) : (
              <EmptyRow
                title={'Nenhum cliente encontrado'}
                message={'Tente buscar por outro nome, telefone ou e-mail.'}
              />
            )}
          </section>
        </div>

        {selectedClient && (
          <ClientModal
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onClientUpdated={(updatedClient) => {
              setClients((current) =>
                current.map((client) => (client.id === updatedClient.id ? updatedClient : client)),
              );
              setSelectedClient(updatedClient);
            }}
          />
        )}
      </main>
    </AdminShell>
  );
}
