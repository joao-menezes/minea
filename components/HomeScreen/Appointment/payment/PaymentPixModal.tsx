'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/components/Modal';
import { getPayment } from '@/lib/api/payment';
import type { PendingAppointment, PixPayment } from '@/types';

import { PaymentPix } from './PaymentPix';

type PaymentPixModalProps = {
  pendingAppointment: PendingAppointment;
  payment: PixPayment;
  open: boolean;
  onClose: () => void;
  onPaymentApproved: () => void;
  onSkipPayment: () => void;
};

export function PaymentPixModal({
  pendingAppointment,
  payment: initialPayment,
  open,
  onClose,
  onPaymentApproved,
  onSkipPayment,
}: PaymentPixModalProps) {
  const [payment, setPayment] = useState(initialPayment);

  useEffect(() => {
    setPayment(initialPayment);
  }, [initialPayment]);

  useEffect(() => {
    if (!open || payment.status !== 'PENDING') {
      return;
    }

    const interval = window.setInterval(async () => {
      const updatedPayment = await getPayment(payment.id);
      setPayment({
        ...payment,
        ...updatedPayment,
        transactionAmount:
          updatedPayment.transactionAmount ??
          (updatedPayment as PixPayment & { amount?: number }).amount ??
          payment.transactionAmount,
        qrCode: updatedPayment.qrCode ?? payment.qrCode,
        qrCodeBase64: updatedPayment.qrCodeBase64 ?? payment.qrCodeBase64,
        dateOfExpiration:
          updatedPayment.dateOfExpiration ??
          (updatedPayment as PixPayment & { expiresAt?: string | null }).expiresAt ??
          payment.dateOfExpiration,
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [open, payment.id, payment.status]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pagamento PIX"
      description="Finalize o pagamento para confirmar seu agendamento."
      size="lg"
      contentClassName="bg-[#fdfaf8]"
    >
      <PaymentPix
        payment={payment}
        onBack={onClose}
        onConfirmed={onPaymentApproved}
        onSkipPayment={onSkipPayment}
      />
    </Modal>
  );
}
