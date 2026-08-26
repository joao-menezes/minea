'use client';

import { useEffect, useState } from 'react';

import { Clock3, DollarSign, FileText, Plus, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

import { BaseModal } from '@/components/BaseModal';
import { createService } from '@/lib/api/services';
import type { Service } from '@/types';

type NewServiceModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (service: Service) => void;
};

type FormData = {
  name: string;
  description: string;
  duration: string;
  price: string;
};

const INITIAL_FORM: FormData = {
  name: '',
  description: '',
  duration: '',
  price: '',
};

export function NewServiceModal({ open, onClose, onCreated }: NewServiceModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setError('');
    }
  }, [open]);

  // O ESC/backdrop-close enquanto `saving` agora é responsabilidade do
  // BaseModal (closeOnEscape/closeOnBackdrop={!saving} logo abaixo) — não
  // precisamos mais do useEffect de keydown manual que existia aqui.

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError('');
    }
  }

  function handlePriceChange(value: string) {
    const normalized = value.replace(',', '.');

    if (!/^\d*(\.\d{0,2})?$/.test(normalized)) {
      return;
    }

    updateField('price', normalized);
  }

  function handleDurationChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    updateField('duration', digits);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const duration = Number(form.duration);
    const price = Number(form.price);

    if (!name) {
      setError('Informe o nome do serviço.');
      return;
    }

    if (!duration || duration <= 0) {
      setError('Informe uma duração válida.');
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setError('Informe um valor válido.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const service = await createService({
        name,
        description: description || null,
        duration,
        price,
      });

      toast.success('Serviço criado com sucesso!');

      onCreated?.(service);
      onClose();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);

      const message = error instanceof Error ? error.message : 'Não foi possível criar o serviço.';

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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#f5ebe7] text-[#96776b]">
            <Sparkles size={17} strokeWidth={1.6} />
          </div>

          <div>
            <h2
              id="new-service-title"
              className="text-[15px] font-bold leading-tight text-[#3e332f]"
            >
              Criar serviço
            </h2>
            <p className="mt-0.5 text-[10px] text-[#a78a7f]">Novo procedimento no seu catálogo</p>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#a78a7f] transition hover:bg-[#f5ebe7] hover:text-[#634f48] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label
              htmlFor="service-name"
              className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]"
            >
              <Sparkles size={12} />
              Nome do serviço
            </label>

            <input
              id="service-name"
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Ex.: Limpeza de pele"
              maxLength={100}
              autoFocus
              disabled={saving}
              className="h-11 w-full rounded-[12px] border border-[#e5dad5] bg-white px-3.5 text-[12px] font-medium text-[#54423c] outline-none transition placeholder:text-[#c4afa6] focus:border-[#b99a8e] focus:ring-2 focus:ring-[#d8c0b6]/30 disabled:cursor-not-allowed disabled:bg-[#f5f1ef]"
            />
          </div>

          <div>
            <label
              htmlFor="service-description"
              className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]"
            >
              <FileText size={12} />
              Descrição
            </label>

            <textarea
              id="service-description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Descreva brevemente o procedimento..."
              maxLength={500}
              rows={3}
              disabled={saving}
              className="w-full resize-none rounded-[12px] border border-[#e5dad5] bg-white px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-[#54423c] outline-none transition placeholder:text-[#c4afa6] focus:border-[#b99a8e] focus:ring-2 focus:ring-[#d8c0b6]/30 disabled:cursor-not-allowed disabled:bg-[#f5f1ef]"
            />

            <div className="mt-1 flex justify-end">
              <span className="text-[8px] text-[#c0aaa1]">{form.description.length}/500</span>
            </div>
          </div>

          {/* Duration + Price */}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="service-duration"
                className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]"
              >
                <Clock3 size={12} />
                Duração
              </label>

              <div className="relative">
                <input
                  id="service-duration"
                  type="text"
                  inputMode="numeric"
                  value={form.duration}
                  onChange={(event) => handleDurationChange(event.target.value)}
                  placeholder="60"
                  disabled={saving}
                  className="h-11 w-full rounded-[12px] border border-[#e5dad5] bg-white px-3.5 pr-11 text-[12px] font-medium text-[#54423c] outline-none transition placeholder:text-[#c4afa6] focus:border-[#b99a8e] focus:ring-2 focus:ring-[#d8c0b6]/30 disabled:cursor-not-allowed disabled:bg-[#f5f1ef]"
                />

                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#ad958b]">
                  min
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="service-price"
                className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]"
              >
                <DollarSign size={12} />
                Valor
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#ad958b]">
                  R$
                </span>

                <input
                  id="service-price"
                  type="text"
                  inputMode="decimal"
                  value={form.price.replace('.', ',')}
                  onChange={(event) => handlePriceChange(event.target.value)}
                  placeholder="0,00"
                  disabled={saving}
                  className="h-11 w-full rounded-[12px] border border-[#e5dad5] bg-white px-3.5 pl-10 text-[12px] font-medium text-[#54423c] outline-none transition placeholder:text-[#c4afa6] focus:border-[#b99a8e] focus:ring-2 focus:ring-[#d8c0b6]/30 disabled:cursor-not-allowed disabled:bg-[#f5f1ef]"
                />
              </div>
            </div>
          </div>

          {/* Default status */}

          <div className="flex items-center gap-3 rounded-[14px] border border-[#eee3de] bg-[#fbf8f6] px-3.5 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#edf4ed] text-[#77917b]">
              <span className="text-[11px]">✓</span>
            </div>

            <div>
              <p className="text-[9px] font-bold text-[#80685e]">Serviço ativo</p>
              <p className="mt-0.5 text-[8px] text-[#b39b91]">
                Ficará disponível para agendamento imediatamente.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-[12px] border border-[#ead3cf] bg-[#fff5f3] px-3.5 py-2.5">
              <p className="text-[9px] font-semibold leading-relaxed text-[#a45f59]">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex shrink-0 gap-2 border-t border-[#f0e6e0] px-6 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-11 flex-1 rounded-[12px] border border-[#eaded8] bg-white text-[10px] font-bold text-[#a98c82] transition hover:bg-[#faf5f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex h-11 flex-[1.5] items-center justify-center gap-2 rounded-[12px] bg-[#3f332f] text-[10px] font-bold text-white shadow-[0_12px_25px_-15px_rgba(45,32,27,.7)] transition hover:bg-[#332925] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Criando...
              </>
            ) : (
              <>
                <Plus size={14} />
                Criar serviço
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
