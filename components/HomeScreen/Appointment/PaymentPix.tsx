'use client';

import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

import type { PixPayment } from '@/types';

type PaymentPixProps = {
  payment: PixPayment;
  onBack: () => void;
  onConfirmed?: () => void;
};

export function PaymentPix({ payment, onBack, onConfirmed }: PaymentPixProps) {
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState('');
  const [error, setError] = useState<String | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!payment.dateOfExpiration) {
      return;
    }

    const expiration = new Date(payment.dateOfExpiration).getTime();
    const totalDuration = expiration - Date.now();

    const updateTimer = () => {
      const difference = expiration - Date.now();

      if (difference <= 0) {
        setRemaining('Expirado');
        setProgress(0);
        return;
      }

      const minutes = Math.floor(difference / 1000 / 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setRemaining(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

      const pctRemaining = Math.min(100, Math.max(0, (difference / totalDuration) * 100));
      setProgress(pctRemaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [payment.dateOfExpiration]);

  useEffect(() => {
    if (payment.status === 'APPROVED') {
      onConfirmed?.();
    }
  }, [payment.status, onConfirmed]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copyPixCode() {
    if (!payment.qrCode) return;
    try {
      await navigator.clipboard.writeText(payment.qrCode);
      setCopied(true);
    } catch {
      setError('Error Inesperado');
    }
  }

  if (payment.status === 'APPROVED') {
    return (
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#f1f6ef]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f0df]">
            <Check className="h-7 w-7 text-[#62865b]" strokeWidth={2.5} />
          </div>
        </div>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#78956f]">
          Pagamento confirmado
        </p>

        <h2 className="mt-2 text-4xl font-[var(--font-cormorant)] font-semibold tracking-[-0.03em] text-[#403936]">
          Tudo certo ✨
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#817672]">
          Seu pagamento foi confirmado e seu horário na Minea está reservado.
        </p>

        <button
          type="button"
          onClick={onConfirmed}
          className="mt-8 w-full rounded-2xl bg-[#403936] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(64,57,54,.6)] transition hover:-translate-y-0.5 hover:bg-[#514945]"
        >
          Ver meu agendamento
        </button>
      </div>
    );
  }

  if (payment.status === 'REJECTED' || payment.status === 'CANCELLED') {
    return (
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#fdf1ef]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe4e0]">
            <QrCode className="h-7 w-7 text-[#c4776b]" />
          </div>
        </div>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#bd776d]">
          Pagamento não concluído
        </p>

        <h2 className="mt-2 text-4xl font-[var(--font-cormorant)] font-semibold tracking-[-0.03em] text-[#403936]">
          Vamos tentar novamente?
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#817672]">
          Não conseguimos confirmar este pagamento.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 w-full rounded-2xl bg-[#403936] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#514945]"
        >
          Voltar para o pagamento
        </button>
      </div>
    );
  }

  const qrImage = payment.qrCodeBase64 ? `data:image/png;base64,${payment.qrCodeBase64}` : null;

  return (
    <div className="bg-[#fffdfc] px-5 pb-7 pt-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f1ee] text-[#62544e] transition hover:bg-[#eee7e3]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#ad958b]">
            Pagamento
          </p>

          <h2 className="mt-0.5 text-[28px] font-[var(--font-cormorant)] font-semibold leading-none tracking-[-0.02em] text-[#403936]">
            Pague com PIX
          </h2>
        </div>

        <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f1ee]">
          <ShieldCheck className="h-4 w-4 text-[#92796f]" />
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[24px] bg-[#463b37] px-5 py-5 text-white shadow-[0_18px_40px_-25px_rgba(64,57,54,.8)]">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.05]" />

        <div className="relative flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Total do agendamento
            </p>

            <p className="mt-1 text-[30px] font-bold tracking-[-0.04em]">
              {payment.transactionAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <QrCode className="h-5 w-5 text-white/80" />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#eee5e1] bg-white p-5 shadow-[0_15px_45px_-30px_rgba(75,55,45,.3)]">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ad958b]">
            Escaneie para pagar
          </p>

          <p className="mt-1 text-xs text-[#958782]">Aponte a câmera do seu banco para o QR Code</p>
        </div>

        <div className="mx-auto mt-5 flex h-[220px] w-[220px] items-center justify-center rounded-[24px] border border-[#eee7e3] bg-[#faf8f6] p-4">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] bg-white">
            {qrImage ? (
              <img src={qrImage} alt="QR Code PIX" className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f4eeeb]">
                  <QrCode className="h-11 w-11 text-[#a58b80]" />
                </div>

                <p className="mt-3 text-[10px] font-semibold text-[#a18e86]">QR Code</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8c7167]" />

          <p className="text-xs font-semibold text-[#665650]">PIX instantâneo e seguro</p>
        </div>
      </div>

      {payment.qrCode && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#927970]">
              PIX Copia e Cola
            </p>

            <span className="text-[9px] text-[#b09d96]">Alternativa ao QR Code</span>
          </div>

          <div className="flex items-center gap-2 rounded-[18px] border border-[#e8dfdb] bg-[#faf8f6] p-2">
            <div className="min-w-0 flex-1 px-2">
              <p className="truncate font-mono text-[10px] text-[#8c7a73]">{payment.qrCode}</p>
            </div>

            <button
              type="button"
              onClick={copyPixCode}
              className={`flex shrink-0 items-center gap-1.5 rounded-[13px] px-3.5 py-2.5 text-[10px] font-bold transition ${
                copied
                  ? 'bg-[#edf5ea] text-[#62865b]'
                  : 'bg-[#463b37] text-white hover:bg-[#564944]'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-[20px] border border-[#eee4df] bg-[#f8f3f0]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-[#95786d]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#514742]">Aguardando pagamento</p>

            <p className="mt-0.5 text-[10px] text-[#95837c]">Estamos verificando seu PIX</p>
          </div>

          {remaining && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 shadow-sm">
              <Clock3 className="h-3.5 w-3.5 text-[#8e756b]" />

              <span className="font-mono text-[11px] font-bold text-[#6f5a52]">{remaining}</span>
            </div>
          )}
        </div>

        <div className="h-1 bg-[#eee5e1]">
          <div
            className="h-full rounded-full bg-[#a98b80] transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-[#a08b83]" />

        <p className="text-[10px] font-medium text-[#a08b83]">
          Pagamento protegido e processado com segurança
        </p>
      </div>
    </div>
  );
}
