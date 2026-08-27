'use client';

import { useEffect, useState } from 'react';

import { CalendarDays, DollarSign, FileText, Plus, Tag, UserRound, X } from 'lucide-react';
import { toast } from 'sonner';

import { BaseModal } from '@/components/BaseModal';
import { CustomDropdown } from '@/components/CustomDropdown';
import { createFinancialTransaction } from '@/lib/api/financial';
import type {
  FinancialPaymentMethod,
  FinancialTransaction,
  FinancialTransactionType,
} from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (transaction: FinancialTransaction) => void;
};

type FormValues = {
  type: FinancialTransactionType;
  category: string;
  description: string;
  value: string;
  date: string;
  method: FinancialPaymentMethod;
  client: string;
};

const INITIAL_FORM: FormValues = {
  type: 'income',
  category: '',
  description: '',
  value: '',
  date: getTodayValue(),
  method: 'pix',
  client: '',
};

function getTodayValue() {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
}

export function NewTransactionModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormValues>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setForm({ ...INITIAL_FORM, date: getTodayValue() });
      setError('');
    }
  }, [open]);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  function handleValueChange(value: string) {
    const normalized = value.replace(',', '.');

    if (/^\d*(\.\d{0,2})?$/.test(normalized)) {
      updateField('value', normalized);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const description = form.description.trim();
    const category = form.category.trim();
    const value = Number(form.value);

    if (!description) {
      setError('Informe uma descrição.');
      return;
    }

    if (!category) {
      setError('Informe uma categoria.');
      return;
    }

    if (!form.date) {
      setError('Informe uma data.');
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const transaction = await createFinancialTransaction({
        type: form.type,
        category,
        description,
        value,
        date: new Date(`${form.date}T12:00:00`).toISOString(),
        method: form.method,
        client: form.client.trim() || undefined,
      });

      toast.success('Movimentação criada com sucesso!');
      onCreated?.(transaction);
      onClose();
    } catch (reason) {
      console.error('Erro ao criar movimentação:', reason);

      const message =
        reason instanceof Error ? reason.message : 'Não foi possível criar a movimentação.';

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      variant="centered"
      size="md"
      showCloseButton={false}
      closeOnBackdrop={!saving}
      backdropClassName="bg-[#332925]/40 backdrop-blur-[3px]"
      className="rounded-[22px] border-[#eee4df] bg-white shadow-[0_25px_70px_-25px_rgba(40,29,25,.45)]"
    >
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#f0e6e0] px-6 py-5">
        <div>
          <h2 className="text-[15px] font-bold leading-tight text-[#3e332f]">Nova movimentação</h2>
          <p className="mt-0.5 text-[10px] text-[#a78a7f]">
            Registre uma entrada ou despesa manualmente
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#a78a7f] transition hover:bg-[#f5ebe7] hover:text-[#634f48] disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel icon={Tag} label="Tipo">
              <CustomDropdown
                value={form.type}
                options={[
                { value: 'income', label: 'Entrada' },
                { value: 'expense', label: 'Despesa' },
              ]}
              onChange={(value) => updateField('type', value as FinancialTransactionType)}
              disabled={saving}
                />
            </FieldLabel>

            <FieldLabel icon={Tag} label="Categoria">
              <input
                type="text"
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                placeholder="Ex.: Serviços"
                maxLength={80}
                disabled={saving}
                className={inputClassName}
              />
            </FieldLabel>
          </div>

          <FieldLabel icon={FileText} label="Descrição">
            <input
              type="text"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Ex.: Limpeza de pele"
              maxLength={160}
              autoFocus
              disabled={saving}
              className={inputClassName}
            />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel icon={DollarSign} label="Valor">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#ad958b]">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.value.replace('.', ',')}
                  onChange={(event) => handleValueChange(event.target.value)}
                  placeholder="0,00"
                  disabled={saving}
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </FieldLabel>

            <FieldLabel icon={CalendarDays} label="Data">
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                disabled={saving}
                className={inputClassName}
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel icon={DollarSign} label="Pagamento">
              <CustomDropdown
                value={form.method}
                options={[
                  { value: 'pix', label: 'Pix' },
                  { value: 'cash', label: 'Dinheiro' },
                  { value: 'credit_card', label: 'Cartão de crédito' },
                  { value: 'debit_card', label: 'Cartão de débito' },
                  { value: 'transfer', label: 'Transferência' },
                  { value: 'other', label: 'Outro' },
                ]}
                onChange={(value) => updateField('method', value as FinancialPaymentMethod)}
                disabled={saving}
              />
            </FieldLabel>

            <FieldLabel icon={UserRound} label="Cliente (opcional)">
              <input
                type="text"
                value={form.client}
                onChange={(event) => updateField('client', event.target.value)}
                placeholder="Nome do cliente"
                maxLength={120}
                disabled={saving}
                className={inputClassName}
              />
            </FieldLabel>
          </div>

          {error && (
            <div className="rounded-[12px] border border-[#ead3cf] bg-[#fff5f3] px-3.5 py-2.5">
              <p className="text-[9px] font-semibold leading-relaxed text-[#a45f59]">{error}</p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2 border-t border-[#f0e6e0] px-6 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-11 flex-1 rounded-[12px] border border-[#eaded8] bg-white text-[10px] font-bold text-[#a98c82] transition hover:bg-[#faf5f2] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex h-11 flex-[1.5] items-center justify-center gap-2 rounded-[12px] bg-[#3f332f] text-[10px] font-bold text-white transition hover:bg-[#332925] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Salvando...
              </>
            ) : (
              <>
                <Plus size={14} />
                Salvar movimentação
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

const inputClassName =
  'h-11 w-full rounded-[12px] border border-[#e5dad5] bg-white px-3.5 text-[11px] font-medium text-[#54423c] outline-none transition placeholder:text-[#c4afa6] focus:border-[#b99a8e] focus:ring-2 focus:ring-[#d8c0b6]/30 disabled:cursor-not-allowed disabled:bg-[#f5f1ef]';

function FieldLabel({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]">
        <Icon size={12} />
        {label}
      </span>
      {children}
    </label>
  );
}
