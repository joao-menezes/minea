import { supabase } from '@/lib/supabase/client';

export type ServiceRow = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  created_at: string;
  updated_at: string;
};

export async function getServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from('services').select('*').order('name');

  if (error) {
    throw new Error(`Erro ao buscar serviços: ${error.message}`);
  }

  return data ?? [];
}
