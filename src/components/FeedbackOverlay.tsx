import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { useEffect } from 'react';

export default function FeedbackOverlay() {
  const { feedback, clearFeedback } = useGameState();

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(clearFeedback, 1500);
      return () => clearTimeout(timer);
    }
  }, [feedback, clearFeedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          {/* Background flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${
              feedback.type === 'incorrect' || feedback.type === 'streak-broken'
                ? 'bg-red-500'
                : feedback.type === 'new-best'
                ? 'bg-yellow-400'
                : 'bg-green-500'
            }`}
          />

          <div className="relative flex flex-col items-center gap-2">
            {/* Icon */}
            {(feedback.type === 'correct' || feedback.type === 'bonus') && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}

            {feedback.type === 'incorrect' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </motion.div>
            )}

            {feedback.type === 'streak-broken' && (
              <motion.div
                initial={{ scale: 1.5 }}
                animate={{ scale: 1, x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl"
              >
                💔
              </motion.div>
            )}

            {feedback.type === 'streak-milestone' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl"
              >
                {feedback.milestoneLevel! >= 15 ? '🎆' : feedback.milestoneLevel! >= 10 ? '🔥' : '⭐'}
              </motion.div>
            )}

            {feedback.type === 'new-best' && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: [0, 1.2, 1], rotate: [-10, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl"
              >
                🏆
              </motion.div>
            )}

            {/* Points */}
            {feedback.points != null && feedback.points > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-green-600"
              >
                +{feedback.points}
              </motion.div>
            )}

            {/* Bonus text */}
            {feedback.bonusText && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-bold text-newsela-gold"
              >
                {feedback.bonusText}
              </motion.div>
            )}

            {/* Streak milestone text */}
            {feedback.type === 'streak-milestone' && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold text-newsela-gold"
              >
                {feedback.streakCount} streak!
              </motion.div>
            )}

            {/* New best text */}
            {feedback.type === 'new-best' && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold text-newsela-gold"
              >
                NEW PERSONAL BEST!
              </motion.div>
            )}

            {/* Streak broken text */}
            {feedback.type === 'streak-broken' && feedback.streakCount != null && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-sm text-red-400 font-semibold"
              >
                {feedback.streakCount} streak lost
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
