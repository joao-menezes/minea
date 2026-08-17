'use client';

import { useMemo, useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Sparkles,
  X,
} from 'lucide-react';

import type { Appointment, Service } from '@/types';

import { MONTHS, WEEKDAYS } from './decor';

const SERVICES: Service[] = [
  {
    id: 'manutencao-tintura',
    name: 'Manutenção de tintura',
    desc: 'Retoque da cor para manter o resultado uniforme e elegante',
    duration: 60,
    price: 120,
  },
  {
    id: 'design-sobrancelhas',
    name: 'Design de sobrancelhas',
    desc: 'Modelagem personalizada para valorizar o formato do seu rosto',
    duration: 30,
    price: 55,
  },
  {
    id: 'design-tintura',
    name: 'Design + Tintura',
    desc: 'Design personalizado com coloração para realçar o olhar',
    duration: 75,
    price: 145,
  },
  {
    id: 'design-henna',
    name: 'Design + Henna',
    desc: 'Modelagem com henna para sobrancelhas mais definidas e preenchidas',
    duration: 50,
    price: 100,
  },
];

const TIMES = [
  '09:00',
  '09:30',
  '10:30',
  '11:30',
  '13:30',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

type NewAppointmentSheetProps = {
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
};

export default function NewAppointmentSheet({ onClose, onSave }: NewAppointmentSheetProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      return date;
    });
  }, []);

  const selectedServiceDetails = useMemo(() => {
    return selectedServices
      .map((id) => SERVICES.find((service) => service.id === id))
      .filter((service): service is Service => Boolean(service));
  }, [selectedServices]);

  const total = selectedServiceDetails.reduce((sum, service) => sum + service.price, 0);

  const duration = selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0);

  const selectedServiceNames = selectedServiceDetails.map((service) => service.name).join(' + ');

  function toggleService(id: string) {
    setSelectedServices((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

    setError('');
  }

  function next() {
    if (!selectedServices.length) {
      setError('Escolha pelo menos um procedimento para continuar.');
      return;
    }

    setError('');
    setStep(2);
  }

  function back() {
    setError('');
    setStep(1);
  }

  function confirm() {
    if (!selectedTime) {
      setError('Escolha um horário para continuar.');
      return;
    }

    const date = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);

    date.setHours(hours, minutes, 0, 0);

    onSave({
      id: Date.now(),
      title: selectedServiceNames,
      date,
      local: 'Studio Bella',
      services: selectedServices,
      duration,
      price: total,
      categoria: 'Autocuidado',
      cor: 'rosa',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#332925]/45 backdrop-blur-[7px] sm:items-center sm:p-6">
      <div className="relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-[36px] border border-white/80 bg-[#f9f6f3] shadow-[0_35px_100px_-35px_rgba(40,29,25,.7)] sm:max-h-[90vh] sm:rounded-[34px]">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="relative shrink-0 px-5 pt-3 sm:pt-5">
          <div className="mx-auto h-1 w-10 rounded-full bg-[#d8c7c0] sm:hidden" />
        </div>

        <header className="flex items-start justify-between px-6 pb-4 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#a88c82]">
                Minea
              </span>

              <span className="h-1 w-1 rounded-full bg-[#b99689]" />

              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#b4a19a]">
                Estética & Bem-estar
              </span>
            </div>

            <h2 className="mt-2 font-display text-[29px] leading-[1.04] tracking-[-0.035em] text-[#3e332f]">
              {step === 1 ? (
                <>
                  Escolha seus
                  <br />
                  cuidados
                </>
              ) : (
                <>
                  Escolha o seu
                  <br />
                  momento
                </>
              )}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e5dbd6] bg-white text-[#7d6962] transition-all hover:bg-[#f5efec] hover:text-[#4e3d37] active:scale-95"
          >
            <X size={16} strokeWidth={1.6} />
          </button>
        </header>

        {/* =========================================================
            PROGRESS
        ========================================================== */}

        <div className="flex items-center gap-2 px-6 pb-5">
          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#e5dcd7]">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-[#80665c] transition-all duration-500 ${
                step >= 1 ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#e5dcd7]">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-[#80665c] transition-all duration-500 ${
                step >= 2 ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>

        {/* =========================================================
            CONTENT
        ========================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-7">
          {step === 1 ? (
            <>
              {/* Intro */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-[#857069]">
                    Personalize seu atendimento
                  </p>

                  <p className="mt-1 text-[9px] text-[#aa9790]">
                    Selecione um ou mais procedimentos
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6dad5] bg-white text-[#9d7b70]">
                  <Sparkles size={15} strokeWidth={1.5} />
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2.5">
                {SERVICES.map((service) => {
                  const active = selectedServices.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`group relative w-full overflow-hidden rounded-[22px] border p-4 text-left transition-all duration-200 ${
                        active
                          ? 'border-[#b49a90] bg-[#f1e7e2] shadow-[0_12px_30px_-25px_rgba(67,47,40,.7)]'
                          : 'border-[#e7ded9] bg-white hover:-translate-y-[1px] hover:border-[#d9cbc5] hover:shadow-[0_12px_25px_-22px_rgba(67,47,40,.45)]'
                      } `}
                    >
                      {active && <div className="absolute inset-y-0 left-0 w-[3px] bg-[#80665c]" />}

                      <div className="flex items-center gap-3.5">
                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] transition-all ${active ? 'bg-[#80665c] text-white' : 'bg-[#f3ece8] text-[#95756b]'} `}
                        >
                          {active ? (
                            <Check size={18} strokeWidth={2} />
                          ) : (
                            <Sparkles size={17} strokeWidth={1.5} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold tracking-[-0.01em] text-[#4b3b36]">
                            {service.name}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-[#9a837b]">{service.desc}</p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#a38379]">
                              {service.duration} min
                            </span>

                            <span className="h-1 w-1 rounded-full bg-[#c6aea5]" />

                            <span className="text-[10px] font-bold text-[#775b52]">
                              R$ {service.price}
                            </span>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                            active ? 'border-[#80665c] bg-[#80665c]' : 'border-[#d8c9c3] bg-white'
                          } `}
                        >
                          {active && <Check size={11} className="text-white" strokeWidth={2.5} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected summary */}
              {selectedServices.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-y border-[#e8ddd8] py-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a1877e]">
                      Seu ritual
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#79645d]">
                      {selectedServices.length}{' '}
                      {selectedServices.length === 1 ? 'procedimento' : 'procedimentos'} ·{' '}
                      {duration} min
                    </p>
                  </div>

                  <p className="font-display text-[20px] text-[#55413a]">R$ {total}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-[14px] border border-[#edd4ce] bg-[#faece8] px-3.5 py-2.5">
                  <p className="text-[10px] font-semibold text-[#a34f43]">{error}</p>
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={next}
                className="group mt-5 flex h-[56px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#3f332f] text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(45,32,27,.8)] transition-all hover:-translate-y-0.5 hover:bg-[#342a27] active:scale-[.985]"
              >
                Escolher data e horário
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Back */}
              <button
                type="button"
                onClick={back}
                className="mb-5 flex items-center gap-1.5 text-[10px] font-bold text-[#80675f] transition-colors hover:text-[#4e3d37]"
              >
                <ArrowLeft size={14} strokeWidth={1.8} />
                Voltar aos procedimentos
              </button>

              {/* =====================================================
                  DATE
              ====================================================== */}

              <section className="rounded-[25px] border border-[#e6ddd8] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f1e8e4] text-[#80665c]">
                    <CalendarDays size={16} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a58b82]">
                      Disponibilidade
                    </p>

                    <p className="mt-0.5 text-[11px] font-bold text-[#55433d]">
                      Escolha o melhor dia
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {dates.map((date) => {
                    const active = date.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime('');
                          setError('');
                        }}
                        className={`min-w-[55px] rounded-[17px] border py-2.5 transition-all ${
                          active
                            ? 'border-[#80665c] bg-[#80665c] text-white shadow-[0_10px_20px_-13px_rgba(65,45,38,.9)]'
                            : 'border-transparent bg-[#f5eeeb] text-[#796159] hover:border-[#e2d4ce]'
                        } `}
                      >
                        <span
                          className={`block text-[8px] font-bold uppercase tracking-[0.05em] ${
                            active ? 'text-white/60' : 'text-[#aa9188]'
                          }`}
                        >
                          {WEEKDAYS[date.getDay()]}
                        </span>

                        <span className="mt-0.5 block text-[18px] font-bold">{date.getDate()}</span>

                        <span
                          className={`block text-[8px] ${
                            active ? 'text-white/60' : 'text-[#a68c84]'
                          }`}
                        >
                          {MONTHS[date.getMonth()].slice(0, 3)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* =====================================================
                  TIME
              ====================================================== */}

              <section className="mt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f1e8e4] text-[#80665c]">
                    <Clock3 size={16} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a58b82]">
                      Horários disponíveis
                    </p>

                    <p className="mt-0.5 text-[11px] font-bold text-[#55433d]">
                      Escolha o seu momento
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {TIMES.map((time) => {
                    const active = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setSelectedTime(time);
                          setError('');
                        }}
                        className={`h-11 rounded-[15px] border text-[11px] font-bold transition-all ${
                          active
                            ? 'border-[#80665c] bg-[#80665c] text-white shadow-[0_10px_20px_-13px_rgba(65,45,38,.9)]'
                            : 'border-[#e6ddd8] bg-white text-[#69554e] hover:border-[#cdbcb5] hover:bg-[#faf7f5]'
                        } `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* =====================================================
                  SUMMARY
              ====================================================== */}

              <section className="mt-6 overflow-hidden rounded-[25px] border border-[#e3d7d1] bg-[#f2e9e5]">
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9d8177]">
                      Seu ritual
                    </p>

                    <Heart size={15} strokeWidth={1.5} className="text-[#947166]" />
                  </div>

                  <p className="mt-2 text-[13px] font-bold leading-relaxed text-[#4d3c36]">
                    {selectedServiceNames}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold text-[#8d736a]">
                    <span>{selectedDate.toLocaleDateString('pt-BR')}</span>

                    {selectedTime && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#b39a91]" />
                        <span>{selectedTime}</span>
                      </>
                    )}

                    <span className="h-1 w-1 rounded-full bg-[#b39a91]" />

                    <span>{duration} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#ded1cb] bg-white/35 px-5 py-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#92766c]">
                    Total
                  </span>

                  <strong className="font-display text-[22px] tracking-[-0.02em] text-[#493831]">
                    R$ {total}
                  </strong>
                </div>
              </section>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-[14px] border border-[#edd4ce] bg-[#faece8] px-3.5 py-2.5">
                  <p className="text-[10px] font-semibold text-[#a34f43]">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={confirm}
                className="group mt-4 flex h-[56px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#3f332f] text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(45,32,27,.8)] transition-all hover:-translate-y-0.5 hover:bg-[#342a27] active:scale-[.985]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <Check size={14} strokeWidth={2.2} />
                </span>
                Confirmar meu horário
              </button>

              <p className="mt-3 text-center text-[9px] text-[#aa9690]">
                Seu horário será reservado após a confirmação.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
