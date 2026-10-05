interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
}

export const HeroBanner = ({
  postCount,
  onExploreClick,
}: HeroBannerProps) => {
  return (
    <div className="border-b border-paper-border bg-paper-surface">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-4">
            <div className="font-mono text-xs text-ink-muted uppercase tracking-wider">
              Akte 511 / Technical Security Dossiers
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.12]">
              Akte 511: Research and Laboratory Records
            </h1>

            <p className="text-ink-muted text-base max-w-2xl leading-relaxed font-sans">
              An immutable technical ledger documenting penetration testing labs, network packet forensics,
              isolated virtualization architectures, and defensive mitigations structured through first principles and the Feynman Technique.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-4 py-2 bg-ink text-paper text-xs font-mono font-bold hover:bg-ink-muted transition-colors"
              >
                [ Browse Articles ]
              </button>

              <span className="text-xs font-mono text-ink-muted px-3 py-2 border border-paper-border bg-paper">
                Verified Lab Telemetry &bull; Educational Research
              </span>
            </div>
          </div>

          {/* Clean Overview Card */}
          <div className="lg:col-span-4 p-5 border border-paper-border bg-paper space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-paper-border font-mono text-xs">
              <span className="font-bold text-ink uppercase tracking-wider">Archive Status</span>
              <span className="text-crimson font-bold">Active</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Published Dossiers</span>
                <span className="font-bold text-ink">{postCount} / 511</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Scope</span>
                <span className="text-ink">Red &bull; Blue &bull; Forensics</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Standard</span>
                <span className="text-ink">Feynman First Principles</span>
              </div>
            </div>

            <div className="pt-2 border-t border-paper-border text-[11px] font-sans text-ink-muted">
              All procedures conducted in isolated virtual networks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
