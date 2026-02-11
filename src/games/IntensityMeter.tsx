import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { intensityScore } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

export default function IntensityMeter() {
  const { currentWordSetIndex, addScore, showFeedback, markGamePlayed, recordGameScore, advanceWordSet, rotateArticle } = useGameState();
  const data = wordSets[currentWordSetIndex].intensity;

  // slots[0] = top (strongest), slots[3] = bottom (weakest)
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [answered, setAnswered] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const dragRef = useRef<{ word: string; fromSlot?: number } | null>(null);

  const shuffledBank = useMemo(() => shuffle(data.words), [data.words]);
  const placedWords = slots.filter((s): s is string => s !== null);
  const bankWords = shuffledBank.filter(w => !placedWords.includes(w));
  const allPlaced = placedWords.length === 4;

  const placeWordInSlot = (word: string, targetSlot: number, fromSlot?: number) => {
    setSlots(prev => {
      const next = [...prev];
      const displaced = next[targetSlot];

      // Clear the source slot if dragging from another slot
      if (fromSlot !== undefined) {
        next[fromSlot] = displaced; // swap
      }

      next[targetSlot] = word;
      return next;
    });
  };

  const placeWordNextEmpty = (word: string) => {
    if (answered) return;
    setSlots(prev => {
      const emptyIndex = prev.indexOf(null);
      if (emptyIndex === -1) return prev;
      const next = [...prev];
      next[emptyIndex] = word;
      return next;
    });
  };

  const removeWord = (slotIndex: number) => {
    if (answered) return;
    setSlots(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  // Convert display order (high→low) to data order (low→high) for scoring
  const toDataOrder = (displaySlots: (string | null)[]) =>
    [...displaySlots].reverse().filter((s): s is string => s !== null);

  const handleSubmit = () => {
    if (!allPlaced || answered) return;
    setAnswered(true);

    const points = intensityScore(toDataOrder(slots), data.words);
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
    setSlots([null, null, null, null]);
    setAnswered(false);
    setDragOverSlot(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, word: string, fromSlot?: number) => {
    dragRef.current = { word, fromSlot };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlot: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!dragRef.current || answered) return;
    placeWordInSlot(dragRef.current.word, targetSlot, dragRef.current.fromSlot);
    dragRef.current = null;
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setDragOverSlot(null);
  };

  // Slot gradient colors in display order (index 0 = top/hot, index 3 = bottom/cool)
  const slotColors = [
    'from-orange-100 to-red-100 border-red-200',
    'from-yellow-50 to-orange-50 border-orange-200',
    'from-cyan-50 to-yellow-50 border-yellow-200',
    'from-blue-100 to-blue-50 border-blue-200',
  ];

  const slotHighlight = [
    'ring-red-300',
    'ring-orange-300',
    'ring-yellow-300',
    'ring-blue-300',
  ];

  // Check correctness per display slot when answered
  const slotCorrectness = answered
    ? slots.map((word, i) => word === data.words[3 - i])
    : [];

  const score = answered ? intensityScore(toDataOrder(slots), data.words) : 0;

  if (answered) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Results for <strong>{data.concept}</strong>
        </p>

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
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-14 rounded-lg border-2 bg-gradient-to-r ${slotColors[i]} flex items-center justify-center relative`}
              >
                <span className="text-sm font-semibold text-gray-800">
                  {slots[i]}
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
        Rank these words by <strong>{data.concept.toLowerCase()}</strong> — drag words onto the thermometer, strongest at top.
      </p>

      {/* Thermometer */}
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

        {/* Drop-target slots */}
        <div className="flex-1 flex flex-col gap-2">
          {[0, 1, 2, 3].map(i => {
            const word = slots[i];
            const isOver = dragOverSlot === i;
            return (
              <div
                key={i}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
                className={`h-14 rounded-lg border-2 bg-gradient-to-r ${slotColors[i]} flex items-center justify-center relative transition-all ${
                  isOver ? `ring-2 ${slotHighlight[i]} scale-[1.02]` : ''
                }`}
              >
                <AnimatePresence mode="wait">
                  {word ? (
                    <motion.span
                      key={word}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, word, i)}
                      onDragEnd={handleDragEnd}
                      className="text-sm font-semibold text-gray-800 flex items-center gap-2 cursor-grab active:cursor-grabbing select-none"
                    >
                      <span className="text-gray-300 text-xs">⋮⋮</span>
                      {word}
                      <button
                        onClick={() => removeWord(i)}
                        className="text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </motion.span>
                  ) : (
                    <span className={`text-xs ${isOver ? 'text-gray-500 font-medium' : 'text-gray-300'}`}>
                      {isOver ? 'Drop here' : `${4 - i}`}
                    </span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
              <motion.div
                key={word}
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, word)}
                onDragEnd={handleDragEnd}
                onClick={() => placeWordNextEmpty(word)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-newsela-blue hover:bg-blue-50 transition-all cursor-grab active:cursor-grabbing select-none"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {word}
              </motion.div>
            ))}
          </div>
        </div>
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
