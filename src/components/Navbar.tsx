interface NavbarProps {
  onHomeClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAuthor: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onNewPostClick: () => void;
  onOpenArchiveManager: () => void;
}

export const Navbar = ({
  onHomeClick,
  searchQuery,
  onSearchChange,
  isAuthor,
  onLoginClick,
  onLogoutClick,
  onNewPostClick,
  onOpenArchiveManager,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-border bg-paper/95 backdrop-blur-none">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left shrink-0"
        >
          <div className="w-7 h-7 border border-paper-border bg-paper-surface flex items-center justify-center font-mono text-xs font-bold text-ink">
            511
          </div>
          <div>
            <div className="font-serif font-bold text-base text-ink tracking-tight flex items-center gap-1.5">
              <span>Akte 511</span>
              <span className="font-mono text-[10px] text-crimson font-normal">/ journal</span>
            </div>
          </div>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative w-32 sm:w-52">
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

          {/* Author Session Actions */}
          {isAuthor ? (
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-crimson font-bold px-2 py-0.5 border border-crimson/30 bg-paper-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                <span>Author</span>
              </span>

              <button
                onClick={onNewPostClick}
                className="px-2.5 py-1 bg-crimson text-paper font-bold hover:opacity-90 transition-opacity"
                title="Pen new blog post"
              >
                + New
              </button>

              <button
                onClick={onOpenArchiveManager}
                className="px-2 py-1 border border-paper-border bg-paper-surface text-ink hover:border-paper-darkBorder transition-colors hidden sm:inline-block"
                title="Archive Backup & Passphrase Settings"
              >
                Sync
              </button>

              <button
                onClick={onLogoutClick}
                className="px-2 py-1 border border-paper-border text-ink-muted hover:text-ink transition-colors"
                title="Lock Author Studio"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="font-mono text-xs px-2.5 py-1 border border-paper-border bg-paper-surface text-ink-muted hover:text-ink hover:border-paper-darkBorder transition-colors"
              title="Author Login (Akte 511 Studio)"
            >
              [ ✦ Author ]
            </button>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com/UjwalTikhe/cyber-blog"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-1 border border-paper-border bg-paper-surface transition-colors hidden sm:block"
            title="GitHub Repository"
          >
            Repo
          </a>
        </div>
      </div>
    </header>
  );
};
