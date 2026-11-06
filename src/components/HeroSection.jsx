import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../games/soundEffects';
import { ArrowDown, Flame, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const [hasSparkled, setHasSparkled] = useState(false);

  const triggerCelebration = () => {
    sounds.playWin();
    setHasSparkled(true);
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#ec4899', '#c084fc']
    });
    setTimeout(() => setHasSparkled(false), 2500);
  };

  return (
    <section id="welcome" className="relative min-h-[92vh] pt-32 pb-20 px-5 sm:px-8 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
      {/* Delicate Heritage Diya Indicator */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/25 bg-amber-400/5 text-amber-200/90 text-xs tracking-widest uppercase mb-8 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>8 November 2026 • Born on Diwali 2006</span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      </div>

      {/* Main Editorial Typography */}
      <div className="max-w-3xl mx-auto mb-6">
        <p className="font-editorial italic text-2xl sm:text-3xl text-pink-300/90 mb-2 font-normal tracking-wide">
          Celebrating two golden decades
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif-display font-medium tracking-tight text-white leading-[1.08] mb-4">
          Happy 20th Birthday,{' '}
          <span className="block font-editorial italic gold-shimmer font-semibold pt-1">
            Vanshikaa
          </span>
        </h1>
        <p className="text-purple-200/80 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          When a milestone birthday aligns with the festival of lights, the celebration is nothing short of magical. Wishing you warmth, peace, and great achievements as you step into your twenties.
        </p>
      </div>

      {/* CENTERED HERO PORTRAIT PICTURE */}
      <div className="my-8 flex flex-col items-center justify-center">
        {/* Main Center Frame */}
        <div className="w-64 sm:w-80 aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden border border-amber-300/40 p-1.5 bg-gradient-to-b from-amber-400/30 via-purple-900/40 to-transparent shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.01] relative group">
          {/* Top Diya */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-20 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            🪔
          </div>

          <div className="w-full h-full rounded-t-full rounded-b-2xl overflow-hidden relative bg-[#120320]">
            <img
              src="/images/vanshikaa.jpg"
              alt="Vanshikaa Portrait"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Centered Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0216]/90 via-transparent to-transparent flex flex-col justify-end p-5 text-center">
              <span className="font-editorial text-2xl text-amber-200 font-semibold tracking-wide">
                Vanshikaa
              </span>
              <span className="text-[11px] text-pink-300/80 uppercase tracking-widest font-sans mt-0.5">
                The Birthday Portrait • 2026
              </span>
            </div>
          </div>
        </div>

        {/* Centered Live Video Below */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-48 sm:w-56 aspect-square rounded-3xl overflow-hidden border border-pink-400/35 p-1 bg-gradient-to-tr from-pink-500/20 via-purple-900/30 to-amber-400/20 shadow-[0_15px_35px_rgba(0,0,0,0.7)] group">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black">
              <video
                src="/videos/vanshikaa_face.mp4"
                poster="/images/vanshikaa_face_poster.png"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
          <span className="text-xs text-amber-200/80 font-sans tracking-wide mt-2.5">
            Sweet Smiles & Joy ✨
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <a
          href="#greeting-card"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-purple-950 font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-105 flex items-center gap-2"
        >
          <span>Read the Birthday Letter</span>
          <ArrowDown size={14} />
        </a>

        <button
          onClick={triggerCelebration}
          className="px-6 py-3 rounded-full bg-purple-950/60 hover:bg-purple-900/80 border border-amber-400/30 text-amber-200 text-xs tracking-wider uppercase font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <Flame size={14} className="text-amber-400" />
          <span>{hasSparkled ? 'Sparkling!' : 'Celebrate'}</span>
        </button>
      </div>
    </section>
  );
}
