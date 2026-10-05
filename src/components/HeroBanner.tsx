import { ShieldCheck, Terminal, ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
  onComposeClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  postCount,
  onExploreClick,
  onComposeClick,
}) => {
  return (
    <div className="relative border-b border-cyber-border bg-cyber-surface/60 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>JOURNEY LOG // 100 DAYS OF CYBERSECURITY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
              Documenting the Breach <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-200">
                to the Active Defense.
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              An open, transparent engineering journal recording hands-on penetration testing labs,
              network packet forensics, homelab architectures, and defensive mitigations from Day 1 to Industry-Ready.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>EXPLORE TRANSMISSIONS</span>
              </button>

              <button
                onClick={onComposeClick}
                className="px-4 py-2.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-emerald-500/40 text-slate-200 font-mono text-xs tracking-wider transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>OPEN WRITEUP STUDIO</span>
              </button>
            </div>
          </div>

          {/* Tactical Telemetry Bento */}
          <div className="lg:col-span-4">
            <div className="bg-cyber-card/90 border border-cyber-border rounded-xl p-5 shadow-cyber-md backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OPERATOR_STATUS</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-cyber-surface/80 border border-cyber-border/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Writeups</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">{postCount}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                    <ArrowUpRight className="w-3 h-3" /> Logged
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyber-surface/80 border border-cyber-border/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Current Day</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">Day 1</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">Foundations</div>
                </div>

                <div className="p-3 rounded-lg bg-cyber-surface/80 border border-cyber-border/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Homelab</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 mt-1">VirtualBox + Kali</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Isolated Subnet</div>
                </div>

                <div className="p-3 rounded-lg bg-cyber-surface/80 border border-cyber-border/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Target Cert</div>
                  <div className="text-xs font-bold font-mono text-purple-400 mt-1">Sec+ / OSCP</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">In Progress</div>
                </div>
              </div>

              <div className="pt-2 border-t border-cyber-border/50 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>ETHICS: Strictly Authorized Labs</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
