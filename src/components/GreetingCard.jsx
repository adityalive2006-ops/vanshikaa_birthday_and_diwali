import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../games/soundEffects';
import { Mail, Sparkles, X, ChevronRight } from 'lucide-react';

export default function GreetingCard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    sounds.playCardFlip();
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899']
    });
  };

  const handleClose = () => {
    sounds.playCardFlip();
    setIsOpen(false);
  };

  return (
    <section id="greeting-card" className="relative py-20 px-5 sm:px-8 max-w-4xl mx-auto flex flex-col items-center">
      {/* Editorial Chapter Marker */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-[1px] bg-amber-400/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans font-medium">
          The Birthday Letter
        </span>
        <span className="w-8 h-[1px] bg-amber-400/40" />
      </div>

      <h2 className="text-3xl sm:text-5xl font-serif-display font-normal text-amber-100 text-center mb-3">
        A Note for Vanshikaa
      </h2>
      <p className="text-purple-200/70 text-xs sm:text-sm text-center max-w-md mx-auto mb-10 font-light">
        A personal birthday greeting written to celebrate your twentieth milestone on the auspicious festival of Diwali.
      </p>

      {/* Interactive Envelope & Card Container */}
      {!isOpen ? (
        /* Royal Velvet & Gold Embossed Envelope */
        <div
          onClick={handleOpen}
          className="relative w-full max-w-lg aspect-[1.5/1] rounded-3xl bg-gradient-to-br from-[#2a0e44] via-[#1a072c] to-[#0f031b] border border-amber-400/35 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-pointer group hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Envelope geometric diagonal folds */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#3a135e] to-[#25093e] border-b border-amber-400/25 origin-top group-hover:scale-y-95 transition-transform duration-300" />

          {/* Delicate gold filigree accents */}
          <span className="absolute top-4 left-5 text-amber-300/40 text-xs select-none">🪔</span>
          <span className="absolute top-4 right-5 text-amber-300/40 text-xs select-none">✦</span>
          <span className="absolute bottom-4 left-5 text-amber-300/40 text-xs select-none">✦</span>
          <span className="absolute bottom-4 right-5 text-amber-300/40 text-xs select-none">🪔</span>

          {/* Wax Seal */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border border-amber-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="font-cinzel text-purple-950 text-2xl font-bold tracking-tighter">V</span>
            <span className="text-[8px] font-sans font-black uppercase tracking-widest text-purple-950/80 -mt-1">
              XX
            </span>
          </div>

          <div className="relative z-10 mt-5 text-center">
            <span className="font-editorial italic text-xl text-amber-200 font-medium tracking-wide block">
              For Vanshikaa
            </span>
            <span className="text-[11px] text-pink-300/80 font-sans tracking-wider uppercase mt-1 flex items-center justify-center gap-1.5 group-hover:text-amber-200 transition-colors">
              <span>Open the letter</span>
              <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      ) : (
        /* Opened Parchment Letter */
        <div className="relative w-full max-w-2xl parchment-sheet rounded-3xl p-8 sm:p-12 text-[#241304] border border-[#d4af37]/40 shadow-[0_30px_70px_rgba(0,0,0,0.8)] animate-[fadeIn_0.4s_ease-out]">
          {/* Top Close Icon */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#6b5138] hover:text-[#241304] hover:bg-[#ede3d1] transition-colors"
            title="Fold Back"
          >
            <X size={18} />
          </button>

          {/* Letter Header */}
          <div className="border-b border-[#d8c5aa] pb-5 mb-8 flex justify-between items-end">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8c6d48] font-sans font-semibold block mb-1">
                8 November 2026 • Diwali
              </span>
              <span className="font-editorial italic text-2xl sm:text-3xl text-[#2b1706] font-semibold">
                Dearest Vanshikaa,
              </span>
            </div>
            <span className="text-2xl text-[#b8860b]">🪔</span>
          </div>

          {/* Letter Body */}
          <div className="font-serif-display text-base sm:text-lg leading-[1.8] text-[#3d2716] space-y-5 font-normal">
            <p>
              Happy 20th Birthday! Reaching two full decades is a landmark milestone, and having it coincide right on the day of Diwali makes it twice as special.
            </p>

            <p>
              Just as homes are lit up with diyas and warmth across the country today, you naturally bring positive energy, genuine laughs, and brightness to everyone lucky enough to call you a friend. From the most hilarious candid moments to simply having great conversations, you are truly one of the most reliable and wonderful people around.
            </p>

            <p>
              Stepping into your twenties is the start of your most exciting era yet. May this year and the years ahead bring you clarity in what you pursue, adventures you will always remember, vibrant health, and every bit of success you work towards.
            </p>

            <p>
              Have the happiest birthday celebration and a sparkling Diwali with family and friends!
            </p>
          </div>

          {/* Signoff */}
          <div className="mt-10 pt-6 border-t border-[#d8c5aa] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="font-handwriting text-3xl sm:text-4xl text-[#7a481e] block">
                Warmest wishes always,
              </span>
              <span className="font-editorial text-base text-[#4a321e] font-semibold mt-1 block">
                Your Good Friend ✨
              </span>
            </div>

            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-full border border-[#b89569] text-xs font-sans tracking-wider uppercase text-[#4a321e] hover:bg-[#ebd9bf] transition-colors"
            >
              Close Letter
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
