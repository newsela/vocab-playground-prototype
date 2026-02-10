import type { ReactNode } from 'react';

interface Props {
  navbar: ReactNode;
  article: ReactNode;
  panel: ReactNode;
}

export default function LyceumShell({ navbar, article, panel }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {navbar}
      <div className="flex-1 grid grid-cols-[1fr_467px]">
        <main className="overflow-y-auto p-8 bg-white">{article}</main>
        <aside className="overflow-y-auto border-l border-gray-200 bg-white sticky top-16 h-[calc(100vh-64px)]">
          {panel}
        </aside>
      </div>
    </div>
  );
}
