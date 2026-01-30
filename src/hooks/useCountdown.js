import { useState, useEffect } from 'react';

/**
 * Returns { days, hours, minutes, seconds } until targetDate.
 * All values are zero-padded strings (e.g. "05", "09").
 */
export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

    const tick = () => {
      const now = new Date();
      const end = new Date(targetDate);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = diff / (1000 * 60 * 60 * 24);
      const hours = (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
      const minutes = (diff % (1000 * 60 * 60)) / (1000 * 60);
      const seconds = (diff % (1000 * 60)) / 1000;

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}
