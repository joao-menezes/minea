'use client';

import { ArrowLeft, CalendarDays, Check, Clock3, Sparkles } from 'lucide-react';

type AppointmentSummaryProps = {
  serviceName: string;
  serviceDuration: number;
  price: number;
  date: string;
  time: string;
  onBack: () => void;
  onContinue: () => void;
};

export function AppointmentSummary({
  serviceName,
  serviceDuration,
  price,
  date,
  time,
  onBack,
  onContinue,
}: AppointmentSummaryProps) {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-7 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f3f0] text-[#5f5551] transition hover:bg-[#eee7e3]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a08d84]">
            Novo agendamento
          </p>

          <h2 className="text-2xl font-[var(--font-cormorant)] font-semibold text-[#403936]">
            Confira os detalhes
          </h2>
        </div>
      </div>

      {/* Service */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#403936] p-6 text-white">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/50">
            Serviço escolhido
          </p>

          <h3 className="mt-1 text-3xl font-[var(--font-cormorant)] font-semibold">
            {serviceName}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
            <Clock3 className="h-4 w-4" />
            {serviceDuration} minutos
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-4 rounded-2xl bg-[#fffaf8] p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
            <CalendarDays className="h-5 w-5 text-[#90796f]" />
          </div>

          <div>
            <p className="text-[11px] text-[#a2938c]">Data</p>

            <p className="mt-0.5 text-sm font-semibold capitalize text-[#514742]">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#fffaf8] p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
            <Clock3 className="h-5 w-5 text-[#90796f]" />
          </div>

          <div>
            <p className="text-[11px] text-[#a2938c]">Horário</p>

            <p className="mt-0.5 text-sm font-semibold text-[#514742]">{time}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#eee7e3] pt-5">
        <span className="text-sm text-[#8e817b]">Total</span>

        <span className="text-2xl font-semibold text-[#403936]">
          {price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#403936] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#403936]/10 transition hover:-translate-y-0.5 hover:bg-[#514945]"
      >
        Continuar para pagamento
        <Check className="h-4 w-4" />
      </button>

      <p className="mt-3 text-center text-[11px] leading-5 text-[#a0948f]">
        Seu horário será confirmado após a confirmação do pagamento.
      </p>
    </div>
  );
}
