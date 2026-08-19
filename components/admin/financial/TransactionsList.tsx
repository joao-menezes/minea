import { ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';

type Transaction = {
  id: string;
  date: string;
  description: string;
  client?: string | null;
  method: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
};

type Props = {
  transactions: Transaction[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function TransactionsList({ transactions }: Props) {
  return (
    <section className="mt-5 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur lg:p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
            Movimentações
          </p>

          <h2 className="mt-2 font-display text-[27px] text-[#6b5850]">Transações recentes</h2>
        </div>

        <button className="text-[10px] font-bold text-[#a98d81]">Ver todas</button>
      </div>

      <div className="mt-6 divide-y divide-[#f1e8e2]">
        {transactions.slice(0, 5).map((transaction) => {
          const income = transaction.type === 'income';

          return (
            <div key={transaction.id} className="flex items-center gap-3 py-4">
              <div
                className={[
                  `flex h-11 w-11 items-center justify-center rounded-[15px]`,
                  income ? 'bg-[#edf4ee] text-[#66806d]' : 'bg-[#f8eeea] text-[#a68173]',
                ].join(' ')}
              >
                {income ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
              </div>

              <div className="flex-1">
                <p className="text-[11px] font-bold text-[#6b5850]">{transaction.description}</p>

                <p className="text-[9px] text-[#b49b90]">
                  {transaction.client ?? 'Cliente não informado'}
                  {' • '}
                  {transaction.method}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-[#b49b90]">{formatDate(transaction.date)}</p>

                <strong className="text-[11px]">
                  {income ? '+' : '-'}
                  {formatCurrency(transaction.value)}
                </strong>
              </div>

              <ChevronRight size={14} className="text-[#d0beb5]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
