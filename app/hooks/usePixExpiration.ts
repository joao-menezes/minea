import { useEffect, useState } from 'react';

export function usePixExpiration(dateOfExpiration?: string | null) {
  const [remaining, setRemaining] = useState('');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!dateOfExpiration) return;

    const expiration = new Date(dateOfExpiration).getTime();
    const totalDuration = expiration - Date.now();

    const update = () => {
      const difference = expiration - Date.now();

      if (difference <= 0) {
        setRemaining('Expirado');
        setProgress(0);
        return;
      }

      const minutes = Math.floor(difference / 1000 / 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setRemaining(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

      setProgress(Math.min(100, Math.max(0, (difference / totalDuration) * 100)));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [dateOfExpiration]);

  return { remaining, progress };
}
