'use client';

import type { MouseEvent } from 'react';

import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';
import type { Service } from '@/types';

type ServiceCardProps = {
  service: Service;
  onClick: () => void;
  onToggleActive: (service: Service) => void;
  updating?: boolean;
};

export function ServiceCard({
  service,
  onClick,
  onToggleActive,
  updating = false,
}: ServiceCardProps) {
  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (updating) return;

    onToggleActive(service);
  }

  const isActive = service.active;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className={[
        'group relative cursor-pointer overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-300',
        isActive
          ? [
              'border-[#eee5df]',
              'bg-white',
              'shadow-[0_18px_38px_-30px_rgba(64,46,40,.3)]',
              'hover:-translate-y-1',
              'hover:border-[#e4d4cc]',
              'hover:shadow-[0_26px_50px_-30px_rgba(64,46,40,.38)]',
            ].join(' ')
          : [
              'border-[#dedbd8]',
              'bg-[#eeeeed]',
              'shadow-[0_14px_30px_-28px_rgba(70,65,61,.25)]',
              'grayscale-[0.2]',
              'opacity-[0.78]',
              'hover:border-[#d5d1ce]',
              'hover:opacity-[0.86]',
            ].join(' '),
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full transition-transform duration-500',
          isActive ? 'bg-[#f7eee9] group-hover:scale-125' : 'bg-[#dedddb] opacity-70',
        ].join(' ')}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={[
              'flex h-12 w-12 items-center justify-center rounded-[17px] transition-all duration-300',
              isActive
                ? 'bg-[#f5ebe7] text-[#a88a7e] group-hover:scale-105'
                : 'bg-[#dedddb] text-[#85817e]',
            ].join(' ')}
          >
            <Sparkles size={17} strokeWidth={1.5} />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={[
                'rounded-full border px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em]',
                isActive
                  ? 'border-[#dce9df] bg-[#edf4ee] text-[#66806d]'
                  : 'border-[#d6d3d0] bg-[#e5e3e1] text-[#817d7a]',
              ].join(' ')}
            >
              {isActive ? 'Ativo' : 'Inativo'}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label={isActive ? 'Desativar serviço' : 'Ativar serviço'}
              disabled={updating}
              onClick={handleToggle}
              className={[
                'relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-all duration-200',
                'disabled:cursor-wait disabled:opacity-60',
                isActive ? 'bg-[#8ca891]' : 'bg-[#aaa7a4]',
              ].join(' ')}
            >
              <span
                className={[
                  'block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                  isActive ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        <p
          className={[
            'mt-5 text-[8px] font-bold uppercase tracking-[0.22em]',
            isActive ? 'text-[#bea096]' : 'text-[#96928f]',
          ].join(' ')}
        >
          Procedimento
        </p>

        <h3
          className={[
            'mt-2 font-display text-[23px] leading-[1.04] tracking-[-0.025em]',
            isActive ? 'text-[#624e47]' : 'text-[#777471]',
          ].join(' ')}
        >
          {service.name}
        </h3>

        <p
          className={[
            'mt-3 line-clamp-2 min-h-[31px] text-[9px] leading-relaxed',
            isActive ? 'text-[#ae958b]' : 'text-[#96928f]',
          ].join(' ')}
        >
          {service.description || 'Nenhuma descrição informada.'}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p
              className={[
                'text-[8px] font-bold uppercase tracking-[0.13em]',
                isActive ? 'text-[#c1a69b]' : 'text-[#999592]',
              ].join(' ')}
            >
              Valor
            </p>

            <p
              className={[
                'mt-1 font-display text-[25px] tracking-[-0.025em]',
                isActive ? 'text-[#80665c]' : 'text-[#777471]',
              ].join(' ')}
            >
              {formatCurrency(Number(service.price ?? 0))}
            </p>
          </div>

          <div
            className={[
              'flex items-center gap-1.5 rounded-full px-3 py-1.5',
              isActive ? 'bg-[#faf6f3] text-[#a98c81]' : 'bg-[#e2e0de] text-[#85817e]',
            ].join(' ')}
          >
            <Clock3 size={11} strokeWidth={1.7} />

            <span className="text-[8px] font-bold">{service.duration} min</span>
          </div>
        </div>

        <div
          className={[
            'mt-5 flex items-center justify-between border-t pt-4',
            isActive ? 'border-[#f1e8e3]' : 'border-[#d9d6d3]',
          ].join(' ')}
        >
          <div
            className={[
              'flex items-center gap-1.5',
              isActive ? 'text-[#b29a90]' : 'text-[#898582]',
            ].join(' ')}
          >
            <span
              className={['h-2 w-2 rounded-full', isActive ? 'bg-[#8ca891]' : 'bg-[#999592]'].join(
                ' ',
              )}
            />

            <span className="text-[8px] font-semibold">
              {isActive ? 'Disponível para agendamento' : 'Indisponível'}
            </span>
          </div>

          <span
            className={[
              'flex h-8 w-8 items-center justify-center rounded-full transition-all',
              isActive
                ? 'text-[#c8b0a6] group-hover:bg-[#faf4f1] group-hover:text-[#97786c]'
                : 'text-[#999592]',
            ].join(' ')}
          >
            <ArrowUpRight size={14} strokeWidth={1.7} />
          </span>
        </div>
      </div>
    </div>
  );
}
