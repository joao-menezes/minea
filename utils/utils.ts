export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

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

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');

    return `${day}/${month}/${year}`;
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
