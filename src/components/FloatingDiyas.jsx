import React, { useMemo } from 'react';

export default function FloatingDiyas() {
  // Generate random stable particles for Diwali ambiance
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.3) + Math.random() * 2}%`,
      top: `${Math.random() * 95}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 5,
      type: i % 5 === 0 ? 'diya' : i % 3 === 0 ? 'sparkle' : 'star'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep ambient radial glow gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-pink-700/15 rounded-full blur-[130px]" />
      <div className="absolute bottom-10 left-1/3 w-[650px] h-[650px] bg-amber-600/15 rounded-full blur-[150px]" />

      {/* Floating particles & sparkles */}
      {particles.map(p => {
        if (p.type === 'diya') {
          return (
            <div
              key={p.id}
              className="absolute animate-float-slow opacity-30 hover:opacity-80 transition-opacity"
              style={{
                left: p.left,
                top: p.top,
                animationDuration: `${p.duration + 3}s`,
                animationDelay: `${p.delay}s`,
              }}
            >
              <span className="text-sm select-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">🪔</span>
            </div>
          );
        }

        if (p.type === 'sparkle') {
          return (
            <div
              key={p.id}
              className="absolute animate-twinkle opacity-40 select-none text-xs text-amber-300"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: `${p.delay}s`,
              }}
            >
              ✨
            </div>
          );
        }

        return (
          <div
            key={p.id}
            className="absolute rounded-full bg-pink-300/40 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: '0 0 8px rgba(244, 114, 182, 0.6)'
            }}
          />
        );
      })}
    </div>
  );
}

