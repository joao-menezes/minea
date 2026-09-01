'use client';

import { useMemo, useState } from 'react';

import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react';

import { CustomCalendar } from '@/components/CustomCalendar';
import { CustomDropdown } from '@/components/CustomDropdown';
import { CustomTimePicker } from '@/components/CustomTimePicker';
import { PaymentPixModal } from '@/components/HomeScreen/Appointment/payment/PaymentPixModal';
import { createAppointment, deleteAppointment } from '@/lib/api/appointments';
import { createPixPayment } from '@/lib/api/payment';
import type { Appointment, Client, PendingAppointment, PixPayment, Service } from '@/types';

type BookingStep = 1 | 2 | 3;

type BookingFlowProps = {
  userId: string;
  services: Service[];
  clients?: Client[];
  adminMode?: boolean;
  loadingServices: boolean;
  servicesError: string | null;
  onClose: () => void;
  onComplete: (appointment: Appointment) => void;
  initialDate?: Date | null;
  initialClientId?: string | null;
};

export function BookingFlow({
  userId,
  services,
  clients = [],
  adminMode = false,
  loadingServices,
  servicesError,
  onClose,
  onComplete,
  initialDate = null,
  initialClientId = null,
}: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    adminMode ? initialClientId : userId,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState<PendingAppointment | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [payment, setPayment] = useState<PixPayment | null>(null);
  const [sinalAck, setSinalAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  const clientOptions = useMemo(
    () =>
      clients
        .filter((client) => client.isActive)
        .sort((first, second) => first.name.localeCompare(second.name))
        .map((client) => ({
          value: client.id,
          label: client.name,
        })),
    [clients],
  );

  function selectService(id: string) {
    setSelectedServiceId((current) => (current === id ? null : id));
    setError('');
  }

  function isBeforeToday(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() < today.getDate())
    );
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

      if (isBeforeToday(selectedDate)) {
        setError('Não é possível agendar para uma data anterior a hoje.');
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

    const targetUserId = adminMode ? selectedClientId : userId;

    if (!targetUserId) {
      setError('Escolha um cliente para continuar.');
      return;
    }

    if (!adminMode && !sinalAck) {
      setError('Confirme que está ciente do sinal de R$ 30 para concluir o agendamento.');
      return;
    }

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);

    setError('');
    setSubmitting(true);

    let savedAppointment: Appointment | null = null;

    try {
      savedAppointment = await createAppointment({
        userId: targetUserId,
        serviceId: selectedService.id,
        date: appointmentDate.toISOString(),
        time: selectedTime,
      });

      if (adminMode) {
        onComplete(savedAppointment);
        return;
      }

      await createPixPayment(savedAppointment.id);
      onComplete(savedAppointment);
    } catch (error) {
      if (savedAppointment && !adminMode) {
        try {
          await deleteAppointment(savedAppointment.id, targetUserId);
        } catch (rollbackError) {
          console.error(
            'Não foi possível desfazer o agendamento após falha no registro do sinal:',
            rollbackError,
          );
        }
      }

      setError(error instanceof Error ? error.message : 'Não foi possível concluir o agendamento.');
    } finally {
      setSubmitting(false);
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
              {step === 1 &&
                (adminMode ? 'Escolha cliente e procedimento' : 'Escolha seu procedimento')}
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
                  {adminMode ? 'Para quem e qual procedimento?' : 'O que você gostaria de fazer?'}
                </h2>

                <p className="mt-1.5 text-xs leading-relaxed text-[#9a837b]">
                  {adminMode
                    ? 'Selecione o cliente e o procedimento do agendamento.'
                    : 'Selecione um procedimento para continuar seu agendamento.'}
                </p>
              </div>

              {adminMode && (
                <div className="mb-5 rounded-[22px] border border-[#e7ded9] bg-white p-4">
                  <label
                    htmlFor="appointment-client"
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a38379]"
                  >
                    Cliente
                  </label>

                  <CustomDropdown
                    id="appointment-client"
                    value={selectedClientId ?? ''}
                    options={clientOptions}
                    placeholder="Selecione um cliente"
                    onChange={(clientId) => {
                      setSelectedClientId(clientId || null);
                      setError('');
                    }}
                  />

                  {clientOptions.length === 0 && (
                    <p className="mt-2 text-xs text-[#9a837b]">
                      Nenhum cliente ativo disponível para agendamento.
                    </p>
                  )}
                </div>
              )}

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

              <CustomCalendar
                value={selectedDate}
                minDate={new Date()}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setError('');
                }}
              />

              <CustomTimePicker
                value={selectedTime}
                onChange={(time) => {
                  setSelectedTime(time);
                  setError('');
                }}
              />
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
              {!adminMode && (
                <div className="mt-4 rounded-[22px] border border-[#e7ded9] bg-[#faf3ee] p-4">
                  <p className="text-xs leading-relaxed text-[#80665c]">
                    Para confirmar sua reserva, é necessário efetuar um{' '}
                    <strong>sinal de R$ 30</strong> (valor descontado do total no dia do
                    atendimento). O agendamento fica <strong>pendente</strong> até a confirmação do
                    pagamento e aprovação.
                  </p>

                  <label className="mt-3 flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={sinalAck}
                      onChange={(event) => {
                        setSinalAck(event.target.checked);
                        setError('');
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d8c9c3] text-[#80665c] focus:ring-[#80665c]"
                    />

                    <span className="text-[11px] font-semibold text-[#5c4a43]">
                      Estou ciente de que preciso pagar o sinal de R$ 30 para confirmar este
                      agendamento.
                    </span>
                  </label>
                </div>
              )}
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
            disabled={
              step === 1
                ? loadingServices ||
                  services.length === 0 ||
                  (adminMode && (!selectedClientId || clients.length === 0))
                : false
            }
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
