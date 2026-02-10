import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { synonymSwapScore } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

export default function SynonymSwap() {
  const { currentWordSetIndex, addScore, showFeedback, markGamePlayed, recordGameScore, advanceWordSet, rotateArticle } = useGameState();
  const allSwaps = wordSets[currentWordSetIndex].synonymSwaps;

  const [swapIndex, setSwapIndex] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  const data = allSwaps[swapIndex % allSwaps.length];
  const totalRounds = allSwaps.length;
  const shuffledOptions = useMemo(() => shuffle(data.options), [data.options]);

  const displayWord = hoveredOption || data.targetWord;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);

    const correct = option === data.imposter;
    const points = synonymSwapScore(correct);
    setSessionScore(prev => prev + points);
    addScore(points, correct);

    if (correct) {
      showFeedback({ type: 'correct', points });
    } else {
      showFeedback({ type: 'incorrect' });
    }
  };

  const nextRound = () => {
    if (swapIndex + 1 >= totalRounds) {
      markGamePlayed('gameD');
      recordGameScore('gameD', sessionScore);
    }
    setSwapIndex(i => i + 1);
    setHoveredOption(null);
    setSelectedOption(null);
    setAnswered(false);
  };

  const restart = () => {
    setSwapIndex(0);
    setHoveredOption(null);
    setSelectedOption(null);
    setAnswered(false);
    setSessionScore(0);
  };

  const isComplete = swapIndex >= totalRounds;

  // Split sentence on **word** for highlighting
  const parts = data.sentence.split(/\*\*(.+?)\*\*/);

  if (isComplete) {
    return (
      <div className="p-5 flex flex-col items-center justify-center gap-4 h-full">
        <div className="text-4xl">🔄</div>
        <p className="text-lg font-semibold text-gray-800">All Swaps Done!</p>
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
    <div className="p-5 flex flex-col gap-5">
      {/* Round indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase">
          Round {swapIndex + 1} of {totalRounds}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Hover over each option to preview it in the sentence. Click the <strong>imposter</strong> — the one that <em>doesn't</em> fit.
      </p>

      {/* Sentence with live swap */}
      <div className="bg-gray-50 rounded-xl p-5 text-center">
        <p className="text-base leading-relaxed text-gray-800">
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              <AnimatePresence mode="wait" key={i}>
                <motion.span
                  key={displayWord}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className={`font-bold inline-block px-1 rounded ${
                    hoveredOption
                      ? 'text-newsela-purple bg-purple-50'
                      : 'text-newsela-blue'
                  }`}
                >
                  {displayWord}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {shuffledOptions.map(option => {
          let style = 'bg-white border-gray-200 hover:border-newsela-purple hover:bg-purple-50';
          if (answered) {
            if (option === data.imposter) {
              style = option === selectedOption
                ? 'bg-green-50 border-green-400 ring-2 ring-green-300'
                : 'bg-green-50 border-green-300';
            } else if (option === selectedOption) {
              style = 'bg-red-50 border-red-400 ring-2 ring-red-300';
            } else {
              style = 'bg-gray-50 border-gray-200 opacity-60';
            }
          }

          return (
            <motion.button
              key={option}
              onMouseEnter={() => !answered && setHoveredOption(option)}
              onMouseLeave={() => !answered && setHoveredOption(null)}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full border rounded-lg px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer disabled:cursor-default ${style}`}
              whileHover={!answered ? { scale: 1.01 } : undefined}
              whileTap={!answered ? { scale: 0.99 } : undefined}
            >
              <span className="text-gray-700">{option}</span>
              {answered && option === data.imposter && (
                <span className="ml-2 text-green-600 text-xs font-semibold">← Imposter!</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className={`text-center text-sm font-medium rounded-lg p-2 ${
            selectedOption === data.imposter ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {selectedOption === data.imposter
              ? `Nice! "${data.imposter}" doesn't fit as a synonym for "${data.targetWord}".`
              : `Not quite. "${data.imposter}" was the imposter — it doesn't mean "${data.targetWord}".`}
          </div>
          <button
            onClick={nextRound}
            className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
          >
            {swapIndex + 1 < totalRounds ? 'Next Round →' : 'See Results'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
