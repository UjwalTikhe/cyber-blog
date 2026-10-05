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
    <header className="sticky top-0 z-40 w-full border-b border-paper-border bg-paper">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="w-7 h-7 border border-paper-border bg-paper-surface flex items-center justify-center font-mono text-xs font-bold text-ink">
            511
          </div>
          <div>
            <div className="font-serif font-bold text-base text-ink tracking-tight">
              Akte 511
            </div>
          </div>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-40 sm:w-60">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-2.5 py-1 bg-paper-surface border border-paper-border text-xs font-mono text-ink placeholder:text-ink-light focus:outline-none focus:border-paper-darkBorder transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink font-mono text-xs"
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
            className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-1 border border-paper-border bg-paper-surface transition-colors"
            title="GitHub Repository"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};
