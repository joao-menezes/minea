import { QrCode } from 'lucide-react';

type PaymentPixQrCodeProps = {
  base64?: string | null;
};

export function PaymentPixQrCode({ base64 }: PaymentPixQrCodeProps) {
  const qrImage = base64 ? `data:image/png;base64,${base64}` : null;

  return (
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
  );
}
