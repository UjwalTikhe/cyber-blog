import { Terminal, BookOpen, Layers, Wrench, Search, Shield } from 'lucide-react';

interface NavbarProps {
  currentTab: 'logs' | 'timeline' | 'arsenal';
  setCurrentTab: (tab: 'logs' | 'timeline' | 'arsenal') => void;
  onOpenTerminal: () => void;
  onHomeClick: () => void;
}

export const Navbar = ({
  currentTab,
  setCurrentTab,
  onOpenTerminal,
  onHomeClick,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100/80 bg-white/90 backdrop-blur-md">
      {/* Top subtle status indicator */}
      <div className="bg-gradient-to-r from-pink-50/70 via-white to-pink-50/70 border-b border-pink-100/60 px-4 py-1 text-[11px] font-sans text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="font-bold text-rose-700 tracking-wider text-[10px]">AKTE 511</span>
          <span className="text-pink-300">•</span>
          <span className="text-slate-600 text-[10px] tracking-wide">Technical Dossiers &amp; Cybersecurity Research</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-pink-200/80 text-slate-600 hover:text-rose-600 hover:border-pink-300 transition-all text-[10px] font-mono shadow-sm"
            title="Interactive Search Shell (Ctrl+K)"
          >
            <Terminal className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">Shell</span>
            <kbd className="text-[9px] px-1 bg-pink-50 border border-pink-200 rounded text-rose-600">^K</kbd>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200 flex items-center justify-center text-rose-600 group-hover:border-rose-300 transition-all shadow-sm">
            <Shield className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight">
              <span>Akte 511</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.2 bg-rose-50 border border-rose-200/80 rounded text-rose-600 font-bold">
                Archive
              </span>
            </div>
            <div className="text-[10px] font-sans text-slate-500">
              Security Engineering &amp; Case Studies
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              setCurrentTab('logs');
              onHomeClick();
            }}
            className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'logs'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dossiers</span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'timeline'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Index</span>
          </button>

          <button
            onClick={() => setCurrentTab('arsenal')}
            className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'arsenal'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Arsenal</span>
          </button>

          {/* Quick Search Shell Trigger */}
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-pink-50 transition-colors ml-1"
            title="Search dossiers (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
