import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from './soundEffects';
import { RotateCcw, Award, Users, Bot, Sparkles, Flame } from 'lucide-react';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe({ initialMode = 'ai', onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X is Player 1 (Vanshikaa / Diya)
  const [gameMode, setGameMode] = useState(initialMode); // 'ai' or 'pvp'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy' or 'medium'
  const [winner, setWinner] = useState(null); // 'X', 'O', 'draw' or null
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('vanshikaa_ttt_scores');
      return saved ? JSON.parse(saved) : { p1: 0, p2: 0, draws: 0 };
    } catch (e) {
      return { p1: 0, p2: 0, draws: 0 };
    }
  });

  // Save scores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vanshikaa_ttt_scores', JSON.stringify(scores));
    } catch (e) {}
  }, [scores]);

  // Check winner
  const checkWinner = (squares) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    if (squares.every(sq => sq !== null)) {
      return { winner: 'draw', line: null };
    }
    return null;
  };

  // AI Turn
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winner, board]);

  const makeAiMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    if (emptyIndices.length === 0) return;

    let moveIndex;

    if (aiDifficulty === 'easy') {
      // Pick random
      moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else {
      // Medium AI:
      // 1. Can AI ('O') win in 1 move?
      for (let idx of emptyIndices) {
        const copy = [...board];
        copy[idx] = 'O';
        const win = checkWinner(copy);
        if (win && win.winner === 'O') {
          moveIndex = idx;
          break;
        }
      }

      // 2. Can Player ('X') win in 1 move? Block them!
      if (moveIndex === undefined) {
        for (let idx of emptyIndices) {
          const copy = [...board];
          copy[idx] = 'X';
          const win = checkWinner(copy);
          if (win && win.winner === 'X') {
            moveIndex = idx;
            break;
          }
        }
      }

      // 3. Take center if available
      if (moveIndex === undefined && board[4] === null) {
        moveIndex = 4;
      }

      // 4. Otherwise take a random corner or available spot
      if (moveIndex === undefined) {
        const corners = [0, 2, 6, 8].filter(c => board[c] === null);
        if (corners.length > 0 && Math.random() > 0.3) {
          moveIndex = corners[Math.floor(Math.random() * corners.length)];
        } else {
          moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
      }
    }

    applyMove(moveIndex, 'O');
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    if (gameMode === 'ai' && !isXNext) return; // Wait for AI

    applyMove(index, isXNext ? 'X' : 'O');
  };

  const applyMove = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    sounds.playMove();

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') {
        sounds.playWin();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#f5b041', '#ffd700', '#c084fc']
        });
        setScores(prev => ({ ...prev, p1: prev.p1 + 1 }));
      } else if (result.winner === 'O') {
        sounds.playCapture();
        setScores(prev => ({ ...prev, p2: prev.p2 + 1 }));
      } else {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsXNext(player !== 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const resetScores = () => {
    const fresh = { p1: 0, p2: 0, draws: 0 };
    setScores(fresh);
    localStorage.setItem('vanshikaa_ttt_scores', JSON.stringify(fresh));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto velvet-card rounded-3xl p-6 sm:p-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-amber-100 flex items-center gap-2">
            <span>Diwali Tic-Tac-Toe</span>
            <span className="text-base text-amber-300">🪔</span>
          </h3>
          <p className="text-[11px] text-purple-200/70 font-sans tracking-wide">
            Vanshikaa (🪔) vs {gameMode === 'ai' ? 'Computer (✨)' : 'Friend (✨)'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#160626] p-1 rounded-full border border-amber-400/20 text-xs">
          <button
            onClick={() => { setGameMode('ai'); resetGame(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              gameMode === 'ai'
                ? 'bg-amber-400 text-purple-950 font-bold shadow-sm'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            vs AI
          </button>
          <button
            onClick={() => { setGameMode('pvp'); resetGame(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              gameMode === 'pvp'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            2 Player
          </button>
        </div>
      </div>

      {/* Difficulty for AI */}
      {gameMode === 'ai' && (
        <div className="flex items-center gap-2 mb-4 bg-purple-950/50 px-3 py-1 rounded-full border border-purple-800/40 text-xs">
          <span className="text-purple-300">Difficulty:</span>
          <button
            onClick={() => setAiDifficulty('easy')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              aiDifficulty === 'easy' ? 'bg-pink-500 text-white' : 'text-purple-300 hover:text-white'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setAiDifficulty('medium')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              aiDifficulty === 'medium' ? 'bg-amber-400 text-purple-950 font-semibold' : 'text-purple-300 hover:text-white'
            }`}
          >
            Medium
          </button>
        </div>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-2 w-full mb-6 text-center">
        <div className="bg-purple-900/40 border border-pink-500/30 rounded-2xl p-2.5">
          <div className="text-[11px] text-pink-300 font-medium">Vanshikaa 🪔</div>
          <div className="text-xl font-bold text-pink-400">{scores.p1}</div>
        </div>
        <div className="bg-purple-900/40 border border-purple-500/30 rounded-2xl p-2.5">
          <div className="text-[11px] text-purple-300 font-medium">Draws 🤝</div>
          <div className="text-xl font-bold text-purple-300">{scores.draws}</div>
        </div>
        <div className="bg-purple-900/40 border border-amber-500/30 rounded-2xl p-2.5">
          <div className="text-[11px] text-amber-300 font-medium">{gameMode === 'ai' ? 'Bot ✨' : 'Friend ✨'}</div>
          <div className="text-xl font-bold text-amber-400">{scores.p2}</div>
        </div>
      </div>

      {/* Turn or Winner Banner */}
      <div className="mb-5 text-sm font-semibold text-center min-h-[28px] flex items-center justify-center">
        {winner === 'X' && (
          <span className="text-pink-300 flex items-center gap-1.5 animate-bounce">
            🎉 Vanshikaa Wins! Happy Birthday Queen! 👑
          </span>
        )}
        {winner === 'O' && (
          <span className="text-amber-300 flex items-center gap-1.5">
            ✨ {gameMode === 'ai' ? 'Computer took this round!' : 'Friend Wins!'} Good game!
          </span>
        )}
        {winner === 'draw' && (
          <span className="text-purple-200">🤝 It's a festive Draw!</span>
        )}
        {!winner && (
          <span className="text-purple-200 flex items-center gap-2">
            Turn:{' '}
            {isXNext ? (
              <span className="text-pink-300 font-bold flex items-center gap-1">
                Vanshikaa's Turn <Flame size={14} className="text-amber-400 fill-amber-400" />
              </span>
            ) : (
              <span className="text-amber-300 font-bold flex items-center gap-1">
                {gameMode === 'ai' ? 'Computer Thinking...' : "Friend's Turn"} <Sparkles size={14} />
              </span>
            )}
          </span>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] aspect-square p-2 bg-purple-950/70 border border-amber-300/20 rounded-3xl shadow-inner relative">
        {board.map((cell, index) => {
          const isWinningCell = winningLine && winningLine.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={cell !== null || (gameMode === 'ai' && !isXNext) || winner !== null}
              className={`relative rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all duration-200 select-none shadow-md ${
                isWinningCell
                  ? 'bg-gradient-to-br from-amber-400/40 to-pink-500/40 border-2 border-amber-300 scale-105'
                  : 'bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/40 active:scale-95'
              }`}
            >
              {cell === 'X' && (
                <span className="transform animate-scale drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
                  🪔
                </span>
              )}
              {cell === 'O' && (
                <span className="transform animate-scale drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
                  ✨
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6 w-full justify-center">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold text-sm shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
        >
          <RotateCcw size={16} /> Play Again
        </button>
        <button
          onClick={resetScores}
          className="px-4 py-2.5 rounded-2xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-300 hover:text-white border border-purple-700/40 text-xs font-medium transition-all"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}

