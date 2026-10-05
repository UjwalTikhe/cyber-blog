import { Shield } from 'lucide-react';

interface NavbarProps {
  onHomeClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar = ({
  onHomeClick,
  searchQuery,
  onSearchChange,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200 flex items-center justify-center text-rose-600 group-hover:border-rose-300 transition-all shadow-sm">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="font-display font-extrabold text-lg text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight flex items-center gap-2">
              <span>Akte 511</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 font-medium">
              Cybersecurity Journal &bull; 511 Articles
            </div>
          </div>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-44 sm:w-64">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-3.5 pr-8 py-1.5 rounded-full bg-pink-50/50 border border-pink-200 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                &times;
              </button>
            )}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/UjwalTikhe/cyber-blog"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-pink-50 border border-pink-100 transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
