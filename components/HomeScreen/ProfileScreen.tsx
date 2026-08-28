'use client';

import { FormEvent, useState } from 'react';

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  LockKeyhole,
  Save,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import { CustomCalendar } from '@/components/CustomCalendar';
import type { User } from '@/types';
import { maskCPF } from '@/utils/utils';

type ProfileScreenProps = {
  user: User;
  onBack: () => void;
  onSave: (profile: Pick<User, 'name' | 'birthDate'>) => Promise<void>;
  onChangePassword: (passwords: { currentPassword: string; newPassword: string }) => Promise<void>;
};

export default function ProfileScreen({
  user,
  onBack,
  onSave,
  onChangePassword,
}: ProfileScreenProps) {
  const [name, setName] = useState(user.name);
  const [birthDate, setBirthDate] = useState(user.birthDate?.slice(0, 10) ?? '');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpfHover, setCpfHover] = useState(false);
  const [cpfCursor, setCpfCursor] = useState({ x: 0, y: 0 });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError('Informe seu nome.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave({ name: name.trim(), birthDate: birthDate || null });
      setSaved(true);
      toast.success('Alterações salvas com sucesso!');
    } catch (reason) {
      console.error('Erro ao atualizar perfil:', reason);
      toast.success('Não foi possível salvar seu perfil.');
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!currentPassword || newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setPasswordError('A confirmação da senha não confere.');
      return;
    }

    try {
      setChangingPassword(true);
      await onChangePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');
      setPasswordMessage('Senha alterada com sucesso.');
    } catch (reason) {
      console.error('Erro ao alterar senha:', reason);
      setPasswordError(
        reason instanceof Error ? reason.message : 'Não foi possível alterar a senha.',
      );
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf6f3] px-5 py-7 text-[#6b5850] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-[#a68b7f] transition hover:text-[#80685e]"
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">Minea</p>
            <h1 className="mt-3 font-display text-[36px] leading-none tracking-[-0.04em] sm:text-[42px]">
              Meu perfil
            </h1>
            <p className="mt-3 text-xs text-[#a48a7f]">Seus dados, do seu jeito.</p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#c9afa5] text-white shadow-[0_14px_30px_-20px_rgba(100,70,60,.5)] sm:flex">
            <UserRound size={22} strokeWidth={1.6} />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[26px] border border-[#eee4df] bg-white/90 p-5 shadow-[0_20px_50px_-35px_rgba(64,46,40,.3)] sm:p-6"
          >
            <div className="border-b border-[#f1e8e2] pb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c2a99d]">
                Dados pessoais
              </p>
              <h2 className="mt-2 font-display text-[25px] leading-none">Informações básicas</h2>
            </div>

            <div className="mt-6 space-y-5">
              <ProfileField
                label="Nome completo"
                value={name}
                onChange={setName}
                icon={UserRound}
              />

              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#b09a91]">
                  Data de aniversário
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarOpen((current) => !current)}
                  className="flex h-11 w-full items-center gap-3 rounded-[13px] border border-[#eee4df] bg-[#fffdfc] px-4 text-left text-[10px] font-medium text-[#80685e] transition hover:border-[#d5beb4]"
                >
                  <CalendarDays size={14} className="text-[#b49b90]" />
                  <span className={birthDate ? '' : 'text-[#b49b90]'}>
                    {birthDate ? formatDate(birthDate) : 'Selecione sua data'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`ml-auto text-[#b49b90] ${calendarOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {calendarOpen && (
                  <div className="mt-3">
                    <CustomCalendar
                      value={birthDate ? new Date(`${birthDate}T12:00:00`) : null}
                      referenceDate={birthDate ? new Date(`${birthDate}T12:00:00`) : new Date()}
                      onChange={(date) => {
                        setBirthDate(toDateValue(date));
                        setCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#b09a91]">
                  CPF
                </label>
                <div
                  className="relative flex h-11 items-center rounded-[13px] border border-[#eee4df] bg-[#f7f2ef] px-4 text-[10px] font-medium text-[#a48a7f]"
                  onMouseEnter={() => setCpfHover(true)}
                  onMouseLeave={() => setCpfHover(false)}
                  onMouseMove={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setCpfCursor({
                      x: event.clientX - bounds.left + 10,
                      y: event.clientY - bounds.top + 10,
                    });
                  }}
                >
                  {cpfHover && (
                    <span
                      className="lock-cursor-indicator pointer-events-none absolute z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#8a6f63] text-white shadow-md transition-all duration-150 ease-out"
                      style={{
                        left: cpfCursor.x,
                        top: cpfCursor.y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <LockKeyhole size={11} strokeWidth={2} />
                    </span>
                  )}
                  {maskCPF(user.cpf)}
                </div>
                <p className="mt-2 text-[9px] text-[#b49b90]">
                  O CPF é protegido e não pode ser alterado.
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-5 rounded-[13px] bg-[#fbefed] px-3 py-2 text-[10px] text-[#9b5d53]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-[13px] bg-[#8a6f63] text-[10px] font-bold text-white transition hover:bg-[#7c6156] disabled:opacity-60"
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Salvando...' : saved ? 'Alterações salvas' : 'Salvar alterações'}
            </button>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="h-fit rounded-[26px] border border-[#eee4df] bg-white/90 p-5 shadow-[0_20px_50px_-35px_rgba(64,46,40,.3)] sm:p-6"
          >
            <div className="border-b border-[#f1e8e2] pb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6ede8] text-[#ab8f83]">
                <LockKeyhole size={15} />
              </div>
              <h2 className="mt-4 font-display text-[25px] leading-none">Segurança</h2>
              <p className="mt-2 text-[10px] leading-relaxed text-[#b49b90]">
                Altere sua senha para manter sua conta protegida.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <PasswordField
                label="Senha atual"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <PasswordField label="Nova senha" value={newPassword} onChange={setNewPassword} />
              <PasswordField
                label="Confirmar nova senha"
                value={passwordConfirmation}
                onChange={setPasswordConfirmation}
              />
            </div>

            {(passwordError || passwordMessage) && (
              <p
                className={`mt-4 rounded-[13px] px-3 py-2 text-[10px] ${
                  passwordError ? 'bg-[#fbefed] text-[#9b5d53]' : 'bg-[#edf5ef] text-[#66816d]'
                }`}
              >
                {passwordError || passwordMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-[13px] border border-[#eaded8] bg-[#fffdfc] text-[10px] font-bold text-[#8a6f63] transition hover:bg-[#faf4f1] disabled:opacity-60"
            >
              <LockKeyhole size={14} />
              {changingPassword ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#b09a91]">
        {label}
      </span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        className="h-11 w-full rounded-[14px] border border-[#eee4df] bg-[#fffdfc] px-4 text-[10px] font-medium text-[#80685e] outline-none transition focus:border-[#d5beb4]"
      />
    </label>
  );
}

function ProfileField({
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon: typeof UserRound;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#b09a91]">
        {label}
      </span>
      <div className="flex h-11 items-center gap-3 rounded-[14px] border border-[#eee4df] bg-[#fffdfc] px-4 focus-within:border-[#d5beb4]">
        <Icon size={14} className="text-[#b49b90]" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[10px] font-medium text-[#80685e] outline-none"
        />
      </div>
    </label>
  );
}

function toDateValue(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T12:00:00`));
}
