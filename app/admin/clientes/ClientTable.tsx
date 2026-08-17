import { ClientCard } from '@/app/admin/clientes/ClientCard';
import { DesktopTable } from '@/app/admin/clientes/DesktopTable';
import { Client } from '@/types/client';

export function ClientTable({
  clients,
  onSelect,
}: {
  clients: Client[];
  onSelect: (client: Client) => void;
}) {
  return (
    <>
      <div className="mt-5 hidden lg:block">
        <DesktopTable clients={clients} onSelect={onSelect} />
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:hidden">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} onClick={() => onSelect(client)} />
        ))}
      </div>
    </>
  );
}
