import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { hotOrNotScore } from '../utils/scoring';

const ROUND_MS = 5000;
const TICK_MS = 50;

export default function HotOrNot() {
  const { currentWordSetIndex, addScore, showFeedback, markGamePlayed, recordGameScore, advanceWordSet, rotateArticle } = useGameState();
  const data = wordSets[currentWordSetIndex].hotOrNot;

  const [roundIndex, setRoundIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(ROUND_MS);
  const [answered, setAnswered] = useState(false);
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = data[roundIndex];
  const isComplete = roundIndex >= data.length;

  useEffect(() => {
    if (answered || isComplete) return;
    setRemainingMs(ROUND_MS);
    timerRef.current = setInterval(() => {
      setRemainingMs(prev => {
        if (prev <= TICK_MS) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - TICK_MS;
      });
    }, TICK_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [roundIndex, answered, isComplete]);

  useEffect(() => {
    if (remainingMs <= 0 && !answered && !isComplete) {
      handleAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs]);

  const handleAnswer = useCallback((userSaysCorrect: boolean | null) => {
    if (answered || isComplete) return;
    setAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isRight = userSaysCorrect === round.isCorrectUsage;
    const points = isRight ? hotOrNotScore(remainingMs, ROUND_MS) : 0;

    setRoundResult(isRight ? 'correct' : 'incorrect');
    setSessionScore(prev => prev + points);
    addScore(points, isRight);

    if (isRight) {
      showFeedback({ type: 'correct', points });
    } else {
      showFeedback({ type: 'incorrect' });
    }
  }, [answered, isComplete, round, remainingMs, addScore, showFeedback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (answered && e.key !== ' ') return;
      if (e.key === 'ArrowLeft') handleAnswer(true);
      if (e.key === 'ArrowRight') handleAnswer(false);
      if (e.key === ' ' && answered && !isComplete) {
        e.preventDefault();
        nextRound();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, handleAnswer, isComplete]);

  const nextRound = () => {
    setRoundIndex(i => i + 1);
    setAnswered(false);
    setRoundResult(null);
  };

  const restart = () => {
    setRoundIndex(0);
    setAnswered(false);
    setRoundResult(null);
    setSessionScore(0);
  };

  // Mark game complete and record score
  useEffect(() => {
    if (isComplete) {
      markGamePlayed('gameB');
      const isNewBest = recordGameScore('gameB', sessionScore);
      if (isNewBest && sessionScore > 0) {
        setTimeout(() => showFeedback({ type: 'new-best', points: sessionScore, gameId: 'gameB' }), 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const pct = (remainingMs / ROUND_MS) * 100;
  const timerColor = pct > 60 ? 'bg-green-500' : pct > 30 ? 'bg-yellow-500' : 'bg-red-500';

  if (isComplete) {
    return (
      <div className="p-5 flex flex-col items-center justify-center gap-4 h-full">
        <div className="text-4xl">🎉</div>
        <p className="text-lg font-semibold text-gray-800">Round Complete!</p>
        <p className="text-sm text-gray-500">Score this round: <strong>{sessionScore}</strong></p>
        <div className="flex gap-2">
          <button
            onClick={restart}
            className="px-4 py-2 bg-newsela-blue text-white rounded-lg text-sm font-medium hover:bg-newsela-blue-dark transition-colors cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={() => { advanceWordSet(); rotateArticle(); restart(); }}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Next Word →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase">
          Round {roundIndex + 1} of {data.length}
        </span>
        <span className="text-xs text-gray-400">
          ← Correct &nbsp;|&nbsp; Incorrect →
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${timerColor} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: TICK_MS / 1000, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={roundIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-50 rounded-xl p-5 text-center"
        >
          <p className="text-base leading-relaxed text-gray-800">
            {round.sentence.split(round.targetWord).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="font-bold text-newsela-blue underline decoration-2 underline-offset-2">
                    {round.targetWord}
                  </span>
                )}
              </span>
            ))}
          </p>
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-medium rounded-lg p-2 ${
            roundResult === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {roundResult === 'correct'
            ? `Correct! That usage ${round.isCorrectUsage ? 'is' : 'is NOT'} right.`
            : `Nope! That usage ${round.isCorrectUsage ? 'IS actually correct' : 'is actually WRONG'}.`}
        </motion.div>
      )}

      {!answered ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(true)}
            className="py-4 rounded-xl bg-green-50 border-2 border-green-200 text-green-700 font-semibold hover:bg-green-100 transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-xl">👍</span>
            <span className="text-sm">Correct Usage</span>
            <span className="text-xs text-green-400">← Left Arrow</span>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 font-semibold hover:bg-red-100 transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-xl">👎</span>
            <span className="text-sm">Broken Usage</span>
            <span className="text-xs text-red-400">Right Arrow →</span>
          </button>
        </div>
      ) : (
        <button
          onClick={nextRound}
          className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
        >
          {roundIndex < data.length - 1 ? 'Next Round →' : 'See Results'}
          <span className="text-xs opacity-70 ml-2">[Space]</span>
        </button>
      )}
    </div>
  );
}
