import { ArchivalArtifact3D } from './ArchivalArtifact3D';

interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
  isAuthor: boolean;
  onNewPostClick: () => void;
  onLoginClick: () => void;
}

export const HeroBanner = ({
  postCount,
  onExploreClick,
  isAuthor,
  onNewPostClick,
  onLoginClick,
}: HeroBannerProps) => {
  return (
    <div className="border-b border-paper-border bg-paper-surface">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-crimson uppercase tracking-wider font-semibold">
              <span>[ ✦ AKTE 511 ]</span>
              <span className="text-paper-darkBorder">&bull;</span>
              <span className="text-ink-muted">A SECURITY RESEARCH CHRONICLE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ink tracking-tight leading-[1.14]">
              Akte 511: Research &amp; Laboratory Records
            </h1>

            <p className="text-ink-muted text-base max-w-xl leading-relaxed font-sans">
              An independent, lifelong ledger of 511 technical writeups. Documenting penetration testing simulations, packet forensics, defensive blueprints, and concept explanations via the Feynman Technique.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {postCount > 0 ? (
                <button
                  onClick={onExploreClick}
                  className="px-4 py-2 bg-ink text-paper text-xs font-mono font-bold hover:bg-ink-muted transition-colors"
                >
                  [ Read Archive ({postCount}) ]
                </button>
              ) : isAuthor ? (
                <button
                  onClick={onNewPostClick}
                  className="px-4 py-2 bg-crimson text-paper text-xs font-mono font-bold hover:opacity-90 transition-opacity"
                >
                  [ + Pen Episode 001 ]
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 bg-ink text-paper text-xs font-mono font-bold hover:bg-ink-muted transition-colors"
                >
                  [ Author Login &rarr; ]
                </button>
              )}

              <span className="text-xs font-mono text-ink-muted px-3 py-2 border border-paper-border bg-paper">
                Goal: 511 Original Dossiers &bull; Zero Fluff
              </span>
            </div>
          </div>

          {/* 3D Interactive Archival Monolith Component */}
          <div className="lg:col-span-5 space-y-3">
            <ArchivalArtifact3D />

            {/* Quick Archival Status (Golden Rule 4: Design dialogs to yield closure) */}
            <div className="px-4 py-2.5 border border-paper-border bg-paper flex items-center justify-between font-mono text-xs text-ink-muted">
              <span>STATUS: <strong className="text-ink">ACTIVE JOURNAL</strong></span>
              <span>INDEX: <strong className="text-crimson font-bold">{String(postCount).padStart(3, '0')} / 511</strong> <span className="text-[10px]">({((postCount / 511) * 100).toFixed(1)}%)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
