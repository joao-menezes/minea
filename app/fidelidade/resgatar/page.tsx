'use client';

import { Suspense, useEffect, useState } from 'react';

import { LogIn, PartyPopper, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { getCurrentUser } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/client';
import { redeemLoyaltyToken } from '@/lib/api/loyalty';
import type { LoyaltyStatus } from '@/types';

type ViewState = 'checking' | 'need-login' | 'redeeming' | 'success' | 'error';

export default function RedeemLoyaltyPage() {
  return (
    <Suspense fallback={<CenteredCard><Sparkles className="animate-pulse text-[#a98d81]" /></CenteredCard>}>
      <RedeemLoyaltyContent />
    </Suspense>
  );
}

function RedeemLoyaltyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<ViewState>('checking');
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Esse link de fidelidade está incompleto. Peça para a clínica gerar um novo QR.');
      setState('error');
      return;
    }

    let cancelled = false;

    async function run() {
      const user = await getCurrentUser();

      if (cancelled) return;

      if (!user) {
        setState('need-login');
        return;
      }

      setState('redeeming');

      try {
        const result = await redeemLoyaltyToken(token as string);

        if (cancelled) return;

        setStatus(result);
        setState('success');
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof ApiRequestError
            ? err.message
            : 'Não foi possível resgatar o ponto de fidelidade.',
        );
        setState('error');
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === 'checking' || state === 'redeeming') {
    return (
      <CenteredCard>
        <Sparkles size={28} className="animate-pulse text-[#a98d81]" />
        <p className="mt-4 text-sm text-[#a48a7f]">
          {state === 'checking' ? 'Verificando sua sessão...' : 'Resgatando seu ponto...'}
        </p>
      </CenteredCard>
    );
  }

  if (state === 'need-login') {
    return (
      <CenteredCard>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6ede8] text-[#8a6f63]">
          <LogIn size={22} />
        </div>

        <h1 className="mt-5 font-display text-[24px] text-[#6b5850]">Entre para continuar</h1>

        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#a48a7f]">
          Você precisa estar logado na sua conta Minea para resgatar o ponto de fidelidade. Entre e
          peça para escanear o QR de novo.
        </p>

        <a
          href="/"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#8a6f63] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#7c6156]"
        >
          Ir para o login
        </a>
      </CenteredCard>
    );
  }

  if (state === 'success' && status) {
    const isRewardReady = status.rewardsAvailable > 0;

    return (
      <CenteredCard>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#66806d]">
          <PartyPopper size={22} />
        </div>

        <h1 className="mt-5 font-display text-[26px] text-[#6b5850]">Ponto conquistado!</h1>

        <p className="mt-2 text-sm text-[#a48a7f]">
          Você está em <strong className="text-[#6b5850]">{status.progress}/{status.pointsPerReward}</strong> nesse
          ciclo de fidelidade.
        </p>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#f1e8e2]">
          <div
            className="h-full rounded-full bg-[#8a6f63] transition-all"
            style={{ width: `${(status.progress / status.pointsPerReward) * 100}%` }}
          />
        </div>

        {isRewardReady && (
          <p className="mt-4 rounded-xl bg-[#f6ede8] px-4 py-3 text-xs font-bold text-[#8a6f63]">
            🎉 Você completou o cartão! Fale com a clínica para resgatar sua recompensa.
          </p>
        )}
      </CenteredCard>
    );
  }

  return (
    <CenteredCard>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbefed] text-[#9b5d53]">
        <X size={22} />
      </div>

      <h1 className="mt-5 font-display text-[24px] text-[#6b5850]">Não foi possível resgatar</h1>

      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#a48a7f]">{error}</p>
    </CenteredCard>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] px-5">
      <div className="flex w-full max-w-sm flex-col items-center rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_22px_50px_-34px_rgba(64,46,40,.28)] backdrop-blur">
        {children}
      </div>
    </main>
  );
}
