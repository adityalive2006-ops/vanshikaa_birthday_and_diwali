import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, Flame } from 'lucide-react';
import { sounds } from '../games/soundEffects';

const QUOTES = [
  {
    id: 1,
    quote: "May the festival of lights illuminate your twentieth birthday with enduring happiness, memorable adventures, and boundless opportunities.",
    context: "The 20th Milestone • 2006 to 2026",
    theme: "Diwali Day"
  },
  {
    id: 2,
    quote: "Entering your twenties is the beginning of life's most vivid chapter. May you embrace every ambition with quiet confidence and great joy.",
    context: "A Toast to the Future",
    theme: "Milestone Chapter"
  },
  {
    id: 3,
    quote: "Born on Diwali and celebrating twenty golden years: May your path forward always glow as warmly and brightly as festive earthen diyas.",
    context: "Festival of Lights",
    theme: "Golden Radiance"
  },
  {
    id: 4,
    quote: "Wishing you a truly phenomenal 20th birthday. May good health, peace of mind, and reasons to celebrate accompany you throughout the decade.",
    context: "Birthday Blessing",
    theme: "Twenty & Thriving"
  }
];

export default function QuoteSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    sounds.playMove();
    setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handlePrev = () => {
    sounds.playMove();
    setCurrentIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
  };

  const handleCopy = () => {
    const text = `"${QUOTES[currentIndex].quote}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = QUOTES[currentIndex];

  return (
    <section id="quotes" className="relative py-20 px-5 sm:px-8 max-w-4xl mx-auto">
      {/* Chapter Marker */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-8 h-[1px] bg-amber-400/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans font-medium">
          Words of Celebration
        </span>
        <span className="w-8 h-[1px] bg-amber-400/40" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-serif-display font-normal text-amber-100 text-center mb-10">
        Diwali & Birthday Reflections
      </h2>

      {/* Main Quote Card */}
      <div className="velvet-card rounded-3xl p-8 sm:p-12 relative">
        {/* Subtle decorative quotation mark */}
        <span className="font-editorial text-7xl sm:text-8xl text-amber-300/20 absolute top-4 left-6 select-none leading-none">
          “
        </span>

        <div className="relative z-10 pt-4">
          <blockquote className="font-editorial italic text-xl sm:text-2xl text-amber-100/95 font-normal leading-relaxed min-h-[100px] flex items-center">
            "{current.quote}"
          </blockquote>

          <div className="mt-8 pt-6 border-t border-amber-400/15 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-sans font-semibold block">
                {current.context}
              </span>
              <span className="text-[11px] text-purple-300/70 font-sans">
                Vanshikaa • 8 November 2026
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-full border border-amber-400/25 bg-amber-400/5 hover:bg-amber-400/15 text-amber-200 text-xs font-sans tracking-wider uppercase transition-colors flex items-center gap-1.5"
                title="Copy wish"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel arrows */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-white/10 text-amber-200/80 transition-colors"
            aria-label="Previous quote"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { sounds.playMove(); setCurrentIndex(idx); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-amber-400'
                    : 'w-1.5 bg-purple-900 hover:bg-purple-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-white/10 text-amber-200/80 transition-colors"
            aria-label="Next quote"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
