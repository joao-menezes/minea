'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'
import { Sparkle, maskCPF } from './decor'
import type { LoginUser } from '@/types'

type LoginScreenProps = {
  onLogin: (user: LoginUser) => void
  goSignup: () => void
}

export default function LoginScreen({ onLogin, goSignup }: LoginScreenProps) {
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [erro, setErro] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (cpf.replace(/\D/g, '').length !== 11) {
      setErro('Digite um CPF válido, com os 11 números.')
      return
    }

    if (senha.length < 4) {
      setErro('A senha precisa ter pelo menos 4 caracteres.')
      return
    }

    setErro('')
    onLogin({ cpf, nome: 'Rebeca' })
  }

  return (
    <main className="min-h-screen bg-[#fbf8f6] text-[#403735] relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#ead8d2]/50 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#e8d7df]/40 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <section className="hidden lg:flex lg:w-[46%] xl:w-1/2 relative items-center justify-center p-12">
          <div className="absolute inset-8 rounded-[40px] bg-[#efe3de]" />

          <div className="relative w-full max-w-lg">
            <div className="relative rounded-[36px] overflow-hidden bg-[#e6d4cd] aspect-[4/5] shadow-[0_30px_80px_-30px_rgba(91,63,55,0.35)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eadbd5] via-[#e8d8d2] to-[#d9c4bc]" />

              <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-white/30 blur-xl" />
              <div className="absolute bottom-16 right-8 w-40 h-40 rounded-full bg-[#f7eee9]/40 blur-2xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 rounded-full border border-white/50 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-[#f7eee9]/70 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-[#9d766a] text-5xl font-serif italic">A</div>
                      <div className="text-[#9d766a] text-[10px] tracking-[0.35em] uppercase mt-2">
                        beauty
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 bg-white/65 backdrop-blur-md rounded-3xl p-5 border border-white/60">
                <p className="text-[#765a51] text-xs uppercase tracking-[0.22em] font-medium">
                  seu momento
                </p>

                <p className="font-serif text-2xl text-[#4d3c37] mt-2">
                  Cuidar de você também faz parte da rotina.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-3xl bg-[#fffaf8] shadow-xl flex items-center justify-center">
              <Sparkle />
            </div>
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex justify-center mb-10">
              <div className="text-center">
                <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-[#a78378]">
                  beauty & care
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#a78378] font-semibold">
                Bem-vinda de volta
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl text-[#3e3431] mt-3 leading-tight">
                Seu momento
                <br />
                começa aqui.
              </h1>

              <p className="text-sm text-[#8f7b75] mt-4 leading-relaxed max-w-sm">
                Entre na sua conta para acompanhar seus agendamentos e continuar cuidando de você.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[30px] border border-[#eee4df] shadow-[0_20px_60px_-30px_rgba(76,55,48,0.25)] p-6 sm:p-8"
            >
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#79665f] mb-2">
                  CPF
                </label>

                <div className="group flex items-center gap-3 rounded-2xl border border-[#e9dfda] bg-[#fcfaf9] px-4 h-14 transition-all focus-within:border-[#b99386] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(185,147,134,0.08)]">
                  <div className="w-8 h-8 rounded-xl bg-[#f1e7e2] flex items-center justify-center shrink-0">
                    <User size={16} className="text-[#9b766b]" />
                  </div>

                  <input
                    value={cpf}
                    onChange={(e) => {
                      setCpf(maskCPF(e.target.value))
                      setErro('')
                    }}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    autoComplete="username"
                    className="w-full bg-transparent outline-none text-sm text-[#453a36] placeholder:text-[#c5b5ae]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#79665f]">
                    Senha
                  </label>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#a17d72] hover:text-[#795b52] transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="group flex items-center gap-3 rounded-2xl border border-[#e9dfda] bg-[#fcfaf9] px-4 h-14 transition-all focus-within:border-[#b99386] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(185,147,134,0.08)]">
                  <div className="w-8 h-8 rounded-xl bg-[#f1e7e2] flex items-center justify-center shrink-0">
                    <Lock size={16} className="text-[#9b766b]" />
                  </div>

                  <input
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value)
                      setErro('')
                    }}
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    className="w-full bg-transparent outline-none text-sm text-[#453a36] placeholder:text-[#c5b5ae]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowSenha((s) => !s)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#a68b83] hover:bg-[#f1e7e2] hover:text-[#795b52] transition-colors"
                    aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {erro && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#fbefed] border border-[#f1d9d4] px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-[#d98f82] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    !
                  </div>

                  <p className="text-xs leading-relaxed text-[#9b5d53]">{erro}</p>
                </div>
              )}

              <button
                type="submit"
                className="group w-full mt-6 h-14 rounded-2xl bg-[#806057] hover:bg-[#71534b] text-white font-medium text-sm shadow-[0_12px_25px_-10px_rgba(92,68,60,0.55)] transition-all active:scale-[0.985] flex items-center justify-center gap-3"
              >
                <span>Entrar na minha conta</span>

                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={15} />
                </span>
              </button>
              <div className="flex items-center gap-4 my-7">
                <div className="h-px bg-[#eee5e1] flex-1" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-[#b5a49e]">ou</span>

                <div className="h-px bg-[#eee5e1] flex-1" />
              </div>

              <button
                type="button"
                onClick={goSignup}
                className="group w-full h-12 rounded-2xl border border-[#dfd1cb] text-[#70564e] hover:bg-[#fbf7f5] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                Criar minha conta
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-[#aa9790]">
              <ShieldCheck size={14} />

              <p className="text-[10px] tracking-wide">
                Seus dados são mantidos apenas durante esta demonstração
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
