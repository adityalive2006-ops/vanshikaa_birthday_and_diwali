import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from './soundEffects';
import { RotateCcw, Dices, Trophy, Users, Bot, Star } from 'lucide-react';

const PLAYERS = [
  { id: 0, name: 'Vanshikaa 🪔', color: 'pink', bg: 'bg-rose-500', hex: '#f43f5e', border: 'border-rose-300', startTrack: 0 },
  { id: 1, name: 'Amber 🌟', color: 'gold', bg: 'bg-amber-400', hex: '#fbbf24', border: 'border-amber-200', startTrack: 13 },
  { id: 2, name: 'Emerald 💎', color: 'teal', bg: 'bg-emerald-400', hex: '#34d399', border: 'border-emerald-200', startTrack: 26 },
  { id: 3, name: 'Amethyst 🔮', color: 'purple', bg: 'bg-purple-500', hex: '#a855f7', border: 'border-purple-300', startTrack: 39 }
];

// Exact 52 track squares clockwise on a 15x15 grid
const TRACK_52 = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [6, 0]
];

// Safe track indexes where no capture can happen
const SAFE_TRACK_INDEXES = [0, 8, 13, 21, 26, 34, 39, 47];

// 5 home corridor squares for each player towards center
const HOME_PATHS = {
  0: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  1: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  2: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  3: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

export default function Ludo({ initialMode = 'ai' }) {
  const [playerCount, setPlayerCount] = useState(2); // 2 or 4 players
  const [gameMode, setGameMode] = useState(initialMode); // 'ai' or 'pvp'
  // -1: in base, 0..50: common track, 51..55: home corridor, 56: finished center
  const [tokens, setTokens] = useState(() => [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
  ]);

  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [winner, setWinner] = useState(null);
  const [statusText, setStatusText] = useState('Vanshikaa rolls first. Roll a 6 to release a token!');
  const [selectableTokens, setSelectableTokens] = useState([]);

  const activePlayers = playerCount === 2 ? [0, 1] : [0, 1, 2, 3];

  const getAbsoluteTrackIndex = (pIdx, progress) => {
    if (progress < 0 || progress > 50) return null;
    return (PLAYERS[pIdx].startTrack + progress) % 52;
  };

  const getLegalMoves = (pIdx, dice) => {
    const list = [];
    tokens[pIdx].forEach((pos, idx) => {
      if (pos === -1) {
        if (dice === 6) list.push(idx);
      } else if (pos + dice <= 56) {
        list.push(idx);
      }
    });
    return list;
  };

  const rollDice = async () => {
    if (isRolling || hasRolled || winner !== null) return;
    setIsRolling(true);
    sounds.playDiceRoll();

    let roll = 1;
    for (let i = 0; i < 7; i++) {
      roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      await new Promise(r => setTimeout(r, 60));
    }

    const final = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(final);
    setIsRolling(false);
    setHasRolled(true);

    const legal = getLegalMoves(currentTurn, final);
    setSelectableTokens(legal);

    if (legal.length === 0) {
      setStatusText(`${PLAYERS[currentTurn].name} rolled a ${final}. No legal moves available.`);
      await new Promise(r => setTimeout(r, 850));
      nextTurn(final, false);
    } else {
      setStatusText(`${PLAYERS[currentTurn].name} rolled a ${final}. Tap a highlighted token to move.`);
    }
  };

  // AI logic
  useEffect(() => {
    if (winner !== null) return;
    if (gameMode === 'ai' && currentTurn !== 0) {
      if (!hasRolled && !isRolling) {
        const timer = setTimeout(() => rollDice(), 600);
        return () => clearTimeout(timer);
      } else if (hasRolled && selectableTokens.length > 0) {
        const timer = setTimeout(() => {
          // Select token (capturing > releasing on 6 > advancing furthest)
          let pick = selectableTokens[0];
          if (diceRoll === 6 && selectableTokens.some(t => tokens[currentTurn][t] === -1)) {
            pick = selectableTokens.find(t => tokens[currentTurn][t] === -1);
          } else {
            let maxPos = -2;
            for (let t of selectableTokens) {
              if (tokens[currentTurn][t] > maxPos) {
                maxPos = tokens[currentTurn][t];
                pick = t;
              }
            }
          }
          moveToken(pick);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTurn, hasRolled, isRolling, selectableTokens, gameMode, winner]);

  const moveToken = async (tokenIdx) => {
    if (!selectableTokens.includes(tokenIdx) || winner !== null) return;
    sounds.playMove();

    const dice = diceRoll;
    const currentProgress = tokens[currentTurn][tokenIdx];
    const newProgress = currentProgress === -1 ? 0 : currentProgress + dice;
    let captured = false;

    if (newProgress <= 50) {
      const targetAbs = getAbsoluteTrackIndex(currentTurn, newProgress);
      if (!SAFE_TRACK_INDEXES.includes(targetAbs)) {
        setTokens(prev => {
          const next = prev.map(arr => [...arr]);
          activePlayers.forEach(p => {
            if (p !== currentTurn) {
              for (let i = 0; i < 4; i++) {
                if (next[p][i] >= 0 && next[p][i] <= 50) {
                  if (getAbsoluteTrackIndex(p, next[p][i]) === targetAbs) {
                    next[p][i] = -1; // sent back to yard
                    captured = true;
                  }
                }
              }
            }
          });
          next[currentTurn][tokenIdx] = newProgress;
          return next;
        });
      } else {
        setTokens(prev => {
          const next = prev.map(arr => [...arr]);
          next[currentTurn][tokenIdx] = newProgress;
          return next;
        });
      }
    } else {
      setTokens(prev => {
        const next = prev.map(arr => [...arr]);
        next[currentTurn][tokenIdx] = newProgress;
        return next;
      });
    }

    if (captured) {
      sounds.playCapture();
      setStatusText(`⚔️ Capture! ${PLAYERS[currentTurn].name} gets a bonus turn!`);
    } else if (newProgress === 56) {
      sounds.playLadder();
      setStatusText(`🎯 Token arrived safely Home!`);
    }

    setSelectableTokens([]);

    // Check winner
    const copyTokens = [...tokens[currentTurn]];
    copyTokens[tokenIdx] = newProgress;
    if (copyTokens.every(p => p === 56)) {
      setWinner(currentTurn);
      sounds.playWin();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#a855f7']
      });
      setStatusText(`🏆 ${PLAYERS[currentTurn].name} has won the Ludo tournament!`);
      return;
    }

    await new Promise(r => setTimeout(r, 380));
    nextTurn(dice, captured);
  };

  const nextTurn = (dice, captured) => {
    setHasRolled(false);
    setSelectableTokens([]);
    if (dice === 6 || captured) {
      setStatusText(`${PLAYERS[currentTurn].name} earned a bonus roll! 🎲`);
    } else {
      const curIdx = activePlayers.indexOf(currentTurn);
      const nextIdx = (curIdx + 1) % activePlayers.length;
      setCurrentTurn(activePlayers[nextIdx]);
      setStatusText(`Turn: ${PLAYERS[activePlayers[nextIdx]].name}`);
    }
  };

  const resetGame = () => {
    setTokens([
      [-1, -1, -1, -1],
      [-1, -1, -1, -1],
      [-1, -1, -1, -1],
      [-1, -1, -1, -1]
    ]);
    setCurrentTurn(0);
    setDiceRoll(null);
    setHasRolled(false);
    setIsRolling(false);
    setWinner(null);
    setSelectableTokens([]);
    setStatusText('New match! Vanshikaa rolls first.');
  };

  // Build grid map to render tokens on board squares
  const squareTokenMap = {};
  activePlayers.forEach(pIdx => {
    tokens[pIdx].forEach((progress, tIdx) => {
      let key = null;
      if (progress >= 0 && progress <= 50) {
        const abs = getAbsoluteTrackIndex(pIdx, progress);
        const [r, c] = TRACK_52[abs];
        key = `${r},${c}`;
      } else if (progress > 50 && progress < 56) {
        const homeIdx = progress - 51;
        const [r, c] = HOME_PATHS[pIdx][homeIdx];
        key = `${r},${c}`;
      }
      if (key) {
        if (!squareTokenMap[key]) squareTokenMap[key] = [];
        squareTokenMap[key].push({ pIdx, tIdx, canMove: currentTurn === pIdx && selectableTokens.includes(tIdx) });
      }
    });
  });

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto velvet-card rounded-3xl p-4 sm:p-7 relative select-none">
      {/* Header bar */}
      <div className="flex flex-wrap justify-between items-center w-full gap-3 mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
            <span>Royal Ludo</span>
            <span className="text-base text-amber-300">🪔</span>
          </h3>
          <p className="text-[11px] text-purple-200/70 uppercase tracking-widest font-sans">
            Traditional Four-Token Board
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#160626] p-1 rounded-full border border-amber-400/20 text-xs">
            <button
              onClick={() => { setGameMode('ai'); resetGame(); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                gameMode === 'ai' ? 'bg-amber-400 text-purple-950 font-bold' : 'text-purple-300 hover:text-white'
              }`}
            >
              vs AI
            </button>
            <button
              onClick={() => { setGameMode('pvp'); resetGame(); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                gameMode === 'pvp' ? 'bg-rose-500 text-white font-bold' : 'text-purple-300 hover:text-white'
              }`}
            >
              Pass & Play
            </button>
          </div>

          <button
            onClick={() => { setPlayerCount(prev => (prev === 2 ? 4 : 2)); resetGame(); }}
            className="px-2.5 py-1 rounded-full bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/40 text-purple-200 text-xs"
          >
            {playerCount}P
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="w-full bg-[#120422]/90 border border-amber-400/20 rounded-2xl px-4 py-2 text-center text-xs text-amber-200 font-sans tracking-wide mb-4 min-h-[36px] flex items-center justify-center">
        {statusText}
      </div>

      {/* TRUE 15x15 LUDO BOARD */}
      <div className="w-full aspect-square max-w-[420px] bg-[#120320] border-2 border-amber-400/50 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative grid grid-cols-15 grid-rows-15 gap-[1px]"
           style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gridTemplateRows: 'repeat(15, minmax(0, 1fr))' }}>

        {/* 4 Corner Yards */}
        {/* Top-Left Yard: Pink / Vanshikaa */}
        <div className="col-span-6 row-span-6 bg-rose-950/70 border border-rose-400/40 rounded-xl p-2 flex flex-col justify-between">
          <span className="text-[10px] font-sans font-bold text-rose-300 tracking-wider">Vanshikaa 🪔</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg">
            {tokens[0].map((pos, idx) => {
              const inBase = pos === -1;
              const canMove = currentTurn === 0 && selectableTokens.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => moveToken(idx)}
                  disabled={!canMove}
                  className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold ${
                    inBase ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-950/40 text-rose-800'
                  } ${canMove ? 'ring-2 ring-amber-300 animate-bounce scale-110 cursor-pointer' : ''}`}
                >
                  {inBase ? idx + 1 : '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top-Right Yard: Amber / Player 2 */}
        <div className="col-start-10 col-span-6 row-start-1 row-span-6 bg-amber-950/70 border border-amber-400/40 rounded-xl p-2 flex flex-col justify-between">
          <span className="text-[10px] font-sans font-bold text-amber-300 tracking-wider text-right">Amber 🌟</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg">
            {tokens[1].map((pos, idx) => {
              const inBase = pos === -1;
              const canMove = currentTurn === 1 && selectableTokens.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => moveToken(idx)}
                  disabled={!canMove}
                  className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold ${
                    inBase ? 'bg-amber-400 text-purple-950 shadow-md' : 'bg-amber-950/40 text-amber-800'
                  } ${canMove ? 'ring-2 ring-amber-300 animate-bounce scale-110 cursor-pointer' : ''}`}
                >
                  {inBase ? idx + 1 : '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom-Left Yard: Amethyst / Player 4 */}
        <div className="col-start-1 col-span-6 row-start-10 row-span-6 bg-purple-950/70 border border-purple-400/40 rounded-xl p-2 flex flex-col justify-between">
          <span className="text-[10px] font-sans font-bold text-purple-300 tracking-wider">Amethyst 🔮</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg">
            {tokens[3].map((pos, idx) => {
              const inBase = pos === -1;
              const canMove = currentTurn === 3 && selectableTokens.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => moveToken(idx)}
                  disabled={!canMove}
                  className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold ${
                    inBase ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-950/40 text-purple-800'
                  } ${canMove ? 'ring-2 ring-amber-300 animate-bounce scale-110 cursor-pointer' : ''}`}
                >
                  {inBase ? idx + 1 : '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom-Right Yard: Emerald / Player 3 */}
        <div className="col-start-10 col-span-6 row-start-10 row-span-6 bg-emerald-950/70 border border-emerald-400/40 rounded-xl p-2 flex flex-col justify-between">
          <span className="text-[10px] font-sans font-bold text-emerald-300 tracking-wider text-right">Emerald 💎</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg">
            {tokens[2].map((pos, idx) => {
              const inBase = pos === -1;
              const canMove = currentTurn === 2 && selectableTokens.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => moveToken(idx)}
                  disabled={!canMove}
                  className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold ${
                    inBase ? 'bg-emerald-400 text-purple-950 shadow-md' : 'bg-emerald-950/40 text-emerald-800'
                  } ${canMove ? 'ring-2 ring-amber-300 animate-bounce scale-110 cursor-pointer' : ''}`}
                >
                  {inBase ? idx + 1 : '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Triangle Finish Home (3x3 at col 7..9, row 7..9) */}
        <div className="col-start-7 col-span-3 row-start-7 row-span-3 bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 border border-amber-200/60 rounded-lg flex flex-col items-center justify-center shadow-inner z-10">
          <Trophy size={18} className="text-amber-200 animate-pulse" />
          <span className="text-[8px] font-black text-purple-950 tracking-widest uppercase">HOME</span>
        </div>

        {/* Render Track & Home Cells */}
        {TRACK_52.map(([r, c], trackIdx) => {
          const isSafe = SAFE_TRACK_INDEXES.includes(trackIdx);
          const isStartPink = trackIdx === 0;
          const isStartAmber = trackIdx === 13;
          const isStartEmerald = trackIdx === 26;
          const isStartAmethyst = trackIdx === 39;

          const key = `${r},${c}`;
          const tokensOnCell = squareTokenMap[key] || [];

          return (
            <div
              key={trackIdx}
              style={{ gridColumnStart: c + 1, gridRowStart: r + 1 }}
              className={`relative rounded-sm border border-purple-900/40 flex items-center justify-center ${
                isStartPink ? 'bg-rose-500/30 border-rose-400/50' :
                isStartAmber ? 'bg-amber-400/30 border-amber-300/50' :
                isStartEmerald ? 'bg-emerald-400/30 border-emerald-300/50' :
                isStartAmethyst ? 'bg-purple-500/30 border-purple-300/50' :
                isSafe ? 'bg-amber-400/15' : 'bg-[#1e082c]'
              }`}
            >
              {isSafe && <span className="text-[9px] text-amber-300/70 select-none">★</span>}

              {/* Tokens present on this square */}
              {tokensOnCell.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => t.canMove && moveToken(t.tIdx)}
                  disabled={!t.canMove}
                  className={`absolute w-3.5 h-3.5 rounded-full ${PLAYERS[t.pIdx].bg} border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-md z-20 ${
                    t.canMove ? 'ring-2 ring-amber-300 animate-pulse scale-125 cursor-pointer' : ''
                  }`}
                >
                  {t.tIdx + 1}
                </button>
              ))}
            </div>
          );
        })}

        {/* Render Home Corridors */}
        {Object.entries(HOME_PATHS).map(([pStr, path]) => {
          const pIdx = Number(pStr);
          const p = PLAYERS[pIdx];
          return path.map(([r, c], stepIdx) => {
            const key = `${r},${c}`;
            const tokensOnCell = squareTokenMap[key] || [];

            return (
              <div
                key={`${pIdx}-${stepIdx}`}
                style={{ gridColumnStart: c + 1, gridRowStart: r + 1 }}
                className={`relative rounded-sm border border-purple-800/40 flex items-center justify-center ${p.bg} opacity-80`}
              >
                {tokensOnCell.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => t.canMove && moveToken(t.tIdx)}
                    disabled={!t.canMove}
                    className={`absolute w-3.5 h-3.5 rounded-full bg-white text-purple-950 border border-purple-900 flex items-center justify-center text-[8px] font-bold shadow-md z-20 ${
                      t.canMove ? 'ring-2 ring-amber-300 animate-pulse scale-125 cursor-pointer' : ''
                    }`}
                  >
                    {t.tIdx + 1}
                  </button>
                ))}
              </div>
            );
          });
        })}
      </div>

      {/* Bottom Controls: Dice & Turn Indicator */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-[420px] mt-5 gap-3">
        {/* Turn indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${PLAYERS[currentTurn].bg} border border-white flex items-center justify-center text-xs font-bold text-white shadow`}>
            {currentTurn + 1}
          </div>
          <div>
            <div className="text-[10px] text-purple-300/70 font-sans uppercase tracking-wider">Current Turn</div>
            <div className="text-xs font-semibold text-amber-200">
              {PLAYERS[currentTurn].name}
            </div>
          </div>
        </div>

        {/* Dice Roller */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-200 flex items-center justify-center text-2xl font-black text-purple-950 shadow-md ${
              isRolling ? 'rotate-180 animate-spin' : ''
            }`}
          >
            {diceRoll !== null ? diceRoll : '🎲'}
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling || hasRolled || winner !== null || (gameMode === 'ai' && currentTurn !== 0)}
            className={`px-4 py-2.5 rounded-xl font-sans text-xs tracking-wider uppercase font-bold transition-all shadow-md ${
              winner !== null || hasRolled || (gameMode === 'ai' && currentTurn !== 0)
                ? 'bg-purple-950/40 text-purple-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 active:scale-95'
            }`}
          >
            {isRolling ? 'Rolling...' : hasRolled ? 'Select Token' : 'Roll Dice'}
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={resetGame}
          className="p-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900 border border-purple-800/40 text-purple-300 hover:text-white text-xs transition-colors"
          title="Reset Game"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Winner Celebration Modal */}
      {winner !== null && (
        <div className="absolute inset-0 bg-[#0e021a]/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30">
          <Trophy size={48} className="text-amber-400 animate-bounce mb-3" />
          <h4 className="text-2xl font-serif-display font-medium text-amber-200 mb-2">
            Ludo Champion!
          </h4>
          <p className="text-sm text-pink-200 mb-6">
            {PLAYERS[winner].name} has conquered the tournament!
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            Play Again 🎲
          </button>
        </div>
      )}
    </div>
  );
}
