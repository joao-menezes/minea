import { ClientRepository } from '@/src/repositories/clientRepository';
import { ClientService } from '@/src/services/clientServices';

import AdminClientsPage from './AdminClientsPage';

export default async function Page() {
  // @ts-ignore
  const repository = new ClientRepository();
  const service = new ClientService(repository);

  const clients = await service.getAll();

  return <AdminClientsPage clients={clients} />;
}
