'use client';

import { type FormEvent, useState } from 'react';

import { ArrowLeft, ArrowRight, Cake, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';

import type { SignupUser } from '@/types';

import { Bow, maskCPF, maskDate } from './decor';

type SignupScreenProps = {
  onCreated: (user: SignupUser) => void;
  goBack: () => void;
};

export default function SignupScreen({ onCreated, goBack }: SignupScreenProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [querAniversario, setQuerAniversario] = useState(false);
  const [aniversario, setAniversario] = useState('');
  const [erro, setErro] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nome.trim()) {
      return setErro('Conta pra gente como podemos te chamar.');
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      return setErro('Digite um CPF válido, com os 11 números.');
    }

    if (senha.length < 4) {
      return setErro('A senha precisa ter pelo menos 4 caracteres.');
    }

    if (querAniversario && aniversario.replace(/\D/g, '').length !== 8) {
      return setErro('Preencha a data de aniversário completa ou desative a opção.');
    }

    setErro('');

    onCreated({
      nome,
      cpf,
      aniversario: querAniversario ? aniversario : null,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f6f4] text-[#403632]">
      {/* Background */}
      <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#eadbd5]/60 blur-3xl" />
      <div className="absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-[#e4d9dc]/50 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Visual / brand */}
        <section className="hidden items-center justify-center p-10 lg:flex lg:w-[43%] xl:w-1/2">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-5 rounded-[42px] bg-[#eee2dd]" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-[#dfcec7] shadow-[0_30px_80px_-30px_rgba(74,54,47,.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eadbd5] via-[#dfcdc5] to-[#cdb6ad]" />

              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/20" />
              <div className="absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-[#bda198]/20 blur-2xl" />

              {/* Central brand */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-56 w-56 items-center justify-center rounded-full border border-white/40">
                  <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white/35 shadow-xl backdrop-blur-md">
                    <Bow size={40} />

                    <p className="mt-2 font-serif text-3xl italic text-[#5d4942]">Minea</p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-[#80665d]">
                      beauty
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom message */}
              <div className="absolute bottom-7 left-7 right-7 rounded-[26px] border border-white/50 bg-white/60 p-5 backdrop-blur-lg">
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

            <div className="absolute -bottom-5 -right-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_15px_35px_-15px_rgba(68,50,43,.35)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3df]">
                <Cake size={18} className="text-[#94766c]" />
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            {/* Back */}
            <button
              onClick={goBack}
              className="group mb-8 flex items-center gap-2 text-xs font-semibold text-[#927a71] transition-colors hover:text-[#665149]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5dcd7] bg-white transition-colors group-hover:bg-[#fdfbf9]">
                <ArrowLeft size={14} />
              </span>
              Voltar
            </button>

            {/* Mobile brand */}
            <div className="mb-8 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eadbd5]">
                <Bow size={30} />
              </div>

              <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-[#a18a81]">Minea</p>
            </div>

            <div className="mb-7">
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

            {/* Card */}
            <form
              onSubmit={handleSubmit}
              className="rounded-[30px] border border-[#ebe3df] bg-white p-6 shadow-[0_25px_65px_-35px_rgba(68,50,43,.35)] sm:p-8"
            >
              {/* Name */}
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
                      setErro('');
                    }}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              {/* CPF */}
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
                      setErro('');
                    }}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#79665e]">
                  Crie uma senha
                </label>

                <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#e9e1dd] bg-[#fcfaf9] px-4 transition-all focus-within:border-[#b7978b] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0e7e3]">
                    <Lock size={16} strokeWidth={1.8} className="text-[#96786e]" />
                  </div>

                  <input
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setErro('');
                    }}
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Mínimo de 4 caracteres"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-[#443834] outline-none placeholder:text-[#c0b1aa]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowSenha((s) => !s)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#a28a82] transition-colors hover:bg-[#f0e7e3] hover:text-[#70574f]"
                  >
                    {showSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Birthday */}
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

                  {/* Toggle */}
                  <span
                    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${querAniversario ? 'justify-end bg-[#806057]' : 'justify-start bg-[#d9cec9]'} `}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                  </span>
                </button>

                <p className="mt-3 pl-12 text-[10px] leading-relaxed text-[#a18d85]">
                  Podemos usar essa data para preparar uma surpresa especial no seu aniversário.
                </p>

                {querAniversario && (
                  <div className="mt-4 pl-12">
                    <input
                      value={aniversario}
                      onChange={(e) => {
                        setAniversario(maskDate(e.target.value));
                        setErro('');
                      }}
                      placeholder="DD/MM/AAAA"
                      inputMode="numeric"
                      className="h-12 w-full rounded-xl border border-[#e5dad5] bg-white px-4 text-sm text-[#443834] outline-none transition-colors placeholder:text-[#c0b1aa] focus:border-[#b7978b]"
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {erro && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#f0d9d4] bg-[#fbefed] px-4 py-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c98579] text-[10px] text-white">
                    !
                  </div>

                  <p className="text-xs leading-relaxed text-[#965d54]">{erro}</p>
                </div>
              )}

              {/* Submit */}
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

            {/* Privacy */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[#a4948d]">
              <ShieldCheck size={14} />

              <p className="text-[10px]">Seus dados ficam seguros durante esta demonstração</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
