import { Radio, Shield, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-pink-100 bg-white/90 py-12 text-slate-500 font-sans text-xs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-pink-100">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
              <div className="w-6 h-6 rounded-lg bg-pink-100 border border-pink-200 flex items-center justify-center text-rose-500">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold tracking-tight">AKTE 511</span>
              <span className="text-[10px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                511 DOSSIERS
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans max-w-sm">
              An open security engineering archive documenting offensive tests, transport-layer packet dissections, isolated virtualization architectures, and defensive mitigations.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/UjwalTikhe"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-pink-50 border border-pink-200 hover:border-pink-400 text-slate-700 hover:text-rose-600 transition-colors shadow-cute-pill"
                title="GitHub Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-pink-50 border border-pink-200 hover:border-pink-400 text-slate-700 hover:text-rose-600 transition-colors shadow-cute-pill"
                title="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-rose-600 text-[11px] font-bold shadow-cute-pill">
                <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                <span>STATIC ARCHIVE</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-slate-900 font-display font-bold tracking-wider text-xs">TOPIC CURRICULUM</div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="hover:text-rose-600 cursor-default transition-colors">Protocol Analysis &amp; Foundations</li>
              <li className="hover:text-rose-600 cursor-default transition-colors">Isolated Hypervisor Sandboxing</li>
              <li className="hover:text-rose-600 cursor-default transition-colors">Transport Layer Packet Forensics</li>
              <li className="hover:text-rose-600 cursor-default transition-colors">Enterprise Defenses &amp; Hardening</li>
            </ul>
          </div>

          {/* Ethics statement */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-slate-900 font-display font-bold tracking-wider text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span>ETHICS &amp; SAFETY NOTICE</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              All exercises documented in this archive are performed strictly within isolated private virtual subnets or authorized laboratory environments. Complete adherence to legal frameworks is maintained at all times.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Akte 511. Authored by Ujwal Tikhe.</span>
          </div>
          <div>
            <span>Static Distribution &bull; Immutable Records &bull; Read-Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
