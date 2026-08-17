import type { Client } from '@/types/client';

export interface ClientRepository {
  findAll(): Promise<Client[]>;

  findById(id: string): Promise<Client | null>;
}

export class ClientService {
  constructor(private readonly repository: ClientRepository) {}

  async getAll(): Promise<Client[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Client | null> {
    return this.repository.findById(id);
  }
}
