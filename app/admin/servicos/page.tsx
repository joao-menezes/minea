import { supabase } from '@/lib/supabase/client';

import AdminServicesPage from './AdminServicesPage';

export default async function Page() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return <AdminServicesPage services={data ?? []} />;
}
