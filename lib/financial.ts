import { FinancialService } from '@/src/services/financialService';
import { FinancialReport } from '@/types/financial';

export async function getFinancialReport(service: FinancialService): Promise<FinancialReport> {
  return service.getReport(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999),
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}
