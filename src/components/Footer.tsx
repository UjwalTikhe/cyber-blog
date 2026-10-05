interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const Footer = ({ onOpenLegal }: FooterProps) => {
  return (
    <footer className="w-full border-t border-paper-border bg-paper py-10 text-ink-muted text-xs font-mono">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-paper-border">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center gap-2 text-ink font-bold text-sm">
              <span>AKTE 511</span>
              <span className="text-[11px] text-ink-muted">/ 511 DOSSIER SERIES</span>
            </div>
            <p className="text-ink-muted text-xs leading-relaxed font-sans max-w-sm">
              An open cybersecurity research archive documenting offensive tests, transport layer packet dissections, isolated virtualization architectures, and defensive mitigations.
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-ink-muted">
                Static Release &bull; Immutable &bull; Read-Only
              </span>
            </div>
          </div>

          {/* Core Areas */}
          <div className="md:col-span-3 space-y-1.5 font-sans">
            <div className="text-ink font-mono font-bold text-xs uppercase tracking-wider mb-2">CURRICULUM</div>
            <div className="text-xs text-ink-muted">01. Protocol Analysis and Foundations</div>
            <div className="text-xs text-ink-muted">02. Isolated Hypervisor Sandboxing</div>
            <div className="text-xs text-ink-muted">03. Transport Layer Packet Forensics</div>
            <div className="text-xs text-ink-muted">04. Defensive Hardening Signatures</div>
          </div>

          {/* Legal and Compliance */}
          <div className="md:col-span-4 space-y-2 font-sans">
            <div className="text-ink font-mono font-bold text-xs uppercase tracking-wider">COMPLIANCE AND POLICIES</div>
            <p className="text-ink-muted text-xs leading-relaxed">
              All exercises documented in this archive are performed strictly within isolated private virtual subnets or authorized laboratory environments. Complete adherence to legal frameworks is maintained at all times.
            </p>
            <div className="flex items-center gap-3 pt-1 font-mono text-[11px]">
              <button
                onClick={() => onOpenLegal('terms')}
                className="underline hover:text-ink transition-colors"
              >
                Terms of Service
              </button>
              <span>/</span>
              <button
                onClick={() => onOpenLegal('privacy')}
                className="underline hover:text-ink transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-ink-muted text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Akte 511. Authored by Ujwal Tikhe.
          </div>
          <div>
            Documented through First Principles and the Feynman Technique.
          </div>
        </div>
      </div>
    </footer>
  );
};
