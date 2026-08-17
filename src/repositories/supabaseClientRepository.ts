import { supabase } from '@/lib/supabase/client';
import type { Client } from '@/types/client';

import type { ClientRepository } from './clientRepository';

export class SupabaseClientRepository implements ClientRepository {
  async findAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }

    return data ?? [];
  }

  async findById(id: string): Promise<Client | null> {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }

    return data;
  }

  async findBySearch(search: string): Promise<Client[]> {
    const value = search.trim();

    if (!value) {
      return this.findAll();
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${value}%,email.ilike.%${value}%`)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }

    return data ?? [];
  }

  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const { data, error } = await supabase.from('clients').insert(client).select().single();

    if (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }

    return data;
  }

  async update(id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir cliente: ${error.message}`);
    }
  }
}
