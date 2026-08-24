'use client';

import { type FormEvent, useState } from 'react';

import { ArrowLeft, ArrowRight, Cake, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';

import { maskCPF, maskDate } from '@/utils/utils';

import { Bow } from './decor';

type SignupData = {
  name: string;
  cpf: string;
  birthDate: string;
  password: string;
};

type SignupScreenProps = {
  onCreated: (user: SignupData, password: string) => void | Promise<void>;
  goBack: () => void;
};

export default function SignupScreen({ onCreated, goBack }: SignupScreenProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [querAniversario, setQuerAniversario] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nome.trim()) {
      return setError('Conta pra gente como podemos te chamar.');
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      return setError('Digite um CPF válido, com os 11 números.');
    }

    if (password.length < 6) {
      return setError('A senha precisa ter pelo menos 6 caracteres.');
    }

    if (querAniversario && birthDate.replace(/\D/g, '').length !== 8) {
      return setError('Preencha a data de aniversário completa ou desative a opção.');
    }

    setError('');

    onCreated(
      {
        name: nome,
        cpf,
        birthDate,
        password,
      },
      password,
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f6f4] text-[#403632]">
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
        @keyframes minea-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
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

        .minea-blob-a { animation: minea-blob-a 14s ease-in-out infinite; }
        .minea-blob-b { animation: minea-blob-b 16s ease-in-out infinite; }
        .minea-card { animation: minea-fade-slide-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .minea-inner-1 { animation: minea-fade-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both 0.15s; }
        .minea-inner-2 { animation: minea-fade-in 0.9s ease-out both 0.35s; }
        .minea-circle { animation: minea-breathe 6s ease-in-out infinite 1s; }
        .minea-ring { animation: minea-ring-spin 40s linear infinite; }
        .minea-sparkle-1 { animation: minea-twinkle 3.4s ease-in-out infinite 0.6s; }
        .minea-sparkle-2 { animation: minea-twinkle 4.2s ease-in-out infinite 1.4s; }
        .minea-badge { animation: minea-pop-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both 0.9s; }

        .minea-form-header { animation: minea-fade-slide-up-sm 0.7s cubic-bezier(0.22, 1, 0.36, 1) both 0.1s; }
        .minea-form-card { animation: minea-fade-slide-up-sm 0.7s cubic-bezier(0.22, 1, 0.36, 1) both 0.25s; }
        .minea-form-footer { animation: minea-fade-in 0.8s ease-out both 0.5s; }
        .minea-error { animation: minea-shake 0.4s ease-in-out; }

        @media (prefers-reduced-motion: reduce) {
          .minea-blob-a, .minea-blob-b, .minea-card, .minea-inner-1, .minea-inner-2,
          .minea-circle, .minea-ring, .minea-sparkle-1, .minea-sparkle-2, .minea-badge,
          .minea-form-header, .minea-form-card, .minea-form-footer, .minea-error {
            animation: none !important;
          }
        }
      `}</style>

      <div className="minea-blob-a absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#eadbd5]/60 blur-3xl" />
      <div className="minea-blob-b absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-[#e4d9dc]/50 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <section className="hidden items-center justify-center p-10 lg:flex lg:w-[43%] xl:w-1/2">
          <div className="minea-card relative w-full max-w-lg">
            <div className="absolute inset-5 rounded-[42px] bg-[#eee2dd]" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-[#dfcec7] shadow-[0_30px_80px_-30px_rgba(74,54,47,.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eadbd5] via-[#dfcdc5] to-[#cdb6ad]" />

              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/20" />
              <div className="absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-[#bda198]/20 blur-2xl" />

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

              <div className="minea-inner-2 absolute bottom-7 left-7 right-7 rounded-[26px] border border-white/50 bg-white/60 p-5 backdrop-blur-lg">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8b6d63]">
                  um novo ritual começa aqui
                </p>

                <p className="mt-2 font-serif text-[26px] leading-tight text-[#4c3b35]">
                  Crie seu espaço de cuidado.
                </p>

                <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-[#806c65]">
                  Tenha seus procedimentos, horários e momentos especiais sempre por perto.
                </p>
              </div>
            </div>

            <div className="minea-badge absolute -bottom-5 -right-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_15px_35px_-15px_rgba(68,50,43,.35)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3df]">
                <Cake size={18} className="text-[#94766c]" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <button
              onClick={goBack}
              className="group mb-8 flex items-center gap-2 text-xs font-semibold text-[#927a71] transition-colors hover:text-[#665149]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5dcd7] bg-white transition-colors group-hover:bg-[#fdfbf9]">
                <ArrowLeft size={14} />
              </span>
              Voltar
            </button>

            <div className="mb-8 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eadbd5]">
                <Bow size={30} />
              </div>

              <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-[#a18a81]">Minea</p>
            </div>

            <div className="minea-form-header mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-[#a28b82]">
                Primeiro passo
              </p>

              <h1 className="mt-3 font-serif text-[40px] leading-[1.05] text-[#403530] sm:text-[46px]">
                Vamos criar
                <br />
                seu perfil.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8f7b74]">
                Cadastre seus dados para acompanhar seus agendamentos e descobrir uma rotina de
                cuidados feita para você.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="minea-form-card rounded-[30px] border border-[#ebe3df] bg-white p-6 shadow-[0_25px_65px_-35px_rgba(68,50,43,.35)] sm:p-8"
            >
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#79665e]">
                  Como podemos te chamar?
                </label>

                <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#e9e1dd] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b7978b] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0e7e3]">
                    <User size={16} strokeWidth={1.8} className="text-[#96786e]" />
                  </div>

                  <input
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setError('');
                    }}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#79665e]">
                  CPF
                </label>

                <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#e9e1dd] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b7978b] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0e7e3]">
                    <span className="text-[11px] font-semibold text-[#96786e]">ID</span>
                  </div>

                  <input
                    value={cpf}
                    onChange={(e) => {
                      setCpf(maskCPF(e.target.value));
                      setError('');
                    }}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#79665e]">
                  Crie uma senha
                </label>

                <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#e9e1dd] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b7978b] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0e7e3]">
                    <Lock size={16} strokeWidth={1.8} className="text-[#96786e]" />
                  </div>

                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo de 6 caracteres"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#a28a82] transition-colors hover:bg-[#f0e7e3] hover:text-[#70574f]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[22px] border border-[#ebe2de] bg-[#f7f3f1] p-4">
                <button
                  type="button"
                  onClick={() => setQuerAniversario((v) => !v)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                      <Cake size={17} strokeWidth={1.7} className="text-[#98776d]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#675149]">Data de aniversário</p>

                      <p className="mt-0.5 text-[10px] text-[#a18c84]">Opcional</p>
                    </div>
                  </div>

                  <span
                    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${querAniversario ? 'justify-end bg-[#806057]' : 'justify-start bg-[#d9cec9]'} `}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300" />
                  </span>
                </button>

                <p className="mt-3 pl-12 text-[10px] leading-relaxed text-[#a18d85]">
                  Podemos usar essa data para preparar uma surpresa especial no seu aniversário.
                </p>

                {querAniversario && (
                  <div
                    className="mt-4 pl-12"
                    style={{
                      animation: 'minea-fade-slide-up-sm 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
                    }}
                  >
                    <input
                      value={birthDate}
                      onChange={(e) => {
                        setBirthDate(maskDate(e.target.value));
                        setError('');
                      }}
                      placeholder="DD/MM/AAAA"
                      inputMode="numeric"
                      className="h-12 w-full rounded-xl border border-[#e5dad5] bg-white px-4 text-sm text-[#443834] outline-none transition-colors placeholder:text-[#c0b1aa] focus:border-[#b7978b]"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="minea-error mt-4 flex items-start gap-3 rounded-2xl border border-[#f0d9d4] bg-[#fbefed] px-4 py-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c98579] text-[10px] text-white">
                    !
                  </div>

                  <p className="text-xs leading-relaxed text-[#965d54]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="group mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#55443e] text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(65,48,42,.7)] transition-all hover:bg-[#493933] active:scale-[.985]"
              >
                <span>Criar minha conta</span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={15} />
                </span>
              </button>
            </form>

            <div className="minea-form-footer mt-6 flex items-center justify-center gap-2 text-[#a4948d]">
              <ShieldCheck size={14} />

              <p className="text-[10px]">Seus dados ficam seguros durante esta demonstração</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
