import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { contextClueScore } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

type Phase = 'clues' | 'guess' | 'result';

export default function ContextClueSleuth() {
  const { currentWordSetIndex, addScore, showFeedback, markGamePlayed, recordGameScore, advanceWordSet, rotateArticle } = useGameState();
  const allClues = wordSets[currentWordSetIndex].contextClues;

  const [clueIndex, setClueIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('clues');
  const [selectedClues, setSelectedClues] = useState<Set<string>>(new Set());
  const [guessedWord, setGuessedWord] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);

  const data = allClues[clueIndex % allClues.length];
  const shuffledOptions = useMemo(() => shuffle(data.options), [data.options]);
  const totalRounds = allClues.length;

  const sentenceWords = data.sentence.split(/(\s+|(?=[.,!?;:])|(?<=[.,!?;:]))/).filter(w => w.trim());

  const toggleClue = (word: string) => {
    if (phase !== 'clues') return;
    const clean = word.replace(/[.,!?;:]/g, '').toLowerCase();
    setSelectedClues(prev => {
      const next = new Set(prev);
      if (next.has(clean)) next.delete(clean);
      else next.add(clean);
      return next;
    });
  };

  const handleSolve = () => setPhase('guess');

  const handleGuess = (word: string) => {
    if (phase !== 'guess') return;
    setGuessedWord(word);
    setPhase('result');

    const correct = word.toLowerCase() === data.targetWord.toLowerCase();
    const cluesMatch = data.clueWords.some(c => selectedClues.has(c.toLowerCase()));
    const points = contextClueScore(correct, cluesMatch);
    setSessionScore(prev => prev + points);
    addScore(points, correct);

    if (correct && cluesMatch) {
      showFeedback({ type: 'bonus', points: 500, bonusText: '+100 SLEUTH BONUS!' });
    } else if (correct) {
      showFeedback({ type: 'correct', points: 500 });
    } else {
      showFeedback({ type: 'incorrect' });
    }
  };

  const nextRound = () => {
    if (clueIndex + 1 >= totalRounds) {
      // All rounds done
      markGamePlayed('gameA');
      recordGameScore('gameA', sessionScore);
    }
    setClueIndex(i => i + 1);
    setPhase('clues');
    setSelectedClues(new Set());
    setGuessedWord(null);
  };

  const restart = () => {
    setClueIndex(0);
    setPhase('clues');
    setSelectedClues(new Set());
    setGuessedWord(null);
    setSessionScore(0);
  };

  const isComplete = clueIndex >= totalRounds && phase === 'clues';

  if (isComplete) {
    return (
      <div className="p-5 flex flex-col items-center justify-center gap-4 h-full">
        <div className="text-4xl">🔍</div>
        <p className="text-lg font-semibold text-gray-800">Case Closed!</p>
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
      {/* Round indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase">
          Clue {clueIndex + 1} of {totalRounds}
        </span>
      </div>

      {/* Instructions */}
      {phase === 'clues' && (
        <p className="text-sm text-gray-500">
          Read the sentence below. Click words that help you guess the hidden <strong>[REDACTED]</strong> word, then hit <strong>Solve</strong>.
        </p>
      )}
      {phase === 'guess' && (
        <p className="text-sm text-gray-500">
          Now pick the word that fits in the blank!
        </p>
      )}

      {/* Sentence with clickable words */}
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-base leading-loose">
          {sentenceWords.map((word, i) => {
            if (word === '[REDACTED]') {
              return (
                <span key={i} className="inline-block bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm mx-0.5">
                  {phase === 'result' ? data.targetWord : '???'}
                </span>
              );
            }

            const clean = word.replace(/[.,!?;:]/g, '').toLowerCase();
            const isClue = selectedClues.has(clean);
            const isClickable = phase === 'clues' && clean.length > 2;

            return (
              <span
                key={i}
                onClick={() => isClickable && toggleClue(word)}
                className={`
                  ${isClickable ? 'cursor-pointer hover:bg-yellow-100 rounded px-0.5' : ''}
                  ${isClue ? 'bg-yellow-200 rounded px-0.5 font-semibold' : ''}
                  transition-colors
                `}
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      </div>

      {/* Clue count + solve button */}
      {phase === 'clues' && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {selectedClues.size} clue{selectedClues.size !== 1 ? 's' : ''} selected
            {selectedClues.size > 0 && ' (click to remove)'}
          </span>
          <button
            onClick={handleSolve}
            className="px-5 py-2 rounded-lg bg-newsela-blue text-white text-sm font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
          >
            Solve →
          </button>
        </div>
      )}

      {/* Multiple choice */}
      {phase === 'guess' && (
        <div className="flex flex-col gap-2">
          {shuffledOptions.map(option => (
            <motion.button
              key={option}
              onClick={() => handleGuess(option)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-left text-sm font-medium bg-white hover:border-newsela-blue hover:bg-blue-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className={`text-center text-sm font-medium rounded-lg p-3 ${
            guessedWord?.toLowerCase() === data.targetWord.toLowerCase()
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {guessedWord?.toLowerCase() === data.targetWord.toLowerCase() ? (
              <>
                Correct! The word was <strong>"{data.targetWord}"</strong>.
                {data.clueWords.some(c => selectedClues.has(c.toLowerCase())) && (
                  <span className="block mt-1 text-newsela-gold font-bold">
                    Sleuth Bonus! You identified a key context clue.
                  </span>
                )}
              </>
            ) : (
              <>Not quite. The answer was <strong>"{data.targetWord}"</strong>.</>
            )}
          </div>
          <button
            onClick={nextRound}
            className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
          >
            {clueIndex + 1 < totalRounds ? 'Next Clue →' : 'See Results'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
