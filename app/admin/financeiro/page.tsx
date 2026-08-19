import { getFinancialReport } from '@/lib/financial';

import FinanceiroClient from './FinanceiroClient';

export default async function FinanceiroPage() {
  const report = await getFinancialReport();

  return <FinanceiroClient report={report} />;
}
