import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';

export default function ScoreBar() {
  const { totalScore, streak, bestStreak } = useGameState();

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          Score:{' '}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={totalScore}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-bold text-gray-800 inline-block"
            >
              {totalScore.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          Streak:{' '}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={streak}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="font-bold text-gray-800 inline-block"
            >
              {streak}
            </motion.span>
          </AnimatePresence>
          {streak >= 3 && (
            <span className={streak >= 10 ? 'fire-flicker inline-block' : ''}>
              🔥
            </span>
          )}
        </div>
      </div>
      {bestStreak > 0 && (
        <div className="text-xs text-gray-400">
          Best: {bestStreak}
        </div>
      )}
    </div>
  );
}
