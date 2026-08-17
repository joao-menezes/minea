'use client'

import { type ReactNode, useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

type ModalProps = {
  open: boolean
  onClose: () => void

  children: ReactNode

  title?: string
  description?: string

  footer?: ReactNode

  size?: ModalSize

  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean

  className?: string
  contentClassName?: string
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-5xl',
}

export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, closeOnEscape, onClose])

  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => {
      modalRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [open])

  if (!open) return null

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={[
          'relative z-10 w-full overflow-hidden',
          'rounded-2xl bg-white shadow-2xl',
          'outline-none',
          SIZE_CLASSES[size],
          className,
        ].join(' ')}
      >
        {(title || description || showCloseButton) && (
          <header className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
                  {title}
                </h2>
              )}

              {description && (
                <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className={[
                  'shrink-0 rounded-lg p-2',
                  'text-zinc-400',
                  'transition-colors',
                  'hover:bg-zinc-100 hover:text-zinc-700',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-300',
                ].join(' ')}
              >
                <X size={18} />
              </button>
            )}
          </header>
        )}

        <div className={['max-h-[calc(100vh-12rem)] overflow-y-auto', contentClassName].join(' ')}>
          {children}
        </div>

        {footer && (
          <footer className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">{footer}</footer>
        )}
      </div>
    </div>
  )
}
