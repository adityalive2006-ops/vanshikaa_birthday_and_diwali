import React from 'react';
import Navbar from './components/Navbar';
import FloatingDiyas from './components/FloatingDiyas';
import HeroSection from './components/HeroSection';
import GreetingCard from './components/GreetingCard';
import QuoteSection from './components/QuoteSection';
import GameZone from './games/GameZone';
import DiwaliSection from './components/DiwaliSection';
import BirthdayCake from './components/BirthdayCake';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#08020e] text-[#fcf8f2] relative selection:bg-amber-400 selection:text-purple-950">
      {/* Ambient background lighting & particles */}
      <FloatingDiyas />

      {/* Floating minimalist luxury header */}
      <Navbar />

      {/* Persistent audio controller */}
      <AudioPlayer />

      {/* Main Experience */}
      <main className="relative z-10 space-y-16 sm:space-y-24">
        {/* 01: Welcome Hero */}
        <HeroSection />

        {/* 02: Birthday Greeting Letter */}
        <GreetingCard />

        {/* 03: Reflections & Blessings */}
        <QuoteSection />

        {/* 04: The Courtyard Game Arena */}
        <GameZone />

        {/* 05: Diwali Courtyard (Diyas, Rangoli, Fireworks) */}
        <DiwaliSection />

        {/* 06: The 20-Candle Cake Finale */}
        <BirthdayCake />
      </main>

      {/* High-End Editorial Footer */}
      <footer className="relative z-10 border-t border-amber-400/15 bg-[#0a0212] py-16 px-5 sm:px-8 text-center mt-24">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center text-lg bg-amber-400/5 mb-1 shadow-inner">
            🪔
          </div>

          <h4 className="font-editorial text-2xl sm:text-3xl font-medium tracking-wide text-amber-100">
            A Little World for Vanshikaa
          </h4>

          <p className="text-xs sm:text-sm text-purple-200/70 font-light leading-relaxed max-w-md">
            Crafted in royal plum, blush, and champagne gold for your milestone 20th birthday celebration on Diwali, 8 November 2026.
          </p>

          <div className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-amber-300/90 font-medium pt-4 border-t border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Especially made for you</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>

          <div className="text-[11px] text-purple-400/60 font-sans tracking-wider mt-2">
            Happy 20th Birthday, Vanshikaa. May your year be bright and peaceful. ✨
          </div>
        </div>
      </footer>
    </div>
  );
}
