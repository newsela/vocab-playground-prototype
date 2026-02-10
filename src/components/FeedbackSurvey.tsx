import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../state/useGameState';

const gameLabels = [
  { id: 'gameA' as const, label: 'Context Clue Sleuth', emoji: '🔍' },
  { id: 'gameB' as const, label: 'Hot or Not?', emoji: '🔥' },
  { id: 'gameC' as const, label: 'Intensity Meter', emoji: '🌡️' },
  { id: 'gameD' as const, label: 'Synonym Swap', emoji: '🔄' },
  { id: 'gameE' as const, label: 'Passkeys', emoji: '🔑' },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="text-xl cursor-pointer transition-transform hover:scale-110"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= (hover || value) ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function FeedbackSurvey() {
  const { setView } = useGameState();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favorite, setFavorite] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const payload = { ratings, favorite, comments, timestamp: new Date().toISOString() };
    console.log('=== FEEDBACK SUBMITTED ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('========================');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-5 flex flex-col items-center justify-center gap-4 h-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl"
        >
          🎉
        </motion.div>
        <p className="text-lg font-semibold text-gray-800">Thanks for your feedback!</p>
        <p className="text-sm text-gray-500 text-center">
          Your ratings and comments have been logged to the console.
        </p>
        <button
          onClick={() => setView('dashboard')}
          className="px-5 py-2 bg-newsela-blue text-white rounded-lg text-sm font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto">
      <div>
        <h3 className="text-base font-semibold text-gray-800">How did you like each game?</h3>
        <p className="text-xs text-gray-400 mt-1">Rate each concept from 1-5 stars</p>
      </div>

      {/* Star ratings per game */}
      <div className="flex flex-col gap-4">
        {gameLabels.map(game => (
          <div key={game.id} className="flex items-center gap-3">
            <span className="text-lg w-6">{game.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{game.label}</div>
              <StarRating
                value={ratings[game.id] || 0}
                onChange={v => setRatings(prev => ({ ...prev, [game.id]: v }))}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Favorite picker */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Which was your favorite?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {gameLabels.map(game => (
            <button
              key={game.id}
              onClick={() => setFavorite(game.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                favorite === game.id
                  ? 'border-newsela-blue bg-blue-50 text-newsela-blue'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {game.emoji} {game.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open-ended feedback */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Any other thoughts?
        </label>
        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="What worked well? What felt confusing? What would make you want to play again?"
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-newsela-blue/30"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-newsela-blue text-white font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
      >
        Submit Feedback
      </button>
    </div>
  );
}
