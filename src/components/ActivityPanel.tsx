import { useGameState } from '../state/useGameState';
import PanelHeader from './PanelHeader';
import ScoreBar from './ScoreBar';
import GameDashboard from './GameDashboard';
import FeedbackOverlay from './FeedbackOverlay';
import FeedbackSurvey from './FeedbackSurvey';
import ContextClueSleuth from '../games/ContextClueSleuth';
import HotOrNot from '../games/HotOrNot';
import IntensityMeter from '../games/IntensityMeter';
import SynonymSwap from '../games/SynonymSwap';
import Passkeys from '../games/Passkeys';

const viewTitles: Record<string, string> = {
  dashboard: 'Vocabulary Playground',
  gameA: 'Context Clue Sleuth',
  gameB: 'Hot or Not?',
  gameC: 'Intensity Meter',
  gameD: 'Synonym Swap',
  gameE: 'Passkeys',
  feedback: 'Share Your Feedback',
};

export default function ActivityPanel() {
  const { currentView } = useGameState();

  return (
    <div className="flex flex-col h-full relative">
      <PanelHeader
        title={viewTitles[currentView]}
        showBack={currentView !== 'dashboard'}
      />
      {currentView !== 'feedback' && <ScoreBar />}
      <FeedbackOverlay />
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <GameDashboard />}
        {currentView === 'gameA' && <ContextClueSleuth />}
        {currentView === 'gameB' && <HotOrNot />}
        {currentView === 'gameC' && <IntensityMeter />}
        {currentView === 'gameD' && <SynonymSwap />}
        {currentView === 'gameE' && <Passkeys />}
        {currentView === 'feedback' && <FeedbackSurvey />}
      </div>
    </div>
  );
}
