import { ArrowUpRight, BookOpen, ShieldCheck, Terminal, FileEdit } from 'lucide-react';

interface HeroBannerProps {
  postCount: number;
  onExploreClick: () => void;
  onComposeClick: () => void;
  isOwner?: boolean;
}

export const HeroBanner = ({
  postCount,
  onExploreClick,
  onComposeClick,
  isOwner = false,
}: HeroBannerProps) => {
  return (
    <div className="relative border-b border-pink-100 bg-gradient-to-b from-pink-50/60 via-white to-pink-50/20 overflow-hidden">
      {/* Background polka dots and pastel ambient blur */}
      <div className="absolute inset-0 bg-cute-dots pointer-events-none opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 text-rose-700 font-sans text-xs font-bold shadow-cute-pill">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>100 DAYS OF CYBERSECURITY</span>
              <span className="text-pink-300">•</span>
              <span>DAY 1 ACTIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Daily Cybersecurity Journal &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
                Technical Lab Writeups
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
              An open engineering log recording hands-on penetration testing labs, network packet forensics,
              isolated homelab architectures, and defensive mitigations using the Feynman Technique.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-cute-pill hover:shadow-cute-glow hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                <span>EXPLORE WRITEUPS</span>
              </button>

              {isOwner && (
                <button
                  onClick={onComposeClick}
                  className="px-5 py-3 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-rose-600 font-sans text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-cute-pill hover:scale-105"
                >
                  <FileEdit className="w-4 h-4 text-rose-500" />
                  <span>AUTHOR STUDIO</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Bento */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 border border-pink-200 rounded-3xl p-6 shadow-cute-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-slate-800">
                  <Terminal className="w-4 h-4 text-rose-500" />
                  <span>JOURNEY TELEMETRY</span>
                </div>
                <span className="font-sans text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  ONLINE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
                  <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Writeups</div>
                  <div className="text-2xl font-bold font-display text-slate-900 mt-0.5">{postCount}</div>
                  <div className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-sans font-medium">
                    <ArrowUpRight className="w-3 h-3" /> Published
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Current Day</div>
                  <div className="text-2xl font-bold font-display text-purple-700 mt-0.5">Day 1</div>
                  <div className="text-[10px] text-purple-600 font-sans font-medium mt-1">Foundations</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Homelab</div>
                  <div className="text-xs font-bold font-display text-sky-800 mt-1">VirtualBox + Kali</div>
                  <div className="text-[10px] text-sky-600 font-sans font-medium mt-0.5">Isolated Subnet</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Target Goal</div>
                  <div className="text-xs font-bold font-display text-rose-800 mt-1">Sec+ &bull; OSCP</div>
                  <div className="text-[10px] text-rose-600 font-sans font-medium mt-0.5">In Progress</div>
                </div>
              </div>

              <div className="pt-2 border-t border-pink-100 text-[11px] font-sans font-medium text-slate-500 flex items-center justify-between">
                <span>Strictly authorized labs &amp; sandboxes</span>
                <ShieldCheck className="w-4 h-4 text-rose-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
