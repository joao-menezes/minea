import type { Service } from '@/types';

import { supabase } from './client';

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) {
    throw error;
  }

  return data.map((service: any) => ({
    id: service.id,
    name: service.name,
    desc: service.description ?? '',
    duration: service.duration,
    price: Number(service.price),
  }));
}
