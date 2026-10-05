import { Terminal, Compass, Wrench, Search, PlusCircle, Shield } from 'lucide-react';

interface NavbarProps {
  currentTab: 'logs' | 'timeline' | 'arsenal';
  setCurrentTab: (tab: 'logs' | 'timeline' | 'arsenal') => void;
  onOpenCompose: () => void;
  onOpenTerminal: () => void;
  onHomeClick: () => void;
  isOwner?: boolean;
}

export const Navbar = ({
  currentTab,
  setCurrentTab,
  onOpenCompose,
  onOpenTerminal,
  onHomeClick,
  isOwner = false,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100 bg-white/90 backdrop-blur-md shadow-sm">
      {/* Top subtle status ribbon */}
      <div className="bg-gradient-to-r from-pink-50/80 via-purple-50/60 to-pink-50/80 border-b border-pink-100/80 px-4 py-1.5 text-[11px] font-sans text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="font-bold text-rose-700 tracking-wide">SYSTEM ACTIVE</span>
          <span className="text-pink-300">•</span>
          <span className="font-medium text-slate-700">JOURNEY: DAY 1 OF 100</span>
          <span className="text-pink-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-500">Security Research &amp; Lab Writeups</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-slate-700 hover:text-rose-600 hover:border-pink-400 transition-all text-[11px] font-medium shadow-cute-pill"
            title="Open Interactive Terminal (Ctrl+K)"
          >
            <Terminal className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">Terminal</span>
            <kbd className="text-[9px] px-1 bg-pink-100/70 border border-pink-200 rounded-full text-rose-600">^K</kbd>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 border border-pink-200 flex items-center justify-center text-rose-600 group-hover:shadow-cute-glow group-hover:scale-105 transition-all shadow-cute-pill">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">
              <span>0xSEC</span>
              <span className="text-rose-600 text-xs px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-full font-sans font-semibold">Journal</span>
            </div>
            <div className="text-[10px] font-sans font-medium text-slate-500 tracking-wider">
              Technical Logs &amp; Writeups
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setCurrentTab('logs');
              onHomeClick();
            }}
            className={`px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all ${
              currentTab === 'logs'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <span>Writeups</span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'timeline'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">100-Day</span>
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => setCurrentTab('arsenal')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'arsenal'
                ? 'bg-rose-500 text-white shadow-cute-pill'
                : 'text-slate-600 hover:text-rose-600 hover:bg-pink-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Arsenal</span>
          </button>

          {/* Secure Author-Only Writeup Button (visible in local development or when owner mode is active) */}
          {isOwner && (
            <button
              onClick={onOpenCompose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-bold transition-all shadow-cute-pill hover:scale-105 ml-1"
              title="Author Composer Studio"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ New Writeup</span>
              <span className="sm:hidden">+ Post</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-pink-50 transition-colors ml-1"
            title="Search writeups and logs (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
