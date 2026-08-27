'use client';

import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { Check, ChevronDown } from 'lucide-react';

export type DropdownOption = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  id?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

export function CustomDropdown({
  id,
  value,
  options,
  placeholder = 'Selecione uma opção',
  onChange,
  disabled = false,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  function updateMenuPosition() {
    const container = containerRef.current;

    if (!container) return;

    const bounds = container.getBoundingClientRect();

    const gap = 8;
    const viewportPadding = 12;

    const spaceBelow = window.innerHeight - bounds.bottom - gap - viewportPadding;
    const spaceAbove = bounds.top - gap - viewportPadding;

    const preferredHeight = 208;

    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;

    const maxHeight = Math.max(100, Math.min(preferredHeight, openUp ? spaceAbove : spaceBelow));

    setMenuPosition({
      top: openUp ? Math.max(viewportPadding, bounds.top - gap - maxHeight) : bounds.bottom + gap,
      left: bounds.left,
      width: bounds.width,
      maxHeight,
    });
  }

  function toggleDropdown() {
    if (disabled) return;

    if (!open) {
      updateMenuPosition();
    }

    setOpen((current) => !current);
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open]);

  function selectOption(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full" id={id}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleDropdown}
        disabled={disabled}
        className="flex h-11 w-full items-center justify-between rounded-[14px] border border-[#e7ded9] bg-white px-3 text-left text-sm text-[#4b3b36] outline-none transition hover:border-[#d8c5bd] focus:border-[#b49a90] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selectedOption ? 'truncate' : 'truncate text-[#b49b90]'}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`ml-2 shrink-0 text-[#a38379] transition-transform ${open ? 'rotate-180' : ''} `}
        />
      </button>

      {open &&
        menuPosition &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={placeholder}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
            }}
            className="scrollbar-thin scrollbar-thumb-[#d6c9c3] scrollbar-track-transparent fixed z-[999999] overflow-y-auto overscroll-contain rounded-[16px] border border-[#eadfd9] bg-white p-1.5 shadow-[0_18px_40px_-15px_rgba(67,47,40,.35)]"
          >
            {options.length > 0 ? (
              options.map((option) => {
                const selected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectOption(option.value)}
                    className={`flex min-h-10 w-full items-center justify-between rounded-[11px] px-3 text-left text-xs transition ${
                      selected
                        ? 'bg-[#f1e7e2] font-bold text-[#80665c]'
                        : 'text-[#66534c] hover:bg-[#faf4f1]'
                    } `}
                  >
                    <span className="truncate">{option.label}</span>

                    {selected && <Check size={15} />}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-3 text-xs text-[#9a837b]">Nenhuma opção disponível.</p>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
