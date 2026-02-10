import { useGameState } from '../state/useGameState';

interface Props {
  title: string;
  showBack?: boolean;
}

export default function PanelHeader({ title, showBack = false }: Props) {
  const { setView } = useGameState();

  return (
    <div className="h-[72px] flex items-center px-5 border-b border-gray-200 shrink-0">
      {showBack && (
        <button
          onClick={() => setView('dashboard')}
          className="mr-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Back to dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
  );
}
