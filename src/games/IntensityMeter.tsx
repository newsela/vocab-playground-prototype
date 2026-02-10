import { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { intensityScore } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

export default function IntensityMeter() {
  const { currentWordSetIndex, addScore, showFeedback, markGamePlayed, recordGameScore, advanceWordSet, rotateArticle } = useGameState();
  const data = wordSets[currentWordSetIndex].intensity;

  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);

  const shuffledBank = useMemo(() => shuffle(data.words), [data.words]);
  const bankWords = shuffledBank.filter(w => !placedWords.includes(w));
  const allPlaced = placedWords.length === 4;

  const placeWord = (word: string) => {
    if (answered || allPlaced) return;
    setPlacedWords(prev => [...prev, word]);
  };

  const removeWord = (word: string) => {
    if (answered) return;
    setPlacedWords(prev => prev.filter(w => w !== word));
  };

  const handleSubmit = () => {
    if (!allPlaced || answered) return;
    setAnswered(true);

    const points = intensityScore(placedWords, data.words);
    const perfect = points === 400;
    addScore(points, perfect);
    markGamePlayed('gameC');
    recordGameScore('gameC', points);

    if (perfect) {
      showFeedback({ type: 'correct', points });
    } else if (points > 0) {
      showFeedback({ type: 'correct', points });
    } else {
      showFeedback({ type: 'incorrect' });
    }
  };

  const restart = () => {
    setPlacedWords([]);
    setAnswered(false);
  };

  // Slot gradient colors (index 0 = bottom/cool, index 3 = top/hot)
  const slotColors = [
    'from-blue-100 to-blue-50 border-blue-200',
    'from-cyan-50 to-yellow-50 border-yellow-200',
    'from-yellow-50 to-orange-50 border-orange-200',
    'from-orange-100 to-red-100 border-red-200',
  ];

  // Check correctness per slot when answered
  const slotCorrectness = answered
    ? placedWords.map((word, i) => word === data.words[i])
    : [];

  const score = answered ? intensityScore(placedWords, data.words) : 0;

  if (answered) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Results for <strong>{data.concept}</strong>
        </p>

        {/* Thermometer with results (top to bottom = high to low) */}
        <div className="flex items-stretch gap-3">
          <div className="flex flex-col justify-between py-2 text-right w-20 shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs font-semibold text-red-500">High</span>
              <span className="text-sm">🔥</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs font-semibold text-blue-500">Low</span>
              <span className="text-sm">❄️</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {[3, 2, 1, 0].map(i => (
              <div
                key={i}
                className={`h-14 rounded-lg border-2 bg-gradient-to-r ${slotColors[i]} flex items-center justify-center relative`}
              >
                <span className="text-sm font-semibold text-gray-800">
                  {placedWords[i]}
                </span>
                <span className="absolute right-3 text-sm">
                  {slotCorrectness[i] ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className={`text-center text-sm font-medium rounded-lg p-3 ${
            score === 400
              ? 'bg-green-50 text-green-700'
              : score > 0
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {score === 400 ? (
              'Perfect order! You nailed it.'
            ) : (
              <>
                The correct order (low → high): <strong>{data.words.join(' → ')}</strong>
              </>
            )}
          </div>
          <div className="flex gap-2">
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
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Rank these words by <strong>{data.concept.toLowerCase()}</strong> — weakest at the bottom, strongest at the top.
        {!allPlaced ? ' Click a word to place it.' : ' Drag to reorder, then submit.'}
      </p>

      {/* Thermometer */}
      <div className="flex items-stretch gap-3">
        {/* Left labels */}
        <div className="flex flex-col justify-between py-2 text-right w-20 shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-xs font-semibold text-red-500">High</span>
            <span className="text-sm">🔥</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span className="text-xs font-semibold text-blue-500">Low</span>
            <span className="text-sm">❄️</span>
          </div>
        </div>

        {/* Slots */}
        <div className="flex-1 flex flex-col gap-2">
          {allPlaced ? (
            /* Drag-to-reorder mode: display top (index 3) to bottom (index 0) */
            <Reorder.Group
              axis="y"
              values={[...placedWords].reverse()}
              onReorder={(newReversed) => setPlacedWords([...newReversed].reverse())}
              className="flex flex-col gap-2"
            >
              {[...placedWords].reverse().map((word, visualIdx) => {
                const slotIdx = 3 - visualIdx; // visual top = slot 3
                return (
                  <Reorder.Item
                    key={word}
                    value={word}
                    className={`h-14 rounded-lg border-2 bg-gradient-to-r ${slotColors[slotIdx]} flex items-center justify-center cursor-grab active:cursor-grabbing relative select-none`}
                    whileDrag={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  >
                    <span className="text-sm font-semibold text-gray-800">{word}</span>
                    <span className="absolute right-3 text-gray-400 text-xs">⋮⋮</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeWord(word); }}
                      className="absolute left-3 text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                      aria-label={`Remove ${word}`}
                    >
                      ✕
                    </button>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          ) : (
            /* Click-to-place mode: show slots top to bottom (3, 2, 1, 0) */
            [3, 2, 1, 0].map(i => {
              const word = placedWords[i];
              return (
                <div
                  key={i}
                  className={`h-14 rounded-lg border-2 bg-gradient-to-r ${slotColors[i]} flex items-center justify-center relative transition-all`}
                >
                  <AnimatePresence mode="wait">
                    {word ? (
                      <motion.span
                        key={word}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-sm font-semibold text-gray-800 flex items-center gap-1"
                      >
                        {word}
                        <button
                          onClick={() => removeWord(word)}
                          className="text-gray-400 hover:text-red-500 text-xs cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </motion.span>
                    ) : (
                      <span className="text-xs text-gray-300">{i + 1}</span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Word bank */}
      {bankWords.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
            Word Bank
          </label>
          <div className="flex flex-wrap gap-2">
            {bankWords.map(word => (
              <motion.button
                key={word}
                onClick={() => placeWord(word)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-newsela-blue hover:bg-blue-50 transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {allPlaced && (
        <p className="text-xs text-gray-400 text-center">
          Drag words to reorder, or click ✕ to remove. Hit submit when ready.
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!allPlaced}
        className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Check Order
      </button>
    </div>
  );
}
