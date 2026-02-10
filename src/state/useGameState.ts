import { createContext, useContext } from 'react';

export type GameView = 'dashboard' | 'gameA' | 'gameB' | 'gameC' | 'gameD' | 'gameE' | 'feedback';

export type GameId = 'gameA' | 'gameB' | 'gameC' | 'gameD' | 'gameE';

export interface FeedbackEvent {
  type: 'correct' | 'incorrect' | 'bonus' | 'streak-milestone' | 'streak-broken' | 'new-best';
  points?: number;
  bonusText?: string;
  streakCount?: number;
  milestoneLevel?: number;
  gameId?: GameId;
}

export interface BestScores {
  gameA: number;
  gameB: number;
  gameC: number;
  gameD: number;
  gameE: number;
}

export interface GamesPlayed {
  gameA: boolean;
  gameB: boolean;
  gameC: boolean;
  gameD: boolean;
  gameE: boolean;
}

export interface GameState {
  totalScore: number;
  streak: number;
  bestStreak: number;
  currentWordSetIndex: number;
  currentView: GameView;
  feedback: FeedbackEvent | null;
  bestScores: BestScores;
  gamesPlayed: GamesPlayed;
  articleExcerptIndex: number;
  addScore: (points: number, correct: boolean) => void;
  recordGameScore: (gameId: GameId, score: number) => boolean; // returns true if new best
  markGamePlayed: (gameId: GameId) => void;
  setWordSet: (index: number) => void;
  advanceWordSet: () => void;
  rotateArticle: () => void;
  setView: (view: GameView) => void;
  showFeedback: (event: FeedbackEvent) => void;
  clearFeedback: () => void;
  resetSession: () => void;
  allGamesPlayed: () => boolean;
}

export const GameStateContext = createContext<GameState | null>(null);

export function useGameState(): GameState {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
}
