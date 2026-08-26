'use client';

import { useState } from 'react';

import { Check, Edit3, Sparkles, X } from 'lucide-react';

import { ServiceDetail } from '@/app/admin/servicos/ServiceDetail';
import { BaseModal } from '@/components/BaseModal';
import type { Service } from '@/types';
import { formatCurrency } from '@/utils/utils';

type ServiceModalProps = {
  service: Service | null;
  onClose: () => void;
  onSave?: (updated: Service) => void | Promise<void>;
};

export function ServiceModal({ service, onClose, onSave }: ServiceModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', duration: '' });

  if (!service) {
    return null;
  }

  function startEditing() {
    if (!service) return;
    setForm({
      name: service.name ?? '',
      price: String(service.price ?? ''),
      duration: String(service.duration ?? ''),
    });
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function handleSave() {
    if (!service) return;

    const updated: Service = {
      ...service,
      name: form.name.trim(),
      price: Number(form.price.replace(',', '.')) || 0,
      duration: Number(form.duration) || 0,
    };

    try {
      setSaving(true);
      await onSave?.(updated);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <BaseModal open onClose={onClose} closeLabel="Fechar detalhes do serviço">
      <div className="relative overflow-hidden bg-[#ead8cf] px-6 pb-7 pt-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/40 bg-white/15" />

        <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#c5a394]/15 blur-xl" />

        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/60 bg-white/35 text-[#96776b] backdrop-blur">
            <Sparkles size={21} strokeWidth={1.5} />
          </div>

          <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.28em] text-[#a78a7f]">
            Serviço
          </p>

          {isEditing ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do serviço"
              className="mt-2 w-full max-w-[350px] rounded-xl border border-white/60 bg-white/70 px-3 py-2 font-display text-[24px] leading-[1.1] tracking-[-0.02em] text-[#634f48] outline-none focus:border-[#96776b]"
            />
          ) : (
            <h2 className="mt-2 max-w-[350px] font-display text-[31px] leading-[1.02] tracking-[-0.03em] text-[#634f48]">
              {service.name}
            </h2>
          )}
        </div>
      </div>

      <div className="p-6">
        {!isEditing && (
          <p className="text-[11px] leading-relaxed text-[#a58c82]">
            {service.description || 'Nenhuma descrição informada.'}
          </p>
        )}

        {isEditing ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wide text-[#a78a7f]">
                Valor (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="0,00"
                className="mt-1 h-11 w-full rounded-[14px] border border-[#eee3de] bg-white px-3 text-[12px] text-[#493a35] outline-none focus:border-[#c9afa5]"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-wide text-[#a78a7f]">
                Duração (min)
              </label>
              <input
                type="number"
                min={0}
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="0"
                className="mt-1 h-11 w-full rounded-[14px] border border-[#eee3de] bg-white px-3 text-[12px] text-[#493a35] outline-none focus:border-[#c9afa5]"
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <ServiceDetail label="Valor" value={formatCurrency(Number(service.price ?? 0))} />

            <ServiceDetail label="Duração" value={`${service.duration} min`} />
          </div>
        )}

        {!isEditing && (
          <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[#eee3de] bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-[12px]',
                  service.active ? 'bg-[#edf4ed] text-[#77917b]' : 'bg-[#f8efeb] text-[#a47f70]',
                ].join(' ')}
              >
                <span className="text-[12px]">{service.active ? '✓' : '×'}</span>
              </div>

              <div>
                <p className="text-[9px] font-bold text-[#80685e]">
                  {service.active ? 'Serviço ativo' : 'Serviço inativo'}
                </p>

                <p className="mt-0.5 text-[8px] text-[#b39b91]">
                  {service.active
                    ? 'Disponível para agendamento'
                    : 'Não disponível para agendamento'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#3f332f] text-[10px] font-bold text-white shadow-[0_15px_30px_-18px_rgba(45,32,27,.7)] transition hover:bg-[#332925] disabled:opacity-60"
              >
                <Check size={14} />
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                aria-label="Cancelar edição"
                className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#eaded8] bg-white text-[#a98c82] transition hover:bg-[#faf5f2]"
              >
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEditing}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#3f332f] text-[10px] font-bold text-white shadow-[0_15px_30px_-18px_rgba(45,32,27,.7)] transition hover:bg-[#332925]"
              >
                <Edit3 size={14} />
                Editar serviço
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#eaded8] bg-white text-[#a98c82] transition hover:bg-[#faf5f2]"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
