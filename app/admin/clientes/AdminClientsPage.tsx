'use client';

import { useMemo, useState } from 'react';

import { ClientHeader } from '@/app/admin/clientes/ClientHeader';
import { ClientModal } from '@/app/admin/clientes/ClientModal';
import { ClientStats } from '@/app/admin/clientes/ClientStats';
import { ClientTable } from '@/app/admin/clientes/ClientTable';
import { ClientToolbar } from '@/app/admin/clientes/ClientToolbar';
import { EmptyClients } from '@/app/admin/clientes/EmptyClients';
import { AdminShell } from '@/components/admin/AdminShell';
import { normalize } from '@/lib/clients';
import type { Client, ClientFilter } from '@/types/client';

type AdminClientsPageProps = {
  clients: Client[];
};

export default function AdminClientsPage({ clients: initialClients }: AdminClientsPageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientFilter>('Todos');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const clients = useMemo(() => {
    const query = normalize(search);

    return initialClients.filter((client) => {
      const content = [client.name, client.phone, client.email, client.cpf]
        .filter(Boolean)
        .map(normalize)
        .join(' ');

      const matchesSearch = !query || content.includes(query);

      const matchesStatus = status === 'Todos' || client.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [initialClients, search, status]);

  const activeClients = useMemo(
    () => initialClients.filter((client) => client.status === 'Ativa').length,
    [initialClients],
  );

  const debtClients = useMemo(
    () => initialClients.filter((client) => client.inDebt).length,
    [initialClients],
  );

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
            <ClientStats activeClients={activeClients} debtClients={debtClients} />
          </div>

          <section className="mt-7 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur lg:p-6">
            <ClientToolbar
              search={search}
              status={status}
              count={clients.length}
              onSearch={setSearch}
              onStatus={setStatus}
            />

            {clients.length > 0 ? (
              <ClientTable clients={clients} onSelect={setSelectedClient} />
            ) : (
              <EmptyClients />
            )}
          </section>
        </div>

        {selectedClient && (
          <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
      </main>
    </AdminShell>
  );
}
