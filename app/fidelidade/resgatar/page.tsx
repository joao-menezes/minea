'use client';

import { Suspense, useEffect, useState } from 'react';

import { CheckCircle2, Gift, LogIn, PartyPopper, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { getCurrentUser } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/client';
import { getMyLoyaltyStatus, redeemLoyaltyToken, redeemMyLoyaltyReward } from '@/lib/api/loyalty';
import type { LoyaltyStatus } from '@/types';

type ViewState = 'checking' | 'need-login' | 'ready' | 'error';

export default function LoyaltyPage() {
  return (
    <Suspense fallback={<CenteredCard><Sparkles className="animate-pulse text-[#a98d81]" /></CenteredCard>}>
      <LoyaltyContent />
    </Suspense>
  );
}

function LoyaltyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<ViewState>('checking');
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [pointEarned, setPointEarned] = useState(false);
  const [rewardJustRedeemed, setRewardJustRedeemed] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState(false);
  const [actionError, setActionError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const user = await getCurrentUser();

      if (cancelled) return;

      if (!user) {
        setState('need-login');
        return;
      }

      try {
        const result = token ? await redeemLoyaltyToken(token) : await getMyLoyaltyStatus();

        if (cancelled) return;

        setStatus(result);
        setPointEarned(Boolean(token));
        setState('ready');
      } catch (err) {
        if (cancelled) return;

        // Recarregar a página com um QR já usado não deve parecer erro: mostra o cartão atual.
        if (token && err instanceof ApiRequestError && err.status === 409) {
          try {
            setStatus(await getMyLoyaltyStatus());
            setState('ready');
            return;
          } catch {
            // cai no erro abaixo
          }
        }

        setError(
          err instanceof ApiRequestError
            ? err.message
            : 'Não foi possível carregar seu cartão fidelidade.',
        );
        setState('error');
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleRedeemReward() {
    if (redeemingReward) return;

    try {
      setRedeemingReward(true);
      setActionError('');
      setStatus(await redeemMyLoyaltyReward());
      setRewardJustRedeemed(true);
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError ? err.message : 'Não foi possível resgatar sua recompensa.',
      );
    } finally {
      setRedeemingReward(false);
    }
  }

  if (state === 'checking') {
    return (
      <CenteredCard>
        <Sparkles size={28} className="animate-pulse text-[#a98d81]" />
        <p className="mt-4 text-sm text-[#a48a7f]">Verificando sua sessão...</p>
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
          Você precisa estar logado na sua conta Minea para ver seu cartão fidelidade.
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

  if (state === 'ready' && status) {
    return (
      <CenteredCard>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#66806d]">
          <PartyPopper size={22} />
        </div>

        <h1 className="mt-5 font-display text-[26px] text-[#6b5850]">
          {pointEarned ? 'Ponto conquistado!' : 'Seu cartão fidelidade'}
        </h1>

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

        {status.rewardsAvailable > 0 && (
          <div className="mt-5 w-full rounded-xl bg-[#f6ede8] px-4 py-4">
            {rewardJustRedeemed && (
              <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#66806d]">
                <CheckCircle2 size={14} />
                Recompensa resgatada!
              </p>
            )}

            <p className="text-xs font-bold text-[#8a6f63]">
              🎉 Você tem {status.rewardsAvailable}{' '}
              {status.rewardsAvailable === 1 ? 'recompensa disponível' : 'recompensas disponíveis'}!
            </p>

            <button
              type="button"
              onClick={handleRedeemReward}
              disabled={redeemingReward}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#8a6f63] px-4 text-xs font-bold text-white transition hover:bg-[#7c6156] disabled:opacity-60"
            >
              <Gift size={14} />
              {redeemingReward ? 'Resgatando...' : 'Resgatar recompensa'}
            </button>

            {actionError && <p className="mt-2 text-[11px] font-semibold text-[#a45f59]">{actionError}</p>}
          </div>
        )}

        {status.rewardsAvailable === 0 && status.rewardsRedeemed > 0 && (
          <div className="mt-5 w-full rounded-xl border border-[#d6e6d8] bg-[#edf4ee] px-4 py-4">
            <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#66806d]">
              <CheckCircle2 size={16} />
              Recompensa resgatada
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#6b8a72]">
              {status.rewardsRedeemed === 1
                ? 'Você já resgatou 1 recompensa.'
                : `Você já resgatou ${status.rewardsRedeemed} recompensas.`}{' '}
              Mostre esta tela para a clínica.
            </p>
          </div>
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
