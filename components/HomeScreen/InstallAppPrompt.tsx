'use client';

import { useEffect, useState } from 'react';

import { Download, X } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('minea_install_prompt_dismissed') === 'true') return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const android = /android/i.test(navigator.userAgent);
    setIsIos(ios);
    setIsAndroid(android);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    const fallbackTimer = window.setTimeout(() => {
      if (ios || android) setVisible(true);
    }, 1200);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setVisible(false);
    }

    setInstallEvent(null);
  }

  function dismiss() {
    localStorage.setItem('minea_install_prompt_dismissed', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-5 z-40 mx-auto max-w-md rounded-[22px] border border-[#eaded8] bg-white p-4 shadow-[0_20px_45px_-20px_rgba(64,46,40,.4)] sm:inset-x-auto sm:right-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar sugestão de instalação"
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[#b49b90] transition hover:bg-[#f6eee9]"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#f3eae5] text-[#8a6f63]">
          <Download size={17} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#6b5850]">Leve a Minea com você</p>
          <p className="mt-1 text-[9px] leading-relaxed text-[#a48a7f]">
            {isIos
              ? 'Toque em Compartilhar e depois em “Adicionar à Tela de Início”.'
              : isAndroid
                ? 'Abra o menu ⋮ do Chrome e toque em “Instalar aplicativo”.'
              : 'Adicione o site à tela inicial para acessar seus agendamentos mais rápido.'}
          </p>
        </div>
      </div>

      {installEvent ? (
        <button
          type="button"
          onClick={handleInstall}
          className="mt-3 h-10 w-full rounded-[13px] bg-[#8a6f63] text-[10px] font-bold text-white transition hover:bg-[#7c6156]"
        >
          Adicionar à tela inicial
        </button>
      ) : (
        <p className="mt-3 rounded-[13px] bg-[#f6eee9] px-3 py-2 text-center text-[9px] font-semibold text-[#8a6f63]">
          {isIos
            ? 'Use o menu de compartilhamento do Safari.'
            : isAndroid
              ? 'Use o menu ⋮ do Chrome para instalar.'
              : 'Abra o menu do navegador para instalar.'}
        </p>
      )}
    </aside>
  );
}
