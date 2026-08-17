import { Users } from 'lucide-react';

export function EmptyClients() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f6ede8] text-[#b89a8d]">
        <Users size={20} strokeWidth={1.5} />
      </div>

      <p className="mt-4 font-display text-[23px] text-[#8a6f63]">Nenhuma cliente encontrada</p>

      <p className="mt-2 text-[10px] text-[#b49b90]">
        Tente buscar por outro nome, telefone ou e-mail.
      </p>
    </div>
  );
}
