'use client';

import { useEffect, useState } from 'react';

import { Check, Copy, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

import { Modal } from '@/components/Modal';
import { ApiRequestError } from '@/lib/api/client';
import { generateLoyaltyQr } from '@/lib/api/loyalty';

type LoyaltyQrModalProps = {
  appointmentId: string;
  clientName: string;
  open: boolean;
  onClose: () => void;
};

export function LoyaltyQrModal({ appointmentId, clientName, open, onClose }: LoyaltyQrModalProps) {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setQrImage(null);
      setLink(null);
      setError('');
      setCopied(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const { token, expiresInSeconds } = await generateLoyaltyQr(appointmentId);

        if (cancelled) return;

        const redeemUrl = `${window.location.origin}/fidelidade/resgatar?token=${encodeURIComponent(token)}`;
        const dataUrl = await QRCode.toDataURL(redeemUrl, { width: 280, margin: 1 });

        if (cancelled) return;

        setLink(redeemUrl);
        setQrImage(dataUrl);
        setSecondsLeft(expiresInSeconds);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiRequestError
              ? err.message
              : 'Não foi possível gerar o QR de fidelidade.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, appointmentId]);

  useEffect(() => {
    if (!qrImage || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [qrImage, secondsLeft]);

  async function copyLink() {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copiado!');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  }

  const expired = qrImage !== null && secondsLeft <= 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="QR de fidelidade"
      description={`Peça para ${clientName} escanear com a câmera do celular.`}
      size="sm"
      contentClassName="bg-[#fdfaf8]"
    >
      <div className="flex flex-col items-center gap-4 p-6">
        {loading && (
          <div className="flex h-[280px] w-[280px] items-center justify-center rounded-2xl border border-[#eadfd9] bg-white">
            <p className="text-xs text-[#a58f87]">Gerando QR...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex h-[280px] w-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-[#ead3cf] bg-[#fff4f2] px-4 text-center">
            <p className="text-xs font-semibold text-[#a45f59]">{error}</p>
          </div>
        )}

        {qrImage && !error && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImage}
              alt="QR code de fidelidade"
              className={[
                'h-[280px] w-[280px] rounded-2xl border border-[#eadfd9] bg-white p-3 transition-opacity',
                expired ? 'opacity-25' : 'opacity-100',
              ].join(' ')}
            />

            {expired && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-[#493a35] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white">
                  Expirado
                </span>
              </div>
            )}
          </div>
        )}

        {qrImage && !expired && !error && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8a6f63]">
            <Sparkles size={14} />
            Válido por mais {minutes}:{seconds}
          </div>
        )}

        {expired && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e7ddd8] bg-white px-4 py-2 text-xs font-semibold text-[#705b53] transition hover:bg-[#faf6f3]"
          >
            Fechar e gerar outro
          </button>
        )}

        {link && !expired && !error && (
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl border border-[#e7ddd8] bg-white px-4 py-2 text-xs font-semibold text-[#705b53] transition hover:bg-[#faf6f3]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Link copiado' : 'Copiar link'}
          </button>
        )}

        <p className="text-center text-[10px] leading-relaxed text-[#b49b90]">
          Esse código só vale para o atendimento de hoje de {clientName} e não pode ser usado de novo.
        </p>
      </div>
    </Modal>
  );
}
