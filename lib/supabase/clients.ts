import { supabase } from '@/lib/supabase/client';
import { Client } from '@/types/client';

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').order('name');

  if (error) {
    throw error;
  }

  return data;
}
