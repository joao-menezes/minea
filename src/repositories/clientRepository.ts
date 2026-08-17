import type { Client } from '@/types/client';

export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  findBySearch(search: string): Promise<Client[]>;
  create(client: Omit<Client, 'id'>): Promise<Client>;
  update(id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client | null>;
  delete(id: string): Promise<void>;
}
