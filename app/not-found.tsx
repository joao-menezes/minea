'use client';

import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf6f3] px-5 py-10 text-[#6b5850]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f0e0d7]/60 blur-3xl motion-safe:animate-[float_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#ead8ce]/60 blur-3xl motion-safe:animate-[float_11s_ease-in-out_infinite_reverse]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#eaded8]/70" />

      <div className="relative w-full max-w-[520px] text-center motion-safe:animate-[rise_0.7s_ease-out]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_18px_40px_-20px_rgba(138,111,99,.45)] ring-1 ring-[#eaded8] motion-safe:animate-[float_6s_ease-in-out_infinite]">
          <img src="/icon.ico" alt="Minea" className="h-8 w-8" />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.32em] text-[#c2a99d]">
          Minea
        </p>

        <div className="relative mt-6 flex items-center justify-center">
          <p className="bg-gradient-to-b from-[#c2a99d] to-[#8a6f63] bg-clip-text font-display text-[96px] leading-[0.8] tracking-[-0.07em] text-transparent">
            404
          </p>
        </div>

        <h1 className="mt-8 font-display text-[30px] tracking-[-0.03em] text-[#6b5850]">
          Parece que essa pagina não existe
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-[#a48a7f]">
          A página que você procura pode ter sido movida ou não está mais disponível.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {/*<Link*/}
          {/*  href="/"*/}
          {/*  className="flex h-11 items-center justify-center gap-2 rounded-[15px] bg-[#8a6f63] px-5 text-[10px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition hover:-translate-y-0.5 hover:bg-[#7c6156] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6f63]"*/}
          {/*>*/}
          {/*  <Home size={14} strokeWidth={1.8} />*/}
          {/*  Ir para o início*/}
          {/*  <ArrowRight size={14} strokeWidth={1.8} />*/}
          {/*</Link>*/}

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-11 items-center justify-center gap-2 rounded-[15px] border border-[#eaded8] bg-white/75 px-5 text-[10px] font-bold text-[#8a6f63] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6f63]"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            Voltar
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
