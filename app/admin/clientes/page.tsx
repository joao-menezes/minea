import { getClients } from '@/lib/api/clients';

import AdminClientsPage from './AdminClientsPage';

export default async function Page() {
  const clients = await getClients();

  return <AdminClientsPage clients={clients} />;
}
