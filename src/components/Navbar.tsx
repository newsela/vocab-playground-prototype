export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-newsela-blue flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="text-xl font-semibold tracking-tight text-gray-800">
          newsela
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
          PROTOTYPE
        </span>
      </div>
    </header>
  );
}
