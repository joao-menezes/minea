import { supabase } from '@/lib/supabase/client';
import { Service } from '@/types';

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, duration, price, active')
    .eq('active', true)
    .order('name');

  if (error) {
    throw new Error(`Erro ao buscar serviços: ${error.message}`);
  }

  return data ?? [];
}
