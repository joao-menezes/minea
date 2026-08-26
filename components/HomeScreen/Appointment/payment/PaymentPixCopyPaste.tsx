import { CheckCircle2, Copy } from 'lucide-react';

type PaymentPixCopyPasteProps = {
  code: string;
  copied: boolean;
  onCopy: () => void;
};

export function PaymentPixCopyPaste({ code, copied, onCopy }: PaymentPixCopyPasteProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#927970]">
          PIX Copia e Cola
        </p>

        <span className="text-[9px] text-[#b09d96]">Alternativa ao QR Code</span>
      </div>

      <div className="flex items-center gap-2 rounded-[18px] border border-[#e8dfdb] bg-[#faf8f6] p-2">
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate font-mono text-[10px] text-[#8c7a73]">{code}</p>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className={`flex shrink-0 items-center gap-1.5 rounded-[13px] px-3.5 py-2.5 text-[10px] font-bold transition ${
            copied ? 'bg-[#edf5ea] text-[#62865b]' : 'bg-[#463b37] text-white hover:bg-[#564944]'
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
  );
}
