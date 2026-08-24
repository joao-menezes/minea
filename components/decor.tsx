import type { SVGProps } from 'react';

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
      <ellipse cx="12" cy="7.4" rx="3" ry="4.6" fill="#d9a998" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="7.4" rx="3" ry="4.6" fill="#d9a998" transform="rotate(72 12 12)" />
      <ellipse cx="12" cy="7.4" rx="3" ry="4.6" fill="#d9a998" transform="rotate(144 12 12)" />
      <ellipse cx="12" cy="7.4" rx="3" ry="4.6" fill="#d9a998" transform="rotate(216 12 12)" />
      <ellipse cx="12" cy="7.4" rx="3" ry="4.6" fill="#d9a998" transform="rotate(288 12 12)" />
      <circle cx="12" cy="12" r="2.4" fill="#f6ece6" />
    </svg>
  );
}
