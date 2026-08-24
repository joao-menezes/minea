'use client';

import { useState } from 'react';

import { Modal } from '@/components/Modal';
import type { PendingAppointment, PixPayment } from '@/types';

import { PaymentPix } from './PaymentPix';

type PaymentPixModalProps = {
  pendingAppointment: PendingAppointment;
  open: boolean;
  onClose: () => void;
  onPaymentApproved: () => void;
};

export function PaymentPixModal({
  pendingAppointment,
  open,
  onClose,
  onPaymentApproved,
}: PaymentPixModalProps) {
  const fakePayment: PixPayment = {
    id: 'test-payment',
    status: 'PENDING',
    transactionAmount: pendingAppointment.service.price,
    qrCode: '00020126580014BR.GOV.BCB.PIX0136teste-minea-pix',
    qrCodeBase64: null,
    ticketUrl: null,
    dateOfExpiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pagamento PIX"
      description="Finalize o pagamento para confirmar seu agendamento."
      size="md"
      contentClassName="bg-[#fdfaf8]"
    >
      <PaymentPix payment={fakePayment} onBack={onClose} onConfirmed={onPaymentApproved} />
    </Modal>
  );
}
