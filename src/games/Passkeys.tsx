import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { passkeysScore } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

type CellState = 'empty' | 'placed' | 'correct';

interface Cell {
  letter: string;
  state: CellState;
}

function makeEmptyGrid(words: string[]): Cell[][] {
  return words.map(w =>
    Array.from({ length: w.length }, () => ({ letter: '', state: 'empty' as CellState }))
  );
}

function findNextEmptyInRow(
  row: Cell[],
  afterCol: number,
): number {
  for (let c = afterCol + 1; c < row.length; c++) {
    if (row[c].state === 'empty') return c;
  }
  // Wrap within the row
  for (let c = 0; c <= afterCol; c++) {
    if (row[c].state === 'empty') return c;
  }
  return -1;
}

export default function Passkeys() {
  const {
    currentWordSetIndex, addScore, showFeedback,
    markGamePlayed, recordGameScore, advanceWordSet, rotateArticle,
  } = useGameState();
  const data = wordSets[currentWordSetIndex].passkeys;
  const words = data.words.map(w => w.toUpperCase());

  const [grid, setGrid] = useState<Cell[][]>(() => makeEmptyGrid(words));
  const [bank, setBank] = useState(() => {
    const letters = words.join('').split('');
    return shuffle(letters).map(l => ({ letter: l, used: false }));
  });
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [activeWord, setActiveWord] = useState(0);
  const [triesLeft, setTriesLeft] = useState(3);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([false, false, false]);
  const [wordsFound, setWordsFound] = useState([false, false, false]);
  const [gameOver, setGameOver] = useState(false);

  const hintsUsed = revealedHints.filter(Boolean).length;
  const maxHints = 3;
  const foundCount = wordsFound.filter(Boolean).length;

  // Only check if the active word row is fully filled
  const activeRowFilled = grid[activeWord]?.every(cell => cell.letter !== '') ?? false;

  const selectCell = (row: number, col: number) => {
    if (gameOver || row !== activeWord) return;
    const cell = grid[row][col];
    if (cell.state === 'correct') return;
    if (cell.state === 'placed') {
      removeLetter(row, col);
      return;
    }
    setSelected({ row, col });
  };

  const placeLetter = (bankIdx: number) => {
    if (gameOver) return;

    // Auto-select first empty cell in active row if nothing selected
    let target = selected;
    if (!target || target.row !== activeWord) {
      const col = findNextEmptyInRow(grid[activeWord], -1);
      if (col < 0) return;
      target = { row: activeWord, col };
    }

    const { row, col } = target;
    if (row !== activeWord) return;
    const cell = grid[row][col];
    if (cell.state === 'correct') return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const newBank = bank.map(b => ({ ...b }));

    if (cell.letter && cell.state === 'placed') {
      const oldIdx = newBank.findIndex(b => b.used && b.letter === cell.letter);
      if (oldIdx >= 0) newBank[oldIdx].used = false;
    }

    newGrid[row][col] = { letter: newBank[bankIdx].letter, state: 'placed' };
    newBank[bankIdx].used = true;

    setGrid(newGrid);
    setBank(newBank);

    // Auto-advance within the active row only
    const nextCol = findNextEmptyInRow(newGrid[row], col);
    if (nextCol >= 0) {
      setSelected({ row, col: nextCol });
    } else {
      setSelected(null);
    }
  };

  const removeLetter = (row: number, col: number) => {
    if (gameOver || row !== activeWord) return;
    const cell = grid[row][col];
    if (cell.state !== 'placed') return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const newBank = bank.map(b => ({ ...b }));

    const bIdx = newBank.findIndex(b => b.used && b.letter === cell.letter);
    if (bIdx >= 0) newBank[bIdx].used = false;
    newGrid[row][col] = { letter: '', state: 'empty' };

    setGrid(newGrid);
    setBank(newBank);
    setSelected({ row, col });
  };

  const handleSubmit = () => {
    if (!activeRowFilled || gameOver) return;

    const word = words[activeWord];
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const newBank = bank.map(b => ({ ...b }));
    const guess = newGrid[activeWord].map(c => c.letter).join('');

    if (guess === word) {
      // Correct! Lock the word and advance
      const newWordsFound = [...wordsFound];
      newWordsFound[activeWord] = true;
      newGrid[activeWord] = newGrid[activeWord].map(c => ({ ...c, state: 'correct' as CellState }));

      setGrid(newGrid);
      setBank(newBank);
      setWordsFound(newWordsFound);

      const newFoundCount = newWordsFound.filter(Boolean).length;

      if (newFoundCount === 3) {
        // All words found — win!
        setGameOver(true);
        const points = passkeysScore(3);
        addScore(points, true);
        markGamePlayed('gameE');
        recordGameScore('gameE', points);
        showFeedback({ type: 'correct', points });
      } else {
        // Advance to next word, reset tries
        showFeedback({ type: 'correct', points: 0 });
        const nextWord = activeWord + 1;
        setActiveWord(nextWord);
        setTriesLeft(3);
        // Auto-select first cell of new word
        const col = findNextEmptyInRow(newGrid[nextWord], -1);
        setSelected(col >= 0 ? { row: nextWord, col } : null);
      }
    } else {
      // Wrong — return incorrect letters, keep correct-position ones
      newGrid[activeWord].forEach((cell, colIdx) => {
        if (cell.state === 'correct') return;
        if (cell.letter === word[colIdx]) {
          newGrid[activeWord][colIdx] = { ...cell, state: 'correct' };
        } else {
          if (cell.letter) {
            const bIdx = newBank.findIndex(b => b.used && b.letter === cell.letter);
            if (bIdx >= 0) newBank[bIdx].used = false;
          }
          newGrid[activeWord][colIdx] = { letter: '', state: 'empty' };
        }
      });

      const newTriesLeft = triesLeft - 1;
      setGrid(newGrid);
      setBank(newBank);
      setTriesLeft(newTriesLeft);

      if (newTriesLeft === 0) {
        // Out of tries on this word — game over
        setGameOver(true);
        const points = passkeysScore(foundCount);
        addScore(points, false);
        markGamePlayed('gameE');
        recordGameScore('gameE', points);

        if (foundCount > 0) {
          showFeedback({ type: 'correct', points });
        } else {
          showFeedback({ type: 'incorrect' });
        }
      } else {
        // Auto-select first empty cell in active row
        const col = findNextEmptyInRow(newGrid[activeWord], -1);
        setSelected(col >= 0 ? { row: activeWord, col } : null);
      }
    }
  };

  const revealHint = (wordIdx: number) => {
    if (hintsUsed >= maxHints || gameOver || revealedHints[wordIdx] || wordsFound[wordIdx]) return;
    setRevealedHints(prev => {
      const next = [...prev];
      next[wordIdx] = true;
      return next;
    });
  };

  const restart = () => {
    const letters = data.words.map(w => w.toUpperCase()).join('').split('');
    setGrid(makeEmptyGrid(data.words.map(w => w.toUpperCase())));
    setBank(shuffle(letters).map(l => ({ letter: l, used: false })));
    setSelected(null);
    setActiveWord(0);
    setTriesLeft(3);
    setRevealedHints([false, false, false]);
    setWordsFound([false, false, false]);
    setGameOver(false);
  };

  const cellColor = (cell: Cell, isSelected: boolean, isActive: boolean) => {
    if (cell.state === 'correct') return 'bg-blue-400 text-white border-blue-500';
    if (cell.state === 'placed') return 'bg-yellow-300 text-gray-800 border-yellow-400';
    if (isSelected) return 'bg-white border-newsela-blue ring-2 ring-newsela-blue/50';
    if (!isActive) return 'bg-gray-50 border-gray-200 text-gray-300';
    return 'bg-white border-gray-300';
  };

  if (gameOver) {
    const points = passkeysScore(foundCount);
    return (
      <div className="p-5 flex flex-col gap-4">
        <div className="text-center">
          <div className="text-4xl mb-2">
            {foundCount === 3 ? '🎉' : foundCount > 0 ? '👏' : '😔'}
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {foundCount === 3
              ? 'All Words Found!'
              : foundCount > 0
              ? `${foundCount} of 3 Words Found`
              : 'No Words Found'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Score: <strong>{points}</strong> pts
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {words.map((word, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex gap-1.5">
                {word.split('').map((letter, j) => (
                  <div
                    key={j}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${
                      wordsFound[i]
                        ? 'bg-blue-400 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-400 italic">{data.wordHints[i]}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mt-2"
        >
          <button
            onClick={restart}
            className="flex-1 py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => { advanceWordSet(); rotateArticle(); restart(); }}
            className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Next Word →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase">
          Word {activeWord + 1} of 3 · {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
        </span>
        <span className="text-xs text-gray-400">
          💡 {maxHints - hintsUsed} hint{maxHints - hintsUsed !== 1 ? 's' : ''} left
        </span>
      </div>

      <p className="text-sm text-gray-500">
        <strong>{data.themeHint}</strong> — solve each word in order. Tap <strong>?</strong> for a clue!
      </p>

      {/* Letter Bank — on top */}
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
          Letter Bank
        </label>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {bank.map((tile, i) => (
            <motion.button
              key={i}
              onClick={() => !tile.used && placeLetter(i)}
              disabled={tile.used}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                tile.used
                  ? 'bg-gray-200 text-transparent border border-gray-200 cursor-default'
                  : 'bg-yellow-300 text-gray-800 border border-yellow-400 hover:bg-yellow-400 hover:scale-105 cursor-pointer shadow-sm'
              }`}
              whileTap={!tile.used ? { scale: 0.9 } : undefined}
            >
              {tile.letter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Word Grid — sequential: only active word is interactive */}
      <div className="flex flex-col gap-3">
        {grid.map((row, rowIdx) => {
          const isActive = rowIdx === activeWord;
          const isFound = wordsFound[rowIdx];
          const isFuture = rowIdx > activeWord && !isFound;

          return (
            <div key={rowIdx} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {/* Hint button */}
                <button
                  onClick={() => revealHint(rowIdx)}
                  disabled={revealedHints[rowIdx] || hintsUsed >= maxHints || isFound || isFuture}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isFound
                      ? 'bg-blue-100 text-newsela-blue cursor-default'
                      : revealedHints[rowIdx]
                      ? 'bg-blue-100 text-blue-500 cursor-default'
                      : isFuture || hintsUsed >= maxHints
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                  }`}
                  title={isFound ? 'Found!' : revealedHints[rowIdx] ? 'Hint revealed' : 'Reveal hint'}
                >
                  {isFound ? '✓' : '?'}
                </button>

                {/* Cells */}
                <div className="flex gap-1.5">
                  {row.map((cell, colIdx) => {
                    const isSelected = selected?.row === rowIdx && selected?.col === colIdx;
                    return (
                      <motion.button
                        key={colIdx}
                        onClick={() => selectCell(rowIdx, colIdx)}
                        disabled={!isActive || cell.state === 'correct'}
                        className={`w-11 h-11 rounded-lg border-2 flex items-center justify-center text-base font-bold transition-all ${
                          isActive || isFound ? 'cursor-pointer' : 'cursor-default'
                        } ${cellColor(cell, isSelected, isActive || isFound)}`}
                        whileTap={isActive ? { scale: 0.95 } : undefined}
                      >
                        {cell.letter}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Letter count */}
                <span className={`text-xs shrink-0 ${isActive ? 'text-gray-400' : 'text-gray-300'}`}>
                  {words[rowIdx].length}
                </span>
              </div>

              {/* Active word indicator */}
              {isActive && !isFound && (
                <div className="pl-9">
                  <span className="text-[10px] font-semibold text-newsela-blue uppercase tracking-wider">
                    ▸ Solve this word
                  </span>
                </div>
              )}

              {/* Revealed hint text */}
              <AnimatePresence>
                {revealedHints[rowIdx] && !isFound && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-blue-600 italic pl-9"
                  >
                    {data.wordHints[rowIdx]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!selected && !activeRowFilled && (
        <p className="text-xs text-gray-300 text-center">
          Tap a cell, then tap a letter from the bank to place it.
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!activeRowFilled}
        className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Submit Word {activeWord + 1}
      </button>
    </div>
  );
}
