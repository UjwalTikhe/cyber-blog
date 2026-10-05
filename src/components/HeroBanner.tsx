import { BookOpen, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
}

export const HeroBanner = ({
  postCount,
  onExploreClick,
}: HeroBannerProps) => {
  return (
    <div className="relative border-b border-pink-100 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/15 overflow-hidden">
      {/* Background polka dots and pastel ambient blur */}
      <div className="absolute inset-0 bg-cute-dots pointer-events-none opacity-30"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-200 text-rose-700 font-sans text-xs font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="tracking-wider">AKTE 511</span>
              <span className="text-pink-300">•</span>
              <span className="text-slate-600 font-medium">TECHNICAL RESEARCH ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Akte 511 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
                Security Journal &amp; Dossiers
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
              An open engineering archive documenting hands-on penetration testing labs, network packet forensics,
              isolated virtualization architectures, and defensive mitigations structured through the Feynman Technique.
            </p>

            {/* Clean Action & Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-cute-pill hover:scale-102"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>EXPLORE DOSSIERS</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-sans text-slate-500 bg-white/80 px-3.5 py-2 rounded-full border border-pink-100">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Isolated Lab Telemetry</span>
              </div>
            </div>
          </div>

          {/* Clean Editorial Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 border border-pink-200/90 rounded-3xl p-6 shadow-cute-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-slate-800">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>DOSSIER STATUS</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  ACTIVE ARCHIVE
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Published Files</div>
                    <div className="text-2xl font-bold font-display text-slate-900 mt-0.5">{postCount}</div>
                  </div>
                  <span className="text-[11px] font-mono text-rose-600 bg-white px-2.5 py-1 rounded-full border border-pink-200">
                    Akte #001 - #511
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100/80 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-purple-700 font-bold">Core Standard</div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    First-principles comprehension with verifiable packet captures, reproduction steps, and defensive signatures.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-pink-100 text-[11px] font-sans text-slate-500 flex items-center justify-between">
                <span>Sanctioned Labs &amp; Subnets</span>
                <span className="font-mono text-[10px] text-slate-400">0xSEC / AKTE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
