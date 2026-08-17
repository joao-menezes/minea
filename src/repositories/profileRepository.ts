import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';

type ProfileRow = {
  id: string;
  nome: string;
  cpf: string;
  aniversario: string | null;
};

function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    aniversario: row.aniversario,
  };
}

export async function getProfile(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, cpf, aniversario')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Erro ao buscar perfil: ${error.message}`);
  }

  return mapProfile(data);
}

export async function createProfile(userId: string, profile: Omit<User, 'id'>): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      nome: profile.nome,
      cpf: profile.cpf,
      aniversario: profile.aniversario ?? null,
    })
    .select('id, nome, cpf, aniversario')
    .single();

  if (error) {
    throw new Error(`Erro ao criar perfil: ${error.message}`);
  }

  return mapProfile(data);
}
