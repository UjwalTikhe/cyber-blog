import { Terminal, Compass, Wrench, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'logs' | 'timeline' | 'arsenal';
  setCurrentTab: (tab: 'logs' | 'timeline' | 'arsenal') => void;
  onOpenCompose: () => void;
  onOpenTerminal: () => void;
  onHomeClick: () => void;
}

export const Navbar = ({
  currentTab,
  setCurrentTab,
  onOpenCompose,
  onOpenTerminal,
  onHomeClick,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100 bg-white/85 backdrop-blur-md shadow-sm">
      {/* Top cute micro-bar */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border-b border-pink-100 px-4 py-1 text-[11px] font-sans text-pink-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
          <span className="font-bold flex items-center gap-1">
            <span>✨</span>
            <span>SYSTEM ACTIVE: NYAA~</span>
          </span>
          <span className="text-pink-300">•</span>
          <span className="hidden sm:inline">JOURNEY: DAY 1 OF 100 🌸</span>
          <span className="text-pink-300 hidden sm:inline">•</span>
          <span className="hidden md:inline text-pink-600 font-medium">soft &amp; cute cybersecurity research diary 🐾</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-400 transition-all text-[11px] font-medium shadow-cute-pill"
            title="Open Interactive Kawaii Terminal (Ctrl+K)"
          >
            <Terminal className="w-3 h-3 text-pink-500" />
            <span className="hidden sm:inline">terminal</span>
            <kbd className="text-[9px] px-1 bg-pink-100/70 border border-pink-200 rounded-full text-pink-600">^K</kbd>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 border border-pink-200 flex items-center justify-center text-pink-500 group-hover:shadow-cute-glow group-hover:scale-105 transition-all text-xl shadow-cute-pill">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-bold text-lg text-slate-800 group-hover:text-pink-600 transition-colors">
              <span>0xSEC</span>
              <span className="text-pink-400 text-xs px-1.5 py-0.5 bg-pink-100 rounded-full">logs ✨</span>
            </div>
            <div className="text-[10px] font-sans font-medium text-pink-500 tracking-wider">
              cyber journey &bull; femboy vibes 🐾
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
            className={`px-3.5 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'logs'
                ? 'bg-pink-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
            }`}
          >
            <span>🎀</span>
            <span>Writeups</span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-3.5 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'timeline'
                ? 'bg-pink-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">100-Day</span>
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => setCurrentTab('arsenal')}
            className={`px-3.5 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'arsenal'
                ? 'bg-pink-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Arsenal</span>
          </button>

          <div className="h-5 w-[1px] bg-pink-200 mx-1 hidden sm:block"></div>

          {/* New Writeup Composer Button */}
          <button
            onClick={onOpenCompose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-sans text-xs font-bold transition-all shadow-cute-pill hover:shadow-cute-glow hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Log</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-full text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            title="Search writeups and logs"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
