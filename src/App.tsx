import { useState, useCallback } from 'react';
import { GameStateContext } from './state/useGameState';
import type { GameView, FeedbackEvent, BestScores, GamesPlayed, GameId } from './state/useGameState';
import { wordSets } from './data/wordSets';
import LyceumShell from './layouts/LyceumShell';
import Navbar from './components/Navbar';
import MockArticle from './components/MockArticle';
import ActivityPanel from './components/ActivityPanel';

const EMPTY_BEST: BestScores = { gameA: 0, gameB: 0, gameC: 0, gameD: 0, gameE: 0 };
const EMPTY_PLAYED: GamesPlayed = { gameA: false, gameB: false, gameC: false, gameD: false, gameE: false };

export default function App() {
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentWordSetIndex, setCurrentWordSetIndex] = useState(0);
  const [currentView, setCurrentView] = useState<GameView>('dashboard');
  const [feedback, setFeedback] = useState<FeedbackEvent | null>(null);
  const [bestScores, setBestScores] = useState<BestScores>({ ...EMPTY_BEST });
  const [gamesPlayed, setGamesPlayed] = useState<GamesPlayed>({ ...EMPTY_PLAYED });
  const [articleExcerptIndex, setArticleExcerptIndex] = useState(0);

  const addScore = useCallback((points: number, correct: boolean) => {
    if (correct) {
      setTotalScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(best => Math.max(best, newStreak));
        if ([5, 10, 15].includes(newStreak)) {
          setTimeout(() => {
            setFeedback({ type: 'streak-milestone', streakCount: newStreak, milestoneLevel: newStreak });
          }, 1600);
        }
        return newStreak;
      });
    } else {
      setStreak(prev => {
        if (prev >= 3) {
          setTimeout(() => {
            setFeedback({ type: 'streak-broken', streakCount: prev });
          }, 1600);
        }
        return 0;
      });
    }
  }, []);

  const recordGameScore = useCallback((gameId: GameId, score: number): boolean => {
    let isNewBest = false;
    setBestScores(prev => {
      if (score > prev[gameId]) {
        isNewBest = true;
        return { ...prev, [gameId]: score };
      }
      return prev;
    });
    return isNewBest;
  }, []);

  const markGamePlayed = useCallback((gameId: GameId) => {
    setGamesPlayed(prev => ({ ...prev, [gameId]: true }));
  }, []);

  const setWordSet = useCallback((index: number) => {
    setCurrentWordSetIndex(index);
    setArticleExcerptIndex(0);
  }, []);

  const advanceWordSet = useCallback(() => {
    setCurrentWordSetIndex(prev => (prev + 1) % wordSets.length);
    setArticleExcerptIndex(0);
  }, []);

  const rotateArticle = useCallback(() => {
    setArticleExcerptIndex(prev => prev + 1);
  }, []);

  const setView = useCallback((view: GameView) => {
    setCurrentView(view);
  }, []);

  const showFeedback = useCallback((event: FeedbackEvent) => {
    setFeedback(event);
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const resetSession = useCallback(() => {
    setTotalScore(0);
    setStreak(0);
    setBestStreak(0);
    setCurrentView('dashboard');
    setFeedback(null);
    setBestScores({ ...EMPTY_BEST });
    setGamesPlayed({ ...EMPTY_PLAYED });
    setArticleExcerptIndex(0);
  }, []);

  const allGamesPlayed = useCallback(() => {
    return gamesPlayed.gameA && gamesPlayed.gameB && gamesPlayed.gameC && gamesPlayed.gameD && gamesPlayed.gameE;
  }, [gamesPlayed]);

  const showGlow = streak === 5 || streak === 10;

  return (
    <GameStateContext.Provider
      value={{
        totalScore,
        streak,
        bestStreak,
        currentWordSetIndex,
        currentView,
        feedback,
        bestScores,
        gamesPlayed,
        articleExcerptIndex,
        addScore,
        recordGameScore,
        markGamePlayed,
        setWordSet,
        advanceWordSet,
        rotateArticle,
        setView,
        showFeedback,
        clearFeedback,
        resetSession,
        allGamesPlayed,
      }}
    >
      <div className={showGlow ? 'streak-glow' : ''}>
        <LyceumShell
          navbar={<Navbar />}
          article={<MockArticle />}
          panel={<ActivityPanel />}
        />
      </div>
    </GameStateContext.Provider>
  );
}
