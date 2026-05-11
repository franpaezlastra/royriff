import { useEffect, useState } from 'react';

/**
 * Countdown timer hasta una fecha objetivo.
 * Re-renderiza cada segundo. Si la fecha pasó, llama a onExpire (opcional)
 * y muestra `expiredText` o null.
 *
 * Variantes:
 *  - compact (default): "2d 14h 32m 18s" en una línea
 *  - blocks: bloques separados con etiqueta (D/H/M/S)
 *
 * @example
 * <Countdown
 *   endDate="2026-05-13T23:59:59-03:00"
 *   variant="blocks"
 *   theme="dark"
 * />
 */
const Countdown = ({
  endDate,
  variant = 'blocks',
  theme = 'dark',
  expiredText = '',
  onExpire,
  className = '',
}) => {
  const [remaining, setRemaining] = useState(() => calcRemaining(endDate));

  useEffect(() => {
    const tick = () => setRemaining(calcRemaining(endDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  useEffect(() => {
    if (remaining.expired && typeof onExpire === 'function') {
      onExpire();
    }
  }, [remaining.expired, onExpire]);

  if (remaining.expired) {
    return expiredText ? (
      <span className={className}>{expiredText}</span>
    ) : null;
  }

  const isDark = theme === 'dark';
  const blockBg = isDark ? 'bg-white/15' : 'bg-neutral-black/8';
  const textColor = isDark ? 'text-white' : 'text-neutral-black';
  const labelColor = isDark ? 'text-white/70' : 'text-neutral-darkGreen/70';

  if (variant === 'compact') {
    return (
      <span
        className={`font-barlow font-bold tabular-nums tracking-wider ${textColor} ${className}`}
      >
        {remaining.days > 0 && `${remaining.days}d `}
        {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
      </span>
    );
  }

  const blocks = [
    { value: remaining.days, label: 'DÍAS' },
    { value: remaining.hours, label: 'HS' },
    { value: remaining.minutes, label: 'MIN' },
    { value: remaining.seconds, label: 'SEG' },
  ];

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {blocks.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div
            className={`flex flex-col items-center justify-center rounded-lg ${blockBg} backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 min-w-[58px] sm:min-w-[68px]`}
          >
            <span
              className={`font-barlow font-black text-2xl sm:text-3xl leading-none tabular-nums ${textColor}`}
            >
              {pad(value)}
            </span>
            <span
              className={`font-barlow text-[10px] sm:text-xs font-bold tracking-widest mt-1 ${labelColor}`}
            >
              {label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className={`font-barlow font-black text-2xl ${textColor} opacity-40`}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const calcRemaining = (endDate) => {
  try {
    const end = new Date(endDate).getTime();
    const diff = end - Date.now();
    if (isNaN(end) || diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { expired: false, days, hours, minutes, seconds };
  } catch {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

export default Countdown;
