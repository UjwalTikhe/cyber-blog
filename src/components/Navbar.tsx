import { Terminal, Shield, PlusCircle, Compass, Wrench, Search } from 'lucide-react';

interface NavbarProps {
  currentTab: 'logs' | 'timeline' | 'arsenal';
  setCurrentTab: (tab: 'logs' | 'timeline' | 'arsenal') => void;
  onOpenCompose: () => void;
  onOpenTerminal: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCompose,
  onOpenTerminal,
  onHomeClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-bg/90 backdrop-blur-md">
      {/* Top micro-bar */}
      <div className="border-b border-cyber-border/40 px-4 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-semibold tracking-wider">SYSTEM ACTIVE</span>
          <span className="text-slate-600">//</span>
          <span className="hidden sm:inline">JOURNEY: DAY 1 OF 100</span>
          <span className="text-slate-600 hidden sm:inline">//</span>
          <span className="text-slate-400 hidden md:inline">SECURITY RESEARCH &amp; HOMELAB LOGS</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
            title="Open Interactive Cyber Terminal (Ctrl+K)"
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline text-[10px]">TERMINAL</span>
            <kbd className="text-[9px] px-1 bg-cyber-surface border border-slate-700 rounded text-slate-400">^K</kbd>
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
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-cyber-glow-emerald transition-all">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-bold text-base tracking-wider text-slate-100 group-hover:text-emerald-400 transition-colors">
              <span>ROOT</span>
              <span className="text-emerald-400">//</span>
              <span>LOGS</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Cybersecurity Journal
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
            className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              currentTab === 'logs'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-surface border border-transparent'
            }`}
          >
            <span>//</span>
            <span>Writeups</span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              currentTab === 'timeline'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-surface border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">100-Day</span>
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => setCurrentTab('arsenal')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              currentTab === 'arsenal'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-surface border border-transparent'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Arsenal</span>
          </button>

          <div className="h-5 w-[1px] bg-cyber-border mx-1 hidden sm:block"></div>

          {/* New Writeup Composer Button */}
          <button
            onClick={onOpenCompose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all shadow-md shadow-emerald-500/20 hover:shadow-cyber-glow-emerald"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Writeup</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-cyber-surface transition-colors"
            title="Search writeups and logs"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
