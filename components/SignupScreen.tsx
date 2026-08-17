'use client'

import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Cake, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'

import { Bow, maskCPF, maskDate } from './decor'
import type { SignupUser } from '@/types'

type SignupScreenProps = {
  onCreated: (user: SignupUser) => void
  goBack: () => void
}

export default function SignupScreen({ onCreated, goBack }: SignupScreenProps) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [querAniversario, setQuerAniversario] = useState(false)
  const [aniversario, setAniversario] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!nome.trim()) {
      return setErro('Conta pra gente como podemos te chamar.')
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      return setErro('Digite um CPF válido, com os 11 números.')
    }

    if (senha.length < 4) {
      return setErro('A senha precisa ter pelo menos 4 caracteres.')
    }

    if (querAniversario && aniversario.replace(/\D/g, '').length !== 8) {
      return setErro('Preencha a data de aniversário completa ou desative a opção.')
    }

    setErro('')

    onCreated({
      nome,
      cpf,
      aniversario: querAniversario ? aniversario : null,
    })
  }

  return (
    <main className="min-h-screen bg-[#f8f6f4] text-[#403632] relative overflow-hidden">
      {/* Background */}
      <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-[#eadbd5]/60 blur-3xl" />
      <div className="absolute -bottom-48 -left-32 w-96 h-96 rounded-full bg-[#e4d9dc]/50 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Visual / brand */}
        <section className="hidden lg:flex lg:w-[43%] xl:w-1/2 p-10 items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-5 rounded-[42px] bg-[#eee2dd]" />

            <div className="relative overflow-hidden rounded-[36px] aspect-[4/5] bg-[#dfcec7] shadow-[0_30px_80px_-30px_rgba(74,54,47,.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eadbd5] via-[#dfcdc5] to-[#cdb6ad]" />

              <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/20" />
              <div className="absolute bottom-10 -left-16 w-48 h-48 rounded-full bg-[#bda198]/20 blur-2xl" />

              {/* Central brand */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full bg-white/35 backdrop-blur-md flex flex-col items-center justify-center shadow-xl">
                    <Bow size={40} />

                    <p className="font-serif italic text-3xl text-[#5d4942] mt-2">Minea</p>

                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#80665d] mt-1">
                      beauty
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom message */}
              <div className="absolute bottom-7 left-7 right-7 rounded-[26px] bg-white/60 backdrop-blur-lg border border-white/50 p-5">
                <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#8b6d63]">
                  um novo ritual começa aqui
                </p>

                <p className="font-serif text-[26px] leading-tight text-[#4c3b35] mt-2">
                  Crie seu espaço de cuidado.
                </p>

                <p className="text-xs text-[#806c65] mt-2 leading-relaxed max-w-[280px]">
                  Tenha seus procedimentos, horários e momentos especiais sempre por perto.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-[24px] bg-white shadow-[0_15px_35px_-15px_rgba(68,50,43,.35)] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#eee3df] flex items-center justify-center">
                <Cake size={18} className="text-[#94766c]" />
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="flex-1 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            {/* Back */}
            <button
              onClick={goBack}
              className="
                group
                flex items-center gap-2
                text-xs font-semibold
                text-[#927a71]
                hover:text-[#665149]
                transition-colors
                mb-8
              "
            >
              <span className="w-8 h-8 rounded-full border border-[#e5dcd7] bg-white flex items-center justify-center group-hover:bg-[#fdfbf9] transition-colors">
                <ArrowLeft size={14} />
              </span>
              Voltar
            </button>

            {/* Mobile brand */}
            <div className="lg:hidden mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#eadbd5] flex items-center justify-center">
                <Bow size={30} />
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#a18a81] mt-3">Minea</p>
            </div>

            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.27em] font-semibold text-[#a28b82]">
                Primeiro passo
              </p>

              <h1 className="font-serif text-[40px] sm:text-[46px] leading-[1.05] text-[#403530] mt-3">
                Vamos criar
                <br />
                seu perfil.
              </h1>

              <p className="text-sm text-[#8f7b74] mt-4 leading-relaxed max-w-sm">
                Cadastre seus dados para acompanhar seus agendamentos e descobrir uma rotina de
                cuidados feita para você.
              </p>
            </div>

            {/* Card */}
            <form
              onSubmit={handleSubmit}
              className="
                bg-white
                rounded-[30px]
                border border-[#ebe3df]
                shadow-[0_25px_65px_-35px_rgba(68,50,43,.35)]
                p-6 sm:p-8
              "
            >
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#79665e] mb-2">
                  Como podemos te chamar?
                </label>

                <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-[#fcfaf9] border border-[#e9e1dd] focus-within:bg-white focus-within:border-[#b7978b] focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#f0e7e3] flex items-center justify-center shrink-0">
                    <User size={16} strokeWidth={1.8} className="text-[#96786e]" />
                  </div>

                  <input
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      setErro('')
                    }}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    className="w-full bg-transparent outline-none text-sm text-[#443834] placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              {/* CPF */}
              <div className="mt-5">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#79665e] mb-2">
                  CPF
                </label>

                <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-[#fcfaf9] border border-[#e9e1dd] focus-within:bg-white focus-within:border-[#b7978b] focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#f0e7e3] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-semibold text-[#96786e]">ID</span>
                  </div>

                  <input
                    value={cpf}
                    onChange={(e) => {
                      setCpf(maskCPF(e.target.value))
                      setErro('')
                    }}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="w-full bg-transparent outline-none text-sm text-[#443834] placeholder:text-[#c0b1aa]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#79665e] mb-2">
                  Crie uma senha
                </label>

                <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-[#fcfaf9] border border-[#e9e1dd] focus-within:bg-white focus-within:border-[#b7978b] focus-within:shadow-[0_0_0_4px_rgba(183,151,139,.08)] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#f0e7e3] flex items-center justify-center shrink-0">
                    <Lock size={16} strokeWidth={1.8} className="text-[#96786e]" />
                  </div>

                  <input
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value)
                      setErro('')
                    }}
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Mínimo de 4 caracteres"
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-sm text-[#443834] placeholder:text-[#c0b1aa]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowSenha((s) => !s)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#a28a82] hover:bg-[#f0e7e3] hover:text-[#70574f] transition-colors"
                  >
                    {showSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Birthday */}
              <div className="mt-6 rounded-[22px] bg-[#f7f3f1] border border-[#ebe2de] p-4">
                <button
                  type="button"
                  onClick={() => setQuerAniversario((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Cake size={17} strokeWidth={1.7} className="text-[#98776d]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#675149]">Data de aniversário</p>

                      <p className="text-[10px] text-[#a18c84] mt-0.5">Opcional</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <span
                    className={`
                      w-11 h-6
                      rounded-full
                      flex items-center
                      p-0.5
                      transition-colors
                      shrink-0
                      ${querAniversario ? 'bg-[#806057] justify-end' : 'bg-[#d9cec9] justify-start'}
                    `}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                  </span>
                </button>

                <p className="text-[10px] text-[#a18d85] leading-relaxed mt-3 pl-12">
                  Podemos usar essa data para preparar uma surpresa especial no seu aniversário.
                </p>

                {querAniversario && (
                  <div className="mt-4 pl-12">
                    <input
                      value={aniversario}
                      onChange={(e) => {
                        setAniversario(maskDate(e.target.value))
                        setErro('')
                      }}
                      placeholder="DD/MM/AAAA"
                      inputMode="numeric"
                      className="
                        w-full
                        h-12
                        bg-white
                        border border-[#e5dad5]
                        rounded-xl
                        px-4
                        outline-none
                        text-sm
                        text-[#443834]
                        placeholder:text-[#c0b1aa]
                        focus:border-[#b7978b]
                        transition-colors
                      "
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {erro && (
                <div className="mt-4 rounded-2xl bg-[#fbefed] border border-[#f0d9d4] px-4 py-3 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c98579] text-white flex items-center justify-center text-[10px] shrink-0">
                    !
                  </div>

                  <p className="text-xs text-[#965d54] leading-relaxed">{erro}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="
                  group
                  w-full
                  h-14
                  mt-6
                  rounded-2xl
                  bg-[#55443e]
                  hover:bg-[#493933]
                  text-white
                  font-semibold
                  text-sm
                  flex items-center justify-center gap-3
                  shadow-[0_14px_30px_-12px_rgba(65,48,42,.7)]
                  active:scale-[.985]
                  transition-all
                "
              >
                <span>Criar minha conta</span>

                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight size={15} />
                </span>
              </button>
            </form>

            {/* Privacy */}
            <div className="flex justify-center items-center gap-2 mt-6 text-[#a4948d]">
              <ShieldCheck size={14} />

              <p className="text-[10px]">Seus dados ficam seguros durante esta demonstração</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
