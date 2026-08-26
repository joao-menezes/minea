'use client';

import { useEffect, useState } from 'react';

import { ShieldCheck } from 'lucide-react';

import { usePixExpiration } from '@/app/hooks/usePixExpiration';
import { PaymentPixSuccess } from '@/components/HomeScreen/Appointment/payment/PaymentPixSuccess';
import type { PixPayment } from '@/types';

import { PaymentPixAmount } from './PaymentPixAmount';
import { PaymentPixCopyPaste } from './PaymentPixCopyPaste';
import { PaymentPixError } from './PaymentPixError';
import { PaymentPixHeader } from './PaymentPixHeader';
import { PaymentPixQrCode } from './PaymentPixQrCode';
import { PaymentPixStatus } from './PaymentPixStatus';

type PaymentPixProps = {
  payment: PixPayment;
  onSkipPayment?: () => void;
  onBack: () => void;
  onConfirmed?: () => void;
};

export function PaymentPix({ payment, onSkipPayment, onBack, onConfirmed }: PaymentPixProps) {
  const [copied, setCopied] = useState(false);

  const { remaining, progress } = usePixExpiration(payment.dateOfExpiration);

  useEffect(() => {
    if (payment.status === 'APPROVED') {
      onConfirmed?.();
    }
  }, [payment.status, onConfirmed]);

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  async function copyPixCode() {
    if (!payment.qrCode) return;

    try {
      await navigator.clipboard.writeText(payment.qrCode);
      setCopied(true);
    } catch {
      throw new Error("Couldn't copy pix code");
    }
  }

  if (payment.status === 'APPROVED') {
    return <PaymentPixSuccess onConfirmed={onConfirmed} />;
  }

  if (
    payment.status === 'REJECTED' ||
    payment.status === 'CANCELLED' ||
    payment.status === 'EXPIRED'
  ) {
    return <PaymentPixError onBack={onBack} />;
  }

  return (
    <div className="bg-[#fffdfc] px-5 pb-7 pt-4">
      <PaymentPixHeader onBack={onBack} />

      <PaymentPixAmount amount={payment.transactionAmount} />

      <PaymentPixQrCode base64={payment.qrCodeBase64} />

      {payment.qrCode && (
        <PaymentPixCopyPaste code={payment.qrCode} copied={copied} onCopy={copyPixCode} />
      )}

      <PaymentPixStatus remaining={remaining} progress={progress} />

      <div className="mt-5 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#a08b83]" />

          <p className="text-[10px] font-medium text-[#a08b83]">
            Pagamento protegido e processado com segurança
          </p>
        </div>

        {onSkipPayment && process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={onSkipPayment}
            className="mt-4 w-full rounded-2xl border border-dashed border-[#cdbdb5] bg-[#faf7f5] px-5 py-3 text-xs font-semibold text-[#806e66] transition hover:bg-[#f4eeeb]"
          >
            Continuar sem pagamento — desenvolvimento
          </button>
        )}
      </div>
    </div>
  );
}
