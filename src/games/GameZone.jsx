import React, { useState } from 'react';
import TicTacToe from './TicTacToe';
import SnakeLadder from './SnakeLadder';
import Ludo from './Ludo';
import { Gamepad2, Sparkles } from 'lucide-react';

export default function GameZone() {
  const [selectedGame, setSelectedGame] = useState('tictactoe'); // 'tictactoe' | 'snakeladder' | 'ludo'

  const games = [
    { id: 'tictactoe', name: 'Diwali Tic-Tac-Toe', badge: '🪔 3x3 Match' },
    { id: 'snakeladder', name: 'Snake & Ladder', badge: '🪜 100 Squares' },
    { id: 'ludo', name: 'Royal Ludo', badge: '👑 4-Token Race' },
  ];

  return (
    <section id="game-zone" className="relative py-20 px-5 sm:px-8 max-w-5xl mx-auto">
      {/* Chapter Marker */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-8 h-[1px] bg-amber-400/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-sans font-medium">
          The Courtyard Arena
        </span>
        <span className="w-8 h-[1px] bg-amber-400/40" />
      </div>

      <h2 className="text-3xl sm:text-5xl font-serif-display font-normal text-amber-100 text-center mb-3">
        Celebration Games
      </h2>
      <p className="text-purple-200/70 text-xs sm:text-sm text-center max-w-md mx-auto mb-10 font-light">
        Classic board games set in festive Diwali colors. Play together or challenge the computer!
      </p>

      {/* Elegant Game Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-[#160624]/80 p-1.5 rounded-full border border-amber-400/20 backdrop-blur-md shadow-xl gap-1">
          {games.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
                selectedGame === g.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-bold shadow-lg scale-105'
                  : 'text-purple-200/80 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Game Display */}
      <div className="w-full flex justify-center">
        {selectedGame === 'tictactoe' && <TicTacToe initialMode="ai" />}
        {selectedGame === 'snakeladder' && <SnakeLadder />}
        {selectedGame === 'ludo' && <Ludo initialMode="ai" />}
      </div>
    </section>
  );
}
