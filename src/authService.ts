import { supabase } from '@/lib/supabase/client';
import type { LoginUser, SignupUser, User } from '@/types';

function normalizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

function validateCPF(cpf: string): string {
  const normalizedCPF = normalizeCPF(cpf);

  if (normalizedCPF.length !== 11) {
    throw new Error('CPF inválido.');
  }

  return normalizedCPF;
}

function cpfToAuthEmail(cpf: string): string {
  return `${cpf}@bella-care.local`;
}

export async function signUp(user: SignupUser, password: string): Promise<User> {
  const cpf = validateCPF(user.cpf);

  const normalizedPassword = password.trim();

  if (normalizedPassword.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  if (!user.nome.trim()) {
    throw new Error('Informe seu nome.');
  }

  const email = cpfToAuthEmail(cpf);

  const { data, error } = await supabase.auth.signUp({
    email,
    password: normalizedPassword,

    options: {
      data: {
        nome: user.nome.trim(),
        cpf,
        aniversario: user.aniversario ?? null,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('user already registered')) {
      throw new Error('Este CPF já possui uma conta. Faça login.');
    }

    throw new Error(`Erro ao criar conta: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Não foi possível criar o usuário.');
  }

  return {
    id: data.user.id,
    nome: user.nome.trim(),
    cpf,
    aniversario: user.aniversario ?? null,
  };
}

/**
 * Login utilizando CPF + senha
 */
export async function signIn(cpf: string, password: string): Promise<LoginUser> {
  const normalizedCPF = validateCPF(cpf);

  if (!password) {
    throw new Error('Informe sua senha.');
  }

  const email = cpfToAuthEmail(normalizedCPF);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Erro ao entrar: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Usuário não encontrado.');
  }

  return {
    cpf: data.user.user_metadata?.cpf ?? normalizedCPF,
    nome: data.user.user_metadata?.nome ?? '',
  };
}

/**
 * Logout
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Erro ao sair: ${error.message}`);
  }
}

/**
 * Usuário atualmente autenticado
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Erro ao recuperar usuário: ${error.message}`);
  }

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    nome: user.user_metadata?.nome ?? '',
    cpf: user.user_metadata?.cpf ?? '',
    aniversario: user.user_metadata?.aniversario ?? null,
  };
}
