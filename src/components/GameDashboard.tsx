import { useGameState } from '../state/useGameState';
import type { GameView, GameId } from '../state/useGameState';
import { wordSets } from '../data/wordSets';
import { motion } from 'framer-motion';

const games: { id: GameView; gameId: GameId; label: string; emoji: string; desc: string; color: string }[] = [
  { id: 'gameA', gameId: 'gameA', label: 'Context Clue Sleuth', emoji: '🔍', desc: 'Find the hidden word using context clues', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { id: 'gameB', gameId: 'gameB', label: 'Hot or Not?', emoji: '🔥', desc: 'Is the word used correctly? Beat the clock!', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { id: 'gameC', gameId: 'gameC', label: 'Intensity Meter', emoji: '🌡️', desc: 'Rank words from mild to extreme', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { id: 'gameD', gameId: 'gameD', label: 'Synonym Swap', emoji: '🔄', desc: 'Spot the imposter that doesn\'t belong', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { id: 'gameE', gameId: 'gameE', label: 'Passkeys', emoji: '🔑', desc: 'Unscramble letters to spell hidden vocab words', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
];

export default function GameDashboard() {
  const { setView, currentWordSetIndex, setWordSet, totalScore, resetSession, bestScores, gamesPlayed, allGamesPlayed } = useGameState();

  const allPlayed = allGamesPlayed();

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Word set picker */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Word Set
        </label>
        <select
          value={currentWordSetIndex}
          onChange={e => setWordSet(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-newsela-blue/30"
        >
          {wordSets.map((ws, i) => (
            <option key={ws.id} value={i}>
              {ws.targetWord} — "{ws.articleTitle}"
            </option>
          ))}
        </select>
      </div>

      {/* 2x2 game selector */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Choose a Game
        </label>
        <div className="grid grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-2">
          {games.map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setView(game.id)}
              className={`${game.color} border rounded-xl p-4 text-left transition-all cursor-pointer relative`}
            >
              {gamesPlayed[game.gameId] && (
                <span className="absolute top-2 right-2 text-xs text-green-500">✓</span>
              )}
              <div className="text-2xl mb-2">{game.emoji}</div>
              <div className="text-sm font-semibold text-gray-800">{game.label}</div>
              <div className="text-xs text-gray-500 mt-1">{game.desc}</div>
              {bestScores[game.gameId] > 0 && (
                <div className="text-xs text-newsela-gold font-semibold mt-2">
                  Best: {bestScores[game.gameId].toLocaleString()} pts
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback prompt */}
      {allPlayed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-newsela-gold-light border border-amber-200 rounded-xl p-4 text-center"
        >
          <p className="text-sm font-semibold text-amber-800 mb-2">
            You've tried all 5 games! We'd love your feedback.
          </p>
          <button
            onClick={() => setView('feedback')}
            className="px-4 py-2 bg-newsela-gold text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Share Feedback
          </button>
        </motion.div>
      )}

      {/* Feedback button (always available) */}
      {!allPlayed && (
        <button
          onClick={() => setView('feedback')}
          className="w-full py-3 bg-newsela-blue text-white rounded-xl text-sm font-semibold hover:bg-newsela-blue-dark transition-colors cursor-pointer"
        >
          Share Feedback
        </button>
      )}

      {/* Reset */}
      {totalScore > 0 && (
        <button
          onClick={resetSession}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors self-center cursor-pointer"
        >
          Reset Session
        </button>
      )}
    </div>
  );
}
