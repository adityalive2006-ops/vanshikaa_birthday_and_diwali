import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { sounds } from '../games/soundEffects';

export default function DiwaliSection() {
  // 8 Interactive Diyas state
  const [litDiyas, setLitDiyas] = useState(() => Array(8).fill(false));
  const [rangoliTheme, setRangoliTheme] = useState('gold-pink'); // 'gold-pink' | 'purple-gold' | 'royal-emerald'
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Toggle single diya
  const handleToggleDiya = (index) => {
    sounds.playDiyaLight();
    setLitDiyas(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      
      // Check if all lit
      if (copy.every(Boolean)) {
        sounds.playWin();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffb300', '#ff6d00', '#f472b6', '#ffd700']
        });
      }
      return copy;
    });
  };

  // Light all diyas
  const handleLightAll = () => {
    sounds.playDiyaLight();
    setLitDiyas(Array(8).fill(true));
    sounds.playWin();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ffb300', '#ff6d00', '#f472b6', '#ffd700']
    });
  };

  // Reset diyas
  const handleResetDiyas = () => {
    setLitDiyas(Array(8).fill(false));
  };

  // Fireworks Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];

    const createFirework = (x, y) => {
      sounds.playMove();
      const colorOptions = [
        ['#f472b6', '#ec4899', '#fbcfe8'], // Pink
        ['#fbbf24', '#f59e0b', '#ffd700'], // Gold
        ['#c084fc', '#a855f7', '#e879f9'], // Purple
        ['#34d399', '#10b981', '#6ee7b7']  // Emerald
      ];
      const colors = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      const count = 45;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2);
        const speed = Math.random() * 4 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1.5
        });
      }
    };

    fireworksRef.current = { createFirework };

    // Canvas click to explode firework
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createFirework(x, y);
    };
    canvas.addEventListener('click', handleCanvasClick);

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        createFirework(x, y);
      }
    };
    canvas.addEventListener('touchstart', handleTouch, { passive: true });

    // Initial festive burst
    createFirework(width * 0.3, height * 0.4);
    createFirework(width * 0.7, height * 0.35);

    // Render loop
    const render = () => {
      ctx.fillStyle = 'rgba(16, 5, 29, 0.25)';
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('touchstart', handleTouch);
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const triggerGrandShow = () => {
    if (!fireworksRef.current || !fireworksRef.current.createFirework) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const rx = Math.random() * (w * 0.8) + (w * 0.1);
        const ry = Math.random() * (h * 0.5) + (h * 0.1);
        fireworksRef.current.createFirework(rx, ry);
      }, i * 250);
    }
  };

  const litCount = litDiyas.filter(Boolean).length;

  return (
    <section id="diwali" className="relative py-20 px-5 sm:px-8 max-w-6xl mx-auto">
      {/* Chapter Marker */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-8 h-[1px] bg-amber-400/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans font-medium">
          The Festival of Lights
        </span>
        <span className="w-8 h-[1px] bg-amber-400/40" />
      </div>

      <h2 className="text-3xl sm:text-5xl font-serif-display font-normal text-amber-100 text-center mb-3">
        Diyas, Rangoli & Fireworks
      </h2>
      <p className="text-purple-200/70 text-xs sm:text-sm text-center max-w-xl mx-auto mb-12 font-light">
        A luminous celebration on the night of Diwali. Kindle the eight earthen lamps and paint the night sky with fireworks.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
        {/* INTERACTIVE DIYA CEREMONY */}
        <div className="velvet-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
                <span>The Eight Diyas</span>
                <span className="text-base text-amber-300">🪔</span>
              </h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
                {litCount} / 8 Glowing
              </span>
            </div>

            <p className="text-xs text-purple-200/80 mb-6 font-light">
              Tap each diya to light up its flame. When all eight are glowing, your festive wish is sealed.
            </p>

            {/* 8 Diyas Grid */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-[#11041d]/80 rounded-2xl border border-purple-900/50">
              {litDiyas.map((isLit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleDiya(idx)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                    isLit
                      ? 'bg-amber-400/20 border border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105'
                      : 'bg-purple-900/30 border border-purple-800/40 hover:bg-purple-800/40'
                  }`}
                  title={isLit ? 'Tap to extinguish' : 'Tap to light diya'}
                >
                  {/* Diya Flame */}
                  <div className="h-6 flex items-center justify-center mb-1">
                    {isLit ? (
                      <span className="diya-flame text-xl filter drop-shadow-[0_0_8px_#ff9800]">
                        🔥
                      </span>
                    ) : (
                      <span className="text-xs text-purple-500 font-bold">•</span>
                    )}
                  </div>

                  {/* Earthen Clay Diya Body */}
                  <span className="text-2xl filter drop-shadow-md">🪔</span>
                  <span className="text-[10px] text-amber-200/80 font-bold mt-1">#{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Diya Controls */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleLightAll}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              <Sparkles size={14} /> Light All 8 Diyas
            </button>
            <button
              onClick={handleResetDiyas}
              className="px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-300 hover:text-white border border-purple-700/40 text-xs font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* GLOWING RANGOLI ART */}
        <div className="velvet-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
                <span>The Golden Rangoli</span>
                <span className="text-base text-amber-300">🌸</span>
              </h3>
              {/* Color Switcher */}
              <div className="flex gap-1 bg-purple-950/80 p-1 rounded-xl border border-purple-800/40">
                <button
                  onClick={() => setRangoliTheme('gold-pink')}
                  className={`w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 ${rangoliTheme === 'gold-pink' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Gold & Pink Theme"
                />
                <button
                  onClick={() => setRangoliTheme('purple-gold')}
                  className={`w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-amber-400 ${rangoliTheme === 'purple-gold' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Royal Purple & Gold"
                />
                <button
                  onClick={() => setRangoliTheme('royal-emerald')}
                  className={`w-5 h-5 rounded-full bg-gradient-to-r from-teal-400 to-amber-400 ${rangoliTheme === 'royal-emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Teal & Gold"
                />
              </div>
            </div>

            {/* Rotating SVG Rangoli Mandalas */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2 flex items-center justify-center select-none">
              {/* Outer Rotating Lotus Petals */}
              <svg
                viewBox="0 0 200 200"
                className={`w-full h-full animate-spin-slow transition-colors duration-500 ${
                  rangoliTheme === 'gold-pink'
                    ? 'text-pink-400'
                    : rangoliTheme === 'purple-gold'
                    ? 'text-purple-400'
                    : 'text-teal-400'
                }`}
              >
                <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6,6" opacity="0.4" />
                <circle cx="100" cy="100" r="82" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x = 100 + 70 * Math.cos(angle);
                  const y = 100 + 70 * Math.sin(angle);
                  return (
                    <circle key={i} cx={x} cy={y} r="8" fill="currentColor" opacity="0.5" />
                  );
                })}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const x = 100 + 48 * Math.cos(angle);
                  const y = 100 + 48 * Math.sin(angle);
                  return (
                    <polygon
                      key={i}
                      points={`${x},${y-7} ${x+7},${y} ${x},${y+7} ${x-7},${y}`}
                      fill="#fbbf24"
                      opacity="0.8"
                    />
                  );
                })}
              </svg>

              {/* Inner Radiant Diya Core */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-1 shadow-2xl flex items-center justify-center glow-gold">
                  <div className="w-full h-full rounded-full bg-[#1b082e] flex flex-col items-center justify-center">
                    <span className="text-2xl filter drop-shadow-[0_0_8px_#ffd700]">🪔</span>
                    <span className="text-[9px] font-serif font-black text-amber-200 tracking-wider">VANSHIKAA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-pink-300 font-medium mt-2">
            "Just like Rangoli colors blend in harmony, your presence adds beauty to every life."
          </p>
        </div>
      </div>

      {/* INTERACTIVE FIREWORKS CANVAS */}
      <div className="velvet-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4 relative z-10">
          <div>
            <h3 className="text-xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
              <span>Night Sky Fireworks</span>
              <span className="text-base text-amber-300">🎆</span>
            </h3>
            <p className="text-xs text-purple-200/70 font-light">Tap anywhere on the night sky below to launch sparklers</p>
          </div>

          <button
            onClick={triggerGrandShow}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Sparkles size={14} /> Grand Illumination
          </button>
        </div>

        {/* Canvas */}
        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-purple-800/50 bg-[#0d0317] cursor-crosshair">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-3 left-4 text-[11px] text-purple-400/80 pointer-events-none">
            ✨ Tap / click screen to shoot sparklers!
          </div>
        </div>
      </div>
    </section>
  );
}

