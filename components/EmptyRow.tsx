import { Users } from 'lucide-react';

type EmptyRowProps = {
  message: string;
  title?: string;
  search?: string;
};

export function EmptyRow({ message, title, search }: EmptyRowProps) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f6ede8] text-[#b89a8d]">
        <Users size={20} strokeWidth={1.5} />
      </div>

      <p className="mt-4 font-display text-[23px] text-[#8a6f63]">{title}</p>

      <p className="mt-2 text-[10px] text-[#b49b90]">{message}</p>
    </div>
  );
}
