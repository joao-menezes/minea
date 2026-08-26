'use client';

import { MouseEvent, ReactNode, useEffect } from 'react';

import { X } from 'lucide-react';

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'sheet' | 'centered';
  className?: string;
  backdropClassName?: string;
};

const SIZE_MAP: Record<NonNullable<BaseModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function BaseModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  showCloseButton = true,
  closeLabel = 'Fechar',
  size = 'lg',
  variant = 'sheet',
  className = '',
  backdropClassName = '',
}: BaseModalProps) {
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  }

  const isSheet = variant === 'sheet';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex justify-center bg-[#332925]/35 p-0 backdrop-blur-[7px] ${isSheet ? 'items-end sm:items-center sm:p-5' : 'items-center p-4'} ${backdropClassName}`}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={`relative flex max-h-[92vh] w-full ${SIZE_MAP[size]} flex-col overflow-hidden border border-white/80 bg-[#faf6f3] shadow-[0_35px_100px_-35px_rgba(40,29,25,.7)] ${isSheet ? 'rounded-t-[34px] sm:max-h-[90vh] sm:rounded-[34px]' : 'rounded-[22px]'} ${className}`}
      >
        {isSheet && (
          <div className="absolute left-1/2 top-3 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70 sm:hidden" />
        )}

        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#947568] backdrop-blur transition hover:bg-white/50"
          >
            <X size={14} />
          </button>
        )}

        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default BaseModal;
