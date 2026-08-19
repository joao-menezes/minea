'use client';

import { FormEvent, useState } from 'react';

import { ArrowLeft, Eye, EyeOff, LockKeyhole, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'admin@mineabeauty.com';
const ADMIN_PASSWORD = '123456';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('E-mail ou senha incorretos.');
      return;
    }

    localStorage.setItem('aura_admin_authenticated', 'true');

    router.push('/admin');
  }

  return (
    <main className="min-h-screen bg-[#f7f4f2]">
      <div className="flex min-h-screen">
        <section className="relative hidden flex-1 overflow-hidden bg-[#493a35] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,175,165,.2),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#d9c6bf]">
                Minea Beauty
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/40">
                Estética & Bem-estar
              </p>
            </div>

            <div className="max-w-md">
              <Sparkles size={28} strokeWidth={1.2} className="mb-6 text-[#d9c6bf]" />

              <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.04em] text-white">
                Cuide da sua clínica
                <br />
                com mais leveza.
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">
                Gerencie sua agenda, clientes, serviços e resultados em um único lugar.
              </p>
            </div>

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Painel administrativo
            </p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[520px]">
          <div className="w-full max-w-[370px]">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#927268] transition hover:text-[#493a35]"
            >
              <ArrowLeft size={14} />
              Área do cliente
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eee5df] text-[#80655b]">
                <LockKeyhole size={18} strokeWidth={1.6} />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#aa9187]">
                Administração
              </p>

              <h2 className="mt-2 font-display text-[34px] leading-none tracking-[-0.03em] text-[#493a35]">
                Bem-vindo de volta
              </h2>

              <p className="mt-3 text-xs leading-5 text-[#9b8279]">
                Entre para acessar o painel da clínica.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#806f68]"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@aurabeauty.com"
                  className="h-12 w-full rounded-xl border border-[#e4dad5] bg-white px-4 text-xs text-[#493a35] outline-none transition placeholder:text-[#b9a9a2] focus:border-[#a88b80] focus:ring-4 focus:ring-[#a88b80]/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#806f68]"
                >
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-[#e4dad5] bg-white px-4 pr-12 text-xs text-[#493a35] outline-none transition placeholder:text-[#b9a9a2] focus:border-[#a88b80] focus:ring-4 focus:ring-[#a88b80]/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#a38b82] hover:bg-[#f5efec]"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-[#ead5d0] bg-[#fbf1ef] px-4 py-3 text-[10px] font-semibold text-[#9a5e55]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#493a35] text-xs font-bold text-white shadow-[0_14px_30px_-18px_rgba(54,39,34,.8)] transition hover:-translate-y-0.5 hover:bg-[#3d302c]"
              >
                Entrar no painel
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-dashed border-[#d9ccc6] bg-[#faf7f5] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#a38b82]">
                Acesso de teste
              </p>

              <p className="mt-2 text-[10px] text-[#806f68]">
                <strong>E-mail:</strong> {ADMIN_EMAIL}
              </p>

              <p className="mt-1 text-[10px] text-[#806f68]">
                <strong>Senha:</strong> {ADMIN_PASSWORD}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
