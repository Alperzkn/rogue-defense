import { useState, useRef, type ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: 'top' | 'left';
}

export function Tooltip({ content, children, className, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const onEnter = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setShow(true), 150);
  };
  const onLeave = () => {
    clearTimeout(timeout.current);
    setShow(false);
  };

  const posClass = side === 'left'
    ? 'right-full top-1/2 -translate-y-1/2 mr-2'
    : 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <div
      className={`relative ${className ?? ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {show && (
        <div className={`absolute z-50 pointer-events-none ${posClass}`}>
          <div
            className="max-w-[280px] rounded-xl border border-border/60 px-3.5 py-2.5 text-[11px] text-foreground leading-relaxed whitespace-normal"
            style={{
              background: 'linear-gradient(135deg, hsl(225 18% 10%), hsl(225 15% 7%))',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
              backdropFilter: 'blur(12px)',
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
