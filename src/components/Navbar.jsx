import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#welcome' },
    { name: 'The Letter', href: '#greeting-card' },
    { name: 'Reflections', href: '#quotes' },
    { name: 'Game Arena', href: '#game-zone' },
    { name: 'Diwali Courtyard', href: '#diwali' },
    { name: 'The 20th Cake', href: '#birthday-cake' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0c0316]/85 backdrop-blur-md border-b border-amber-400/15 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#welcome" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-gradient-to-tr from-amber-600/30 to-pink-600/30 flex items-center justify-center text-sm shadow-inner group-hover:scale-105 transition-transform duration-300">
            🪔
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-lg tracking-wider text-amber-200 font-semibold group-hover:text-amber-100 transition-colors">
              Vanshikaa
            </span>
            <span className="text-[10px] uppercase tracking-widest text-pink-300/70 font-sans -mt-1">
              XX • Diwali MMXXVI
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#160624]/60 px-3 py-1.5 rounded-full border border-amber-400/15 backdrop-blur-md">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1 text-xs font-medium tracking-wide text-purple-200/80 hover:text-amber-200 hover:bg-amber-400/10 rounded-full transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-amber-200 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0319]/95 backdrop-blur-2xl border-b border-amber-400/20 px-6 py-4 space-y-1 shadow-2xl">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-purple-200 hover:text-amber-200 hover:bg-purple-900/40 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
