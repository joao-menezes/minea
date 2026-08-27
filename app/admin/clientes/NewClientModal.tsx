'use client';

import { FormEvent, useState } from 'react';

import { CalendarDays, Check, Lock, ShieldCheck, User, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

import { BaseModal } from '@/components/BaseModal';
import { createClient } from '@/lib/api/clients';
import type { Client } from '@/types';
import { maskCPF, maskDate } from '@/utils/utils';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
};

export function NewClientModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setName('');
    setCpf('');
    setBirthDate('');
    setPassword('');
    setIsAdmin(false);
    setError('');
  }

  function close() {
    if (saving) return;
    reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) return setError('Informe o nome do cliente.');
    if (cpf.replace(/\D/g, '').length !== 11) return setError('Informe um CPF válido.');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');

    try {
      setSaving(true);
      setError('');

      const client = await createClient({
        name: name.trim(),
        cpf,
        birthDate: birthDate || undefined,
        password,
        isAdmin,
      });

      toast.success('Cliente criado com sucesso!');
      onCreated(client);
      reset();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Não foi possível criar o cliente.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <BaseModal
      open={open}
      onClose={close}
      variant="centered"
      size="md"
      showCloseButton={false}
      closeOnBackdrop={!saving}
      className="rounded-[24px] bg-white"
    >
      <div className="flex items-start justify-between border-b border-[#f0e6e0] px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-[#8a6f63]" />
            <h2 className="text-[15px] font-bold text-[#3e332f]">Novo cliente</h2>
          </div>
          <p className="mt-1 text-[10px] text-[#a78a7f]">Cadastre uma nova conta na clínica.</p>
        </div>
        <button type="button" onClick={close} disabled={saving} aria-label="Fechar">
          <X size={17} className="text-[#a78a7f]" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 px-6 py-5">
          <Field label="Nome completo" icon={User}>
            <input value={name} onChange={(event) => setName(event.target.value)} disabled={saving} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF" icon={ShieldCheck}>
              <input value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} inputMode="numeric" disabled={saving} className={inputClass} />
            </Field>
            <Field label="Nascimento" icon={CalendarDays}>
              <input value={birthDate} onChange={(event) => setBirthDate(maskDate(event.target.value))} inputMode="numeric" disabled={saving} className={inputClass} />
            </Field>
          </div>
          <Field label="Senha inicial" icon={Lock}>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={saving} className={inputClass} />
          </Field>
          <button
            type="button"
            role="switch"
            aria-checked={isAdmin}
            onClick={() => setIsAdmin((current) => !current)}
            disabled={saving}
            className="flex w-full items-center justify-between rounded-[14px] bg-[#faf6f3] px-3.5 py-3 text-left disabled:opacity-60"
          >
            <span>
              <span className="block text-[10px] font-bold text-[#6b5850]">Acesso administrativo</span>
              <span className="mt-0.5 block text-[9px] text-[#a48a7f]">Permite acessar o painel da clínica.</span>
            </span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isAdmin ? 'bg-[#8a6f63] text-white' : 'bg-white text-transparent'}`}>
              <Check size={14} />
            </span>
          </button>
          {error && <p className="rounded-[12px] bg-[#fff3f1] px-3 py-2 text-[10px] font-semibold text-[#a45f59]">{error}</p>}
        </div>
        <div className="flex gap-2 border-t border-[#f0e6e0] px-6 py-4">
          <button type="button" onClick={close} disabled={saving} className="h-11 flex-1 rounded-[12px] border border-[#eaded8] text-[10px] font-bold text-[#a98c82]">Cancelar</button>
          <button type="submit" disabled={saving} className="h-11 flex-[1.5] rounded-[12px] bg-[#3f332f] text-[10px] font-bold text-white disabled:opacity-60">{saving ? 'Salvando...' : 'Criar cliente'}</button>
        </div>
      </form>
    </BaseModal>
  );
}

const inputClass = 'h-11 w-full rounded-[12px] border border-[#e5dad5] bg-white px-3.5 text-[11px] text-[#54423c] outline-none focus:border-[#b99a8e] disabled:bg-[#f5f1ef]';

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#907970]"><Icon size={12} />{label}</span>
      {children}
    </label>
  );
}
