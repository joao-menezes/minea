'use client';

import { type FormEvent, useState } from 'react';

import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';

import { ErrorMessage } from '@/components/ErrorMessage';
import { maskCPF } from '@/utils/utils';

type LoginScreenProps = {
  onLogin: (cpf: string, password: string) => void | Promise<void>;
  error?: string;
  goSignup: () => void;
};

export default function LoginScreen({ onLogin, error, goSignup }: LoginScreenProps) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalizedCPF = cpf.replace(/\D/g, '');

    if (normalizedCPF.length !== 11) {
      setErro('Digite um CPF válido, com os 11 números.');
      return;
    }

    if (password.length < 1) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setErro('');
      setLoading(true);

      await onLogin(cpf, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível entrar.';

      setErro(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf8f6] text-[#403735]">
      <style>{`
        @keyframes minea-blob-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-18px, 22px) scale(1.06); }
        }
        @keyframes minea-blob-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(16px, -20px) scale(1.05); }
        }
        @keyframes minea-fade-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes minea-fade-slide-up-sm {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes minea-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes minea-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes minea-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes minea-pop-in {
          0% { opacity: 0; transform: scale(0.6) rotate(-12deg); }
          70% { opacity: 1; transform: scale(1.08) rotate(4deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes minea-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes minea-pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .minea-blob-a { animation: minea-blob-a 14s ease-in-out infinite; }
        .minea-blob-b { animation: minea-blob-b 16s ease-in-out infinite; }
        .minea-card { animation: minea-fade-slide-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .minea-inner-1 { animation: minea-fade-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both 0.15s; }
        .minea-inner-2 { animation: minea-fade-in 0.9s ease-out both 0.35s; }
        .minea-circle { animation: minea-breathe 6s ease-in-out infinite 1s; }
        .minea-ring { animation: minea-ring-spin 40s linear infinite; }
        .minea-badge { animation: minea-pop-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both 0.9s; }

        .minea-form-header { animation: minea-fade-slide-up-sm 0.7s cubic-bezier(0.22, 1, 0.36, 1) both 0.1s; }
        .minea-form-card { animation: minea-fade-slide-up-sm 0.7s cubic-bezier(0.22, 1, 0.36, 1) both 0.25s; }
        .minea-form-footer { animation: minea-fade-in 0.8s ease-out both 0.5s; }
        .minea-error { animation: minea-shake 0.4s ease-in-out; }
        .minea-loading-pulse { animation: minea-pulse-soft 1.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .minea-blob-a, .minea-blob-b, .minea-card, .minea-inner-1, .minea-inner-2,
          .minea-circle, .minea-ring, .minea-badge,
          .minea-form-header, .minea-form-card, .minea-form-footer, .minea-error,
          .minea-loading-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <div className="minea-blob-a absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#ead8d2]/50 blur-3xl" />

      <div className="minea-blob-b absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#e8d7df]/40 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <section className="relative hidden items-center justify-center p-12 lg:flex lg:w-[46%] xl:w-1/2">
          <div className="absolute inset-8 rounded-[40px] bg-[#efe3de]" />

          <div className="minea-card relative w-full max-w-lg">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-[#e6d4cd] shadow-[0_30px_80px_-30px_rgba(91,63,55,0.35)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eadbd5] via-[#e8d8d2] to-[#d9c4bc]" />

              <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/30 blur-xl" />

              <div className="absolute bottom-16 right-8 h-40 w-40 rounded-full bg-[#f7eee9]/40 blur-2xl" />

              <div className="minea-inner-1 absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-[26rem] w-[26rem] items-center justify-center">
                  <div className="absolute inset-6 rounded-full bg-[#d9b8aa]/20 blur-3xl" />
                  <div className="minea-ring absolute inset-0 rounded-full border border-white/60 bg-white/10 shadow-[0_30px_80px_-30px_rgba(91,63,55,0.35)] backdrop-blur-[2px]" />
                  <div className="absolute inset-5 rounded-full border border-[#b99588]/20" />
                  <div className="minea-circle relative flex h-72 w-72 items-center justify-center rounded-full border border-white/70 bg-[#f7eee9]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_25px_60px_-25px_rgba(91,63,55,0.45)] backdrop-blur-xl">
                    <div className="absolute left-10 top-8 h-20 w-32 rounded-full bg-white/40 blur-2xl" />
                    <img
                      src="/minea-logo.svg"
                      alt="Minea"
                      className="relative z-10 h-auto w-[30rem] max-w-none translate-x-8 scale-[1] object-contain drop-shadow-[0_12px_18px_rgba(91,63,55,0.18)]"
                    />
                  </div>
                </div>
              </div>

              <div className="minea-inner-2 absolute bottom-8 left-8 right-8 rounded-3xl border border-white/60 bg-white/65 p-5 backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#765a51]">
                  seu momento
                </p>

                <p className="mt-2 font-serif text-2xl text-[#4d3c37]">
                  Cuidar de você também faz parte da rotina.
                </p>
              </div>
            </div>

            <div className="minea-badge absolute -bottom-5 -right-5 flex h-20 w-20 rotate-3 items-center justify-center rounded-[1.75rem] border border-[#eadbd4] bg-[#fffaf8] shadow-[0_14px_35px_-12px_rgba(91,63,55,0.35)]">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <img src="/icon.ico" alt="Minea" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10 flex justify-center lg:hidden">
              <div className="text-center">
                <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-[#a78378]" />
              </div>
            </div>

            <div className="minea-form-header mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a78378]">
                Bem-vinda de volta
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight text-[#3e3431] sm:text-5xl">
                Seu momento
                <br />
                começa aqui.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8f7b75]">
                Entre na sua conta para acompanhar seus agendamentos e continuar cuidando de você.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="minea-form-card rounded-[30px] border border-[#eee4df] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(76,55,48,0.25)] sm:p-8"
            >
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#79665f]">
                  CPF
                </label>

                <div className="group flex h-14 items-center gap-3 rounded-2xl border border-[#e9dfda] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b99386] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(185,147,134,0.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f1e7e2]">
                    <User size={16} className="text-[#9b766b]" />
                  </div>

                  <input
                    value={cpf}
                    onChange={(e) => {
                      setCpf(maskCPF(e.target.value));
                      setErro('');
                    }}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    autoComplete="username"
                    disabled={loading}
                    className="w-full bg-transparent text-sm text-[#453a36] outline-none placeholder:text-[#c5b5ae] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#79665f]">
                    Senha
                  </label>

                  <button
                    type="button"
                    disabled={loading}
                    className="text-[11px] font-medium text-[#a17d72] transition-colors hover:text-[#795b52] disabled:opacity-50"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="group flex h-14 items-center gap-3 rounded-2xl border border-[#e9dfda] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b99386] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(185,147,134,0.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f1e7e2]">
                    <Lock size={16} className="text-[#9b766b]" />
                  </div>

                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErro('');
                    }}
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full bg-transparent text-sm text-[#453a36] outline-none placeholder:text-[#c5b5ae] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowSenha((current) => !current)}
                    disabled={loading}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#a68b83] transition-colors hover:bg-[#f1e7e2] hover:text-[#795b52] disabled:opacity-50"
                    aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {erro && <ErrorMessage error={error} />}

              <button
                type="submit"
                disabled={loading}
                className="group mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#806057] text-sm font-medium text-white shadow-[0_12px_25px_-10px_rgba(92,68,60,0.55)] transition-all hover:bg-[#71534b] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className={loading ? 'minea-loading-pulse' : ''}>
                  {loading ? 'Entrando...' : 'Entrar na minha conta'}
                </span>

                {!loading && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={15} />
                  </span>
                )}
              </button>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#eee5e1]" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-[#b5a49e]">ou</span>

                <div className="h-px flex-1 bg-[#eee5e1]" />
              </div>

              <button
                type="button"
                onClick={goSignup}
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#dfd1cb] text-sm font-medium text-[#70564e] transition-colors hover:bg-[#fbf7f5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Criar minha conta
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="minea-form-footer mt-6 flex items-center justify-center gap-2 text-[#aa9790]">
              <ShieldCheck size={14} />

              <p className="text-[10px] tracking-wide">
                Seus dados são protegidos durante esta demonstração
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
