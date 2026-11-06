import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from './soundEffects';
import { RotateCcw, Dices, Trophy, Users, Sparkles, ChevronRight } from 'lucide-react';

const LADDERS = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91
};

const SNAKES = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78
};

const PLAYER_COLORS = [
  { name: 'Vanshikaa 🪔', color: 'bg-pink-500', border: 'border-pink-300', text: 'text-pink-400', glow: 'shadow-[0_0_12px_#ec4899]', marker: '💖' },
  { name: 'Player 2 🌟', color: 'bg-amber-400', border: 'border-amber-200', text: 'text-amber-400', glow: 'shadow-[0_0_12px_#fbbf24]', marker: '✨' },
  { name: 'Player 3 💜', color: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-400', glow: 'shadow-[0_0_12px_#a855f7]', marker: '🔮' },
  { name: 'Player 4 👑', color: 'bg-cyan-400', border: 'border-cyan-200', text: 'text-cyan-400', glow: 'shadow-[0_0_12px_#22d3ee]', marker: '👑' },
];

export default function SnakeLadder() {
  const [playerCount, setPlayerCount] = useState(2);
  const [positions, setPositions] = useState([1, 1]);
  const [currentTurn, setCurrentTurn] = useState(0); // 0 to playerCount - 1
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameMessage, setGameMessage] = useState('Welcome! Vanshikaa rolls first. Have fun! 🎲');

  // When player count changes, reset
  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setPositions(Array(count).fill(1));
    setCurrentTurn(0);
    setWinner(null);
    setGameMessage(`Game restarted with ${count} players!`);
  };

  const rollDice = async () => {
    if (isRolling || isMoving || winner !== null) return;

    setIsRolling(true);
    sounds.playDiceRoll();

    // Roll animation
    let tempRoll = 1;
    for (let i = 0; i < 8; i++) {
      tempRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(tempRoll);
      await new Promise(r => setTimeout(r, 60));
    }

    const finalRoll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalRoll);
    setIsRolling(false);
    setIsMoving(true);

    // Calculate move
    const currentPos = positions[currentTurn];
    const targetPos = currentPos + finalRoll;

    if (targetPos > 100) {
      // Must land exactly on 100
      setGameMessage(`${PLAYER_COLORS[currentTurn].name} rolled a ${finalRoll}! Need exact roll to reach 100.`);
      await new Promise(r => setTimeout(r, 600));
      endTurn(finalRoll);
      return;
    }

    // Step-by-step movement animation
    let pos = currentPos;
    for (let step = 1; step <= finalRoll; step++) {
      pos++;
      sounds.playMove();
      setPositions(prev => {
        const copy = [...prev];
        copy[currentTurn] = pos;
        return copy;
      });
      await new Promise(r => setTimeout(r, 160));
    }

    // Check for Ladder or Snake
    if (LADDERS[pos]) {
      const ladderEnd = LADDERS[pos];
      setGameMessage(`🎉 WOW! ${PLAYER_COLORS[currentTurn].name} found a Golden Ladder to ${ladderEnd}!`);
      await new Promise(r => setTimeout(r, 350));
      sounds.playLadder();
      setPositions(prev => {
        const copy = [...prev];
        copy[currentTurn] = ladderEnd;
        return copy;
      });
      pos = ladderEnd;
    } else if (SNAKES[pos]) {
      const snakeEnd = SNAKES[pos];
      setGameMessage(`🐍 Oh no! A mischievous snake bit ${PLAYER_COLORS[currentTurn].name}! Slid down to ${snakeEnd}.`);
      await new Promise(r => setTimeout(r, 350));
      sounds.playSnake();
      setPositions(prev => {
        const copy = [...prev];
        copy[currentTurn] = snakeEnd;
        return copy;
      });
      pos = snakeEnd;
    } else {
      setGameMessage(`${PLAYER_COLORS[currentTurn].name} moved to tile ${pos}.`);
    }

    // Check Winner
    if (pos === 100) {
      setWinner(currentTurn);
      sounds.playWin();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#f5b041', '#ffd700', '#c084fc']
      });
      setGameMessage(`🏆 VICTORY! ${PLAYER_COLORS[currentTurn].name} reached 100 and won! 🎆`);
      setIsMoving(false);
      return;
    }

    await new Promise(r => setTimeout(r, 300));
    endTurn(finalRoll);
  };

  const endTurn = (finalRoll) => {
    setIsMoving(false);
    // Extra turn on rolling 6!
    if (finalRoll === 6) {
      setGameMessage(`🎲 ${PLAYER_COLORS[currentTurn].name} rolled a 6! Bonus roll!`);
    } else {
      const nextTurn = (currentTurn + 1) % playerCount;
      setCurrentTurn(nextTurn);
      setGameMessage(`Turn: ${PLAYER_COLORS[nextTurn].name}`);
    }
  };

  const resetGame = () => {
    setPositions(Array(playerCount).fill(1));
    setCurrentTurn(0);
    setWinner(null);
    setDiceValue(1);
    setGameMessage('Game reset! Ready to play again.');
  };

  // Generate 100 tiles zigzag grid (10 rows of 10)
  // Row 10 is 100..91, Row 9 is 81..90, Row 8 is 80..71, etc.
  const rows = [];
  for (let r = 9; r >= 0; r--) {
    const rowTiles = [];
    const isEvenRowFromBottom = r % 2 === 1; // 1, 3, 5, 7, 9 are reversed
    for (let c = 0; c < 10; c++) {
      const tileNum = isEvenRowFromBottom ? (r * 10) + (10 - c) : (r * 10) + (c + 1);
      rowTiles.push(tileNum);
    }
    rows.push(rowTiles);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto velvet-card rounded-3xl p-4 sm:p-7 relative select-none">
      {/* Title & Player Selector */}
      <div className="flex flex-wrap justify-between items-center w-full gap-3 mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
            <span>Snake & Ladder</span>
            <span className="text-base text-amber-300">🪜</span>
          </h3>
          <p className="text-[11px] text-purple-200/70 uppercase tracking-widest font-sans">100-Square Royal Climb</p>
        </div>

        {/* Player Count Select */}
        <div className="flex items-center gap-1 bg-[#160626] p-1 rounded-full border border-amber-400/20 text-xs">
          <span className="text-[11px] text-purple-300/80 pl-2 pr-1 font-medium flex items-center gap-1">
            <Users size={12} /> Players:
          </span>
          {[2, 3, 4].map(count => (
            <button
              key={count}
              onClick={() => handlePlayerCountChange(count)}
              className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
                playerCount === count
                  ? 'bg-amber-400 text-purple-950 shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              {count}P
            </button>
          ))}
        </div>
      </div>

      {/* Players Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-4">
        {Array.from({ length: playerCount }).map((_, idx) => {
          const p = PLAYER_COLORS[idx];
          const isCurrent = currentTurn === idx && winner === null;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-purple-900/80 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                  : 'bg-purple-950/40 border-purple-800/40 opacity-80'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold ${p.text} flex items-center gap-1`}>
                  <span>{p.marker}</span> {p.name.split(' ')[0]}
                </span>
                <span className="text-amber-300 font-bold bg-purple-900/60 px-1.5 py-0.5 rounded-md">
                  #{positions[idx]}
                </span>
              </div>
              {/* Progress bar to 100 */}
              <div className="w-full bg-purple-950 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full ${p.color} transition-all duration-300`}
                  style={{ width: `${positions[idx]}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Message Banner */}
      <div className="w-full bg-purple-950/80 border border-purple-800/40 rounded-xl px-3 py-2 text-center text-xs sm:text-sm text-amber-200 font-medium mb-4 min-h-[36px] flex items-center justify-center">
        {gameMessage}
      </div>

      {/* 100-Square Board */}
      <div className="w-full max-w-[480px] aspect-square p-2 bg-gradient-to-br from-[#2a0e44] to-[#160628] border-2 border-amber-400/40 rounded-2xl shadow-2xl relative select-none">
        <div className="grid grid-rows-10 gap-1 w-full h-full">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-10 gap-1 w-full h-full">
              {row.map(tileNum => {
                const isLadder = LADDERS[tileNum];
                const isSnake = SNAKES[tileNum];
                const isSpecial = tileNum === 100 || tileNum === 1;

                // Check which players are on this tile
                const playersHere = [];
                positions.forEach((pos, pIdx) => {
                  if (pos === tileNum) playersHere.push(pIdx);
                });

                return (
                  <div
                    key={tileNum}
                    className={`relative rounded-md flex flex-col items-center justify-between p-0.5 text-[9px] sm:text-[10px] font-bold transition-all ${
                      tileNum === 100
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-950 shadow-[0_0_12px_#fbbf24]'
                        : isLadder
                        ? 'bg-emerald-950/60 border border-emerald-400/40 text-emerald-300'
                        : isSnake
                        ? 'bg-rose-950/60 border border-rose-400/40 text-rose-300'
                        : (tileNum % 2 === 0)
                        ? 'bg-purple-900/40 text-purple-200'
                        : 'bg-purple-950/40 text-pink-200'
                    }`}
                  >
                    {/* Tile Number */}
                    <span className="opacity-75 leading-none">{tileNum}</span>

                    {/* Special Icons */}
                    {tileNum === 100 && <span className="text-xs">🏆</span>}
                    {isLadder && <span className="text-[11px] leading-none" title={`Ladder to ${isLadder}`}>🪜</span>}
                    {isSnake && <span className="text-[11px] leading-none" title={`Snake to ${isSnake}`}>🐍</span>}

                    {/* Player Tokens On Tile */}
                    {playersHere.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-10">
                        {playersHere.map(pIdx => (
                          <div
                            key={pIdx}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${PLAYER_COLORS[pIdx].color} ${PLAYER_COLORS[pIdx].border} border-2 flex items-center justify-center text-[8px] text-white font-bold shadow-md transform animate-pulse`}
                          >
                            {pIdx + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls: Dice Roll & Action */}
      <div className="flex flex-wrap justify-between items-center w-full max-w-[480px] mt-5 gap-3">
        {/* Current Turn Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full ${PLAYER_COLORS[currentTurn].color} border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md`}
          >
            {currentTurn + 1}
          </div>
          <div>
            <div className="text-[11px] text-purple-300">Active Turn</div>
            <div className={`text-xs font-bold ${PLAYER_COLORS[currentTurn].text}`}>
              {PLAYER_COLORS[currentTurn].name}
            </div>
          </div>
        </div>

        {/* Big Dice Roller */}
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border-2 border-white flex items-center justify-center text-3xl font-extrabold text-purple-950 shadow-xl transition-transform duration-200 ${
              isRolling ? 'rotate-180 scale-110 animate-spin' : ''
            }`}
          >
            {diceValue}
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling || isMoving || winner !== null}
            className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all ${
              winner !== null
                ? 'bg-purple-900/50 text-purple-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-purple-950 active:scale-95 shadow-pink-500/25'
            }`}
          >
            <Dices size={18} />
            <span>{isRolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll Dice'}</span>
          </button>
        </div>

        {/* Restart Button */}
        <button
          onClick={resetGame}
          className="p-3 rounded-2xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/40 text-xs transition-all"
          title="Restart Game"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Winner Celebration Modal */}
      {winner !== null && (
        <div className="absolute inset-0 bg-purple-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20">
          <Trophy size={54} className="text-amber-400 animate-bounce mb-3" />
          <h4 className="text-3xl font-serif font-bold text-amber-200 mb-2">
            Victory! 🎆
          </h4>
          <p className="text-lg text-pink-300 mb-6 font-semibold">
            {PLAYER_COLORS[winner].name} wins the Diwali Climb!
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 text-purple-950 font-bold shadow-xl hover:scale-105 transition-all"
          >
            Play Another Round 🎲
          </button>
        </div>
      )}
    </div>
  );
}

