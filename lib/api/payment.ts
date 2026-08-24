import { PixPayment } from '@/types';

const mockPayment: PixPayment = {
  id: 'payment-test',
  status: 'PENDING',
  transactionAmount: 120,
  qrCode: '000201010212...',
  qrCodeBase64: null,
  ticketUrl: null,
  dateOfExpiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
};
