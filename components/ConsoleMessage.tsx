'use client';

import { useEffect } from 'react';

let hasLoggedMessage = false;

export function ConsoleMessage() {
  useEffect(() => {
    if (hasLoggedMessage) return;

    hasLoggedMessage = true;

    console.info(
      '%c Minea %c Seu momento de cuidado começa aqui.',
      'background: #8a6f63; color: white; border-radius: 4px 0 0 4px; padding: 4px 8px; font-weight: 700;',
      'background: #f3eae5; color: #6b5850; border-radius: 0 4px 4px 0; padding: 4px 8px;',
    );
  }, []);

  return null;
}
