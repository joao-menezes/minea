import { ArrowUpRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';

import { formatDate, formatTime } from '@/components/decor';
import type { Appointment } from '@/types';

type HomeHeroProps = {
  appointment?: Appointment;
};

export function HomeHero({ appointment }: HomeHeroProps) {
  return (
    <section className="group relative mt-7 min-h-[250px] overflow-hidden rounded-[34px] border border-white/60 bg-[#f2e2d9] shadow-[0_28px_60px_-32px_rgba(80,56,48,.25)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,.65),transparent_28%),linear-gradient(135deg,#faf3ee_0%,#f1e1d8_48%,#e3c9bb_100%)]" />

      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/40 bg-white/15" />

      <div className="absolute -right-4 top-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />

      <div className="absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-[#c9ac9e]/15 blur-xl" />

      <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/30 text-[#9b7c6e] backdrop-blur-md transition-transform duration-500 group-hover:rotate-6">
        <ArrowUpRight size={18} strokeWidth={1.7} />
      </div>

      <div className="relative flex min-h-[250px] flex-col justify-between p-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1.5 backdrop-blur-md">
          <Sparkles size={11} className="text-[#a3806f]" />

          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a3806f]">
            Seu próximo cuidado
          </span>
        </div>

        {appointment ? (
          <div className="pb-1">
            <p className="max-w-[275px] font-display text-[31px] leading-[1.04] tracking-[-0.025em] text-[#6b5850]">
              {appointment.title}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <HeroInfo icon={CalendarDays} value={formatDate(appointment.date)} />

              <HeroInfo icon={Clock3} value={formatTime(appointment.date)} />
            </div>
          </div>
        ) : (
          <div className="pb-1">
            <p className="max-w-[290px] font-display text-[31px] leading-[1.04] tracking-[-0.025em] text-[#6b5850]">
              Um momento só seu.
            </p>

            <p className="mt-3 max-w-[260px] text-[11px] leading-relaxed text-[#a48a7f]">
              Seu próximo ritual de autocuidado começa com um simples agendamento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function HeroInfo({ icon: Icon, value }: { icon: typeof CalendarDays; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1.5 text-[#9b7c6e] backdrop-blur-sm">
      <Icon size={12} />

      <span className="text-[10px] font-semibold">{value}</span>
    </div>
  );
}
