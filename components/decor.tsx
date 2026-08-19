import type { SVGProps } from 'react';

export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  }

  if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
}

export function maskDate(value: string): string {
  if (!value) return '';

  if (value.includes('-')) {
    const [year, month, day] = value.split('-');

    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  }

  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

export const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

export function buildWeekStrip(centerDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(centerDate);

    date.setDate(date.getDate() + index - 3);

    return date;
  });
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeData(time?: string): string {
  if (!time) return '--:--';

  return time.slice(0, 5);
}

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Bow({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 20C20 20 16 9 8 10C2 10.7 3 19 10 20C3 21 2 29.3 8 30C16 31 20 20 20 20Z"
        fill="#EC7FA6"
        opacity="0.9"
      />

      <path
        d="M20 20C20 20 24 9 32 10C38 10.7 37 19 30 20C37 21 38 29.3 32 30C24 31 20 20 20 20Z"
        fill="#F5A6C6"
        opacity="0.9"
      />

      <circle cx="20" cy="20" r="3.4" fill="#B84B78" />
    </svg>
  );
}

export function Sparkle({ size = 16, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" {...props}>
      <path d="M12 0c0 5-1 9-5 12 4 3 5 7 5 12 0-5 1-9 5-12-4-3-5-7-5-12Z" fill="#F2B8D4" />
    </svg>
  );
}
