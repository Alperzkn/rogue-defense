import React, { useMemo } from 'react';

const COLORS = ['#00C8FF', '#7B2FBE', '#B44FFF'];
const COUNT = 16;

export function AnimatedBackground() {
  const particles = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: (Math.random() * 8 + 6).toFixed(1),
      delay: (Math.random() * 6).toFixed(1),
      color: COLORS[i % 3],
    })), []);

  return (
    <div
      className="pointer-events-none fixed bottom-0 left-[220px] right-0 top-0 z-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 10%, #7B2FBE14 0%, transparent 100%), radial-gradient(ellipse 70% 60% at 80% 90%, #00C8FF0A 0%, transparent 100%)' }}
    >
      {/* Grid */}
      <div className="bg-grid absolute inset-0 opacity-100" />
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            '--float-dur': `${p.duration}s`,
            '--float-delay': `${p.delay}s`,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
