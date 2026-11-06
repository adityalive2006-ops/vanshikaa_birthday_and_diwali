import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { sounds } from '../games/soundEffects';

export default function BirthdayCake() {
  // Exactly 20 candles for 20th birthday
  const [candles, setCandles] = useState(() => Array(20).fill(true));
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandle = (index) => {
    sounds.playCandleBlow();
    setCandles(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      if (copy.every(c => !c)) {
        triggerCelebration();
      }
      return copy;
    });
  };

  const handleBlowAll = () => {
    sounds.playCandleBlow();
    setCandles(Array(20).fill(false));
    triggerCelebration();
  };

  const handleRelight = () => {
    sounds.playDiyaLight();
    setCandles(Array(20).fill(true));
    setWishMade(false);
  };

  const triggerCelebration = () => {
    sounds.playWin();
    setWishMade(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#c084fc']
    });
  };

  const litCount = candles.filter(Boolean).length;

  return (
    <section id="birthday-cake" className="relative py-24 px-5 sm:px-8 max-w-4xl mx-auto flex flex-col items-center">
      {/* Chapter Marker */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-8 h-[1px] bg-amber-400/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans font-medium">
          The Grand Finale
        </span>
        <span className="w-8 h-[1px] bg-amber-400/40" />
      </div>

      <h2 className="text-3xl sm:text-5xl font-serif-display font-normal text-amber-100 text-center mb-3">
        The 20th Birthday Cake
      </h2>
      <p className="text-purple-200/70 text-xs sm:text-sm text-center max-w-md mx-auto mb-10 font-light">
        Twenty golden candles celebrating two decades of light. Tap to blow them out, or make a grand wish!
      </p>

      {/* Lit counter pill */}
      <div className="mb-8 px-4 py-1.5 rounded-full border border-amber-400/20 bg-[#150524]/60 backdrop-blur-md text-xs text-amber-200 font-sans tracking-wide">
        {litCount > 0 ? (
          <span>{litCount} of 20 Candles Glowing • Tap to extinguish</span>
        ) : (
          <span className="text-amber-300 font-semibold">All 20 wishes released to the universe! ✨</span>
        )}
      </div>

      {/* Royal Pedestal & 3-Tier Cake */}
      <div className="relative w-full max-w-md flex flex-col items-center select-none pt-8 pb-4">
        {/* Ambient Pedestal Glow */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 20 Candles arranged in two neat rows */}
        <div className="w-[88%] grid grid-cols-10 gap-1 sm:gap-2 mb-[-6px] z-20">
          {candles.map((isLit, idx) => (
            <button
              key={idx}
              onClick={() => handleBlowCandle(idx)}
              className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 active:scale-90"
              title={isLit ? `Candle #${idx + 1}` : 'Extinguished'}
            >
              <div className="h-5 flex items-center justify-center">
                {isLit ? (
                  <span className="candle-flame text-sm filter drop-shadow-[0_0_8px_#fbbf24]">
                    🔥
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 opacity-60">
                    💨
                  </span>
                )}
              </div>
              <div
                className={`w-2 h-7 rounded-full shadow-sm ${
                  idx % 2 === 0
                    ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500'
                    : 'bg-gradient-to-b from-rose-300 via-rose-400 to-pink-500'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Tier 1: Top Layer */}
        <div className="w-[75%] h-14 bg-gradient-to-r from-rose-400 via-rose-300 to-rose-400 rounded-t-2xl border border-amber-300/60 shadow-lg relative flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-white/70 rounded-b-lg" />
          <span className="font-editorial text-sm font-semibold tracking-widest text-[#2a0e38] uppercase z-10">
            Vanshikaa • XX
          </span>
        </div>

        {/* Tier 2: Middle Layer */}
        <div className="w-[88%] h-16 bg-gradient-to-r from-[#531872] via-[#702196] to-[#531872] rounded-t-xl border-x border-t border-amber-300/40 shadow-xl relative flex items-center justify-around overflow-hidden px-4">
          <div className="absolute top-0 inset-x-0 h-2 bg-amber-200/50 rounded-b-md" />
          <span className="text-xs text-amber-200">🪔</span>
          <span className="text-xs text-amber-200">✦</span>
          <span className="text-xs text-amber-200">🌸</span>
          <span className="text-xs text-amber-200">✦</span>
          <span className="text-xs text-amber-200">🪔</span>
        </div>

        {/* Tier 3: Bottom Layer */}
        <div className="w-full h-20 bg-gradient-to-r from-[#2f0b44] via-[#431260] to-[#2f0b44] rounded-t-xl border border-amber-400/50 shadow-2xl relative flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-3 bg-pink-300/60 rounded-b-lg" />
          <span className="font-editorial text-amber-200 font-semibold text-sm sm:text-base tracking-wider uppercase mt-2">
            Diwali • 8 November 2026
          </span>
          <span className="text-[10px] text-purple-200/80 uppercase tracking-widest font-sans font-light">
            Twenty Golden Years
          </span>
        </div>

        {/* Golden Base */}
        <div className="w-[105%] h-4 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-full shadow-2xl border border-amber-200 mt-[-2px]" />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 z-10">
        <button
          onClick={handleBlowAll}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-purple-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Make a Wish & Blow All 20 Candles! 🎂</span>
        </button>

        <button
          onClick={handleRelight}
          className="px-5 py-3 rounded-full bg-[#1c0828] hover:bg-[#280c38] border border-amber-400/30 text-amber-200 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
        >
          <RefreshCw size={14} />
          <span>Relight Candles</span>
        </button>
      </div>

      {/* Wish Made Modal */}
      {wishMade && (
        <div className="mt-12 w-full max-w-lg velvet-card rounded-3xl p-8 text-center relative animate-[fadeIn_0.5s_ease-out]">
          <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-400/10 mx-auto flex items-center justify-center shadow-lg mb-4 text-2xl">
            🪔
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-amber-200 mb-2">
            The 20th Birthday Wish
          </h3>

          <p className="text-sm text-purple-200/90 leading-relaxed font-light mb-6">
            May every dream you hold close unfold with grace. May your twenties be marked by deep happiness, good health, great friendships, and enduring success. Happy 20th Birthday, Vanshikaa!
          </p>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-amber-300 shadow-md">
              <img src="/images/vanshikaa.jpg" alt="Vanshikaa" className="w-full h-full object-cover" />
            </div>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-pink-400 shadow-md">
              <video src="/videos/vanshikaa_face.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>

          <p className="font-handwriting text-2xl text-amber-300 mt-4">
            Happy 20th Birthday & Happy Diwali! ✨🪔
          </p>
        </div>
      )}
    </section>
  );
}
