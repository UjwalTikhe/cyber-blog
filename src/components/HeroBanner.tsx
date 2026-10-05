import { BookOpen, ShieldCheck, FileText } from 'lucide-react';

interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
}

export const HeroBanner = ({
  postCount,
  onExploreClick,
}: HeroBannerProps) => {
  return (
    <div className="relative border-b border-pink-100 bg-gradient-to-b from-pink-50/40 via-white to-pink-50/10 overflow-hidden">
      {/* Background polka dots and pastel ambient blur */}
      <div className="absolute inset-0 bg-cute-dots pointer-events-none opacity-25"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-200 text-rose-700 font-sans text-xs font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="tracking-wider font-mono text-[11px]">AKTE 511</span>
              <span className="text-pink-300">•</span>
              <span className="text-slate-600 font-medium">CYBERSECURITY JOURNAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Akte 511 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
                Security Journal &amp; Articles
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
              Documenting hands-on penetration testing labs, network packet forensics,
              isolated virtualization architectures, and defensive mitigations structured through the Feynman Technique.
            </p>

            {/* Clean Action & Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-cute-pill hover:scale-102"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>EXPLORE ARTICLES</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-sans text-slate-500 bg-white px-3.5 py-2 rounded-full border border-pink-100 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Feynman Technique &bull; Lab Walkthroughs</span>
              </div>
            </div>
          </div>

          {/* Clean Editorial Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 border border-pink-200/90 rounded-3xl p-6 shadow-cute-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-slate-800">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>JOURNAL OVERVIEW</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  AKTE 511
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Published Articles</div>
                    <div className="text-2xl font-bold font-display text-slate-900 mt-0.5">{postCount}</div>
                  </div>
                  <span className="text-[11px] font-mono text-rose-600 bg-white px-3 py-1 rounded-full border border-pink-200 font-bold">
                    Akte #001 - #511
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100/80 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-purple-700 font-bold">Learning Philosophy</div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    First-principles comprehension using reproducible commands, Wireshark captures, and simple explanations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
