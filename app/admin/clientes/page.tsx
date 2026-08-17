import { SupabaseClientRepository } from '@/src/repositories/supabaseClientRepository';
import { ClientService } from '@/src/services/clientServices';

import AdminClientsPage from './AdminClientsPage';

export default async function Page() {
  const repository = new SupabaseClientRepository();
  const service = new ClientService(repository);

  const clients = await service.getAll();

  return <AdminClientsPage clients={clients} />;
}
