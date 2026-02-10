import { wordSets } from '../data/wordSets';
import { useGameState } from '../state/useGameState';

export default function MockArticle() {
  const { currentWordSetIndex, articleExcerptIndex } = useGameState();
  const ws = wordSets[currentWordSetIndex];
  const excerpt = ws.articleExcerpts[articleExcerptIndex % ws.articleExcerpts.length];

  // Split article on **word** to highlight the target word
  const parts = excerpt.split(/\*\*(.+?)\*\*/);

  return (
    <article className="max-w-2xl">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-newsela-blue">
          Science &middot; Grade 5
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{ws.articleTitle}</h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
          <span>Newsela Staff</span>
          <span>&middot;</span>
          <span>760L</span>
        </div>
      </div>
      <div className="prose prose-gray text-base leading-relaxed">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <mark
              key={i}
              className="bg-yellow-100 text-gray-900 px-1 rounded font-semibold not-italic"
            >
              {part}
            </mark>
          ) : (
            <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
          )
        )}
      </div>
    </article>
  );
}
