'use client';

import { useMemo, useState } from 'react';

import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Sparkles, X } from 'lucide-react';

import { PaymentPixModal } from '@/components/HomeScreen/Appointment/payment/PaymentPixModal';
import { createAppointment } from '@/lib/api/appointments';
import { createPixPayment } from '@/lib/api/payment';
import type { Appointment, PendingAppointment, PixPayment, Service } from '@/types';

import { WEEKDAYS } from '../../decor';

type BookingStep = 1 | 2 | 3;

type BookingFlowProps = {
  userId: string;
  services: Service[];
  loadingServices: boolean;
  servicesError: string | null;
  onClose: () => void;
  onComplete: (appointment: Appointment) => void;
};

export function BookingFlow({
  userId,
  services,
  loadingServices,
  servicesError,
  onClose,
  onComplete,
}: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState<PendingAppointment | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [payment, setPayment] = useState<PixPayment | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  function selectService(id: string) {
    setSelectedServiceId((current) => (current === id ? null : id));
    setError('');
  }

  function next() {
    if (step === 1) {
      if (selectedServiceId === null) {
        setError('Escolha um procedimento para continuar.');
        return;
      }

      setError('');
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedDate) {
        setError('Escolha uma data para continuar.');
        return;
      }

      if (!selectedTime) {
        setError('Escolha um horário para continuar.');
        return;
      }

      setError('');
      setStep(3);
    }
  }

  function back() {
    setError('');

    if (step === 1) {
      onClose();
      return;
    }

    setStep((current) => (current - 1) as BookingStep);
  }

  async function finish() {
    if (!selectedService || !selectedDate || !selectedTime) {
      return;
    }

    const appointmentDate = new Date(selectedDate);

    const [hours, minutes] = selectedTime.split(':');

    appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);

    const pending: PendingAppointment = {
      appointmentId: '',
      userId,
      serviceId: selectedService.id,
      date: appointmentDate.toISOString(),
      time: selectedTime,
      service: selectedService,
    };

    setError('');

    try {
      const savedAppointment = await createAppointment({
        userId: pending.userId,
        serviceId: pending.serviceId,
        date: pending.date,
        time: pending.time,
      });

      const pixPayment = await createPixPayment(savedAppointment.id);

      setCreatedAppointment(savedAppointment);
      setPendingAppointment({ ...pending, appointmentId: savedAppointment.id });
      setPayment(pixPayment);
      setPaymentOpen(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.');
    }
  }

  function confirmAppointment() {
    if (!pendingAppointment || !createdAppointment) return;

    setPaymentOpen(false);
    setPendingAppointment(null);
    setPayment(null);
    setCreatedAppointment(null);
    onComplete(createdAppointment);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[30px] bg-[#fffdfc] shadow-[0_25px_80px_-30px_rgba(67,47,40,.45)] sm:rounded-[30px]">
        <div className="flex items-center justify-between border-b border-[#eee4df] px-5 py-4">
          <button
            type="button"
            onClick={back}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#80665c] transition hover:bg-[#f4ece8]"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a38379]">
              Agendamento
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#4b3b36]">
              {step === 1 && 'Escolha seu procedimento'}
              {step === 2 && 'Escolha data e horário'}
              {step === 3 && 'Confirme seu agendamento'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#80665c] transition hover:bg-[#f4ece8]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1.5 px-5 pt-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                item <= step ? 'bg-[#80665c]' : 'bg-[#eee4df]'
              }`}
            />
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {step === 1 && (
            <div>
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a38379]">
                  Procedimento
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[#4b3b36]">
                  O que você gostaria de fazer?
                </h2>

                <p className="mt-1.5 text-xs leading-relaxed text-[#9a837b]">
                  Selecione um procedimento para continuar seu agendamento.
                </p>
              </div>

              {loadingServices && (
                <div className="space-y-2.5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-[100px] animate-pulse rounded-[22px] border border-[#eee4df] bg-[#f8f3f0]"
                    />
                  ))}
                </div>
              )}

              {!loadingServices && servicesError && (
                <div className="rounded-[22px] border border-[#ead9d2] bg-[#f9efeb] p-4">
                  <p className="text-sm font-semibold text-[#80665c]">
                    Não foi possível carregar os procedimentos.
                  </p>

                  <p className="mt-1 text-xs text-[#9a837b]">{servicesError}</p>
                </div>
              )}

              {!loadingServices && !servicesError && services.length === 0 && (
                <div className="rounded-[22px] border border-[#eee4df] bg-[#faf7f5] p-5 text-center">
                  <Sparkles size={20} className="mx-auto text-[#a38379]" strokeWidth={1.5} />

                  <p className="mt-2 text-sm font-semibold text-[#4b3b36]">
                    Nenhum procedimento disponível
                  </p>
                </div>
              )}

              {!loadingServices && !servicesError && (
                <div className="space-y-2.5" role="radiogroup" aria-label="Procedimento">
                  {services.filter((service) => service.active).length > 0 ? (
                    services
                      .filter((service) => service.active)
                      .map((service) => {
                        const active = selectedServiceId === service.id;

                        return (
                          <button
                            key={service.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => selectService(service.id)}
                            className={`group relative w-full overflow-hidden rounded-[22px] border p-4 text-left transition-all duration-200 ${
                              active
                                ? 'border-[#b49a90] bg-[#f1e7e2] shadow-[0_12px_30px_-25px_rgba(67,47,40,.7)]'
                                : 'border-[#e7ded9] bg-white hover:-translate-y-[1px] hover:border-[#d9cbc5] hover:shadow-[0_12px_25px_-22px_rgba(67,47,40,.45)]'
                            }`}
                          >
                            {active && (
                              <div className="absolute inset-y-0 left-0 w-[3px] bg-[#80665c]" />
                            )}

                            <div className="flex items-center gap-3.5">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] transition-all ${
                                  active ? 'bg-[#80665c] text-white' : 'bg-[#f3ece8] text-[#95756b]'
                                }`}
                              >
                                {active ? (
                                  <Check size={18} strokeWidth={2} />
                                ) : (
                                  <Sparkles size={17} strokeWidth={1.5} />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-bold tracking-[-0.01em] text-[#4b3b36]">
                                  {service.name}
                                </p>

                                <p className="mt-1 truncate text-[10px] text-[#9a837b]">
                                  {service.description}
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#a38379]">
                                    {service.duration} min
                                  </span>

                                  <span className="h-1 w-1 rounded-full bg-[#c6aea5]" />

                                  <span className="text-[10px] font-bold text-[#775b52]">
                                    {formatCurrency(service.price)}
                                  </span>
                                </div>
                              </div>

                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                                  active
                                    ? 'border-[#80665c] bg-[#80665c]'
                                    : 'border-[#d8c9c3] bg-white'
                                }`}
                              >
                                {active && <div className="h-2 w-2 rounded-full bg-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })
                  ) : (
                    <div className="rounded-[22px] border border-[#e7ded9] bg-white px-5 py-8 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#f3ece8] text-[#a98b80]">
                        <Sparkles size={17} strokeWidth={1.5} />
                      </div>

                      <p className="mt-3 text-[11px] font-bold text-[#66534c]">
                        Nenhum serviço disponível
                      </p>

                      <p className="mt-1 text-[9px] leading-relaxed text-[#a58b81]">
                        No momento, não existem procedimentos disponíveis para agendamento.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a38379]">
                  Data e horário
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[#4b3b36]">
                  Quando você prefere?
                </h2>
              </div>

              <div className="rounded-[22px] border border-[#e7ded9] bg-white p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-[#80665c]" />

                  <p className="text-sm font-bold text-[#4b3b36]">Escolha uma data</p>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map((weekday) => (
                    <div
                      key={weekday}
                      className="text-center text-[9px] font-bold uppercase text-[#a38379]"
                    >
                      {weekday}
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {buildCalendarDays(new Date()).map((date) => {
                    const active = selectedDate ? sameDay(selectedDate, date) : false;

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                          setError('');
                        }}
                        className={`flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition ${
                          active ? 'bg-[#80665c] text-white' : 'text-[#5d4942] hover:bg-[#f3ece8]'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-[#e7ded9] bg-white p-4">
                <div className="flex items-center gap-2">
                  <Clock3 size={17} className="text-[#80665c]" />

                  <p className="text-sm font-bold text-[#4b3b36]">Horários disponíveis</p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => {
                    const active = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setSelectedTime(time);
                          setError('');
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                          active
                            ? 'border-[#80665c] bg-[#80665c] text-white'
                            : 'border-[#e7ded9] bg-white text-[#775b52] hover:bg-[#f6efeb]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && selectedService && selectedDate && selectedTime && (
            <div>
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a38379]">
                  Confirmação
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[#4b3b36]">
                  Revise seu agendamento
                </h2>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#e7ded9] bg-white">
                <div className="bg-[#f1e7e2] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a38379]">
                    Procedimento
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#4b3b36]">{selectedService.name}</p>

                  <p className="mt-1 text-xs text-[#95756b]">
                    {selectedService.duration} min · {formatCurrency(selectedService.price)}
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9a837b]">Data</span>

                    <span className="text-sm font-bold text-[#4b3b36]">
                      {selectedDate.toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9a837b]">Horário</span>

                    <span className="text-sm font-bold text-[#4b3b36]">{selectedTime}</span>
                  </div>

                  <div className="h-px bg-[#eee4df]" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#9a837b]">Total</span>

                    <span className="text-lg font-bold text-[#80665c]">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-[16px] border border-[#ead9d2] bg-[#f9efeb] px-4 py-3">
              <p className="text-xs font-semibold text-[#80665c]">{error}</p>
            </div>
          )}
        </div>

        <div className="border-t border-[#eee4df] bg-[#fffdfc] p-5">
          <button
            type="button"
            onClick={step === 3 ? finish : next}
            disabled={step === 1 ? loadingServices || services.length === 0 : false}
            className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#80665c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#6f574e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === 3 ? 'Confirmar agendamento' : 'Continuar'}

            {step !== 3 && <ArrowRight size={17} />}
          </button>
        </div>
      </div>
      {pendingAppointment && payment && (
        <PaymentPixModal
          pendingAppointment={pendingAppointment}
          payment={payment}
          open={paymentOpen}
          onClose={() => {
            setPaymentOpen(false);
            setPendingAppointment(null);
          }}
          onPaymentApproved={confirmAppointment}
          onSkipPayment={confirmAppointment}
        />
      )}
    </div>
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function sameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function buildCalendarDays(referenceDate: Date): Date[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(new Date(year, month, index - firstDay.getDay() + 1));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1];

    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }

  return days;
}
