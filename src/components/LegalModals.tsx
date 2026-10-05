interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-paper border border-paper-border p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-paper-border">
          <h2 className="font-serif font-bold text-xl text-ink">
            {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-1 border border-paper-border"
          >
            [Close]
          </button>
        </div>

        {type === 'terms' ? (
          <div className="space-y-3 text-xs font-sans text-ink-muted leading-relaxed">
            <p className="font-semibold text-ink">
              1. Educational and Research Purpose
            </p>
            <p>
              Akte 511 is an independent cybersecurity research journal and documentation archive authored by Ujwal Tikhe. All material published here is intended solely for authorized security education, defensive engineering, and academic study.
            </p>

            <p className="font-semibold text-ink">
              2. Lab Containment and Ethical Compliance
            </p>
            <p>
              All penetration tests, network captures, and system modifications described across this publication are performed strictly within isolated, private virtual hypervisors or authorized capture-the-flag environments.
            </p>

            <p className="font-semibold text-ink">
              3. Disclaimer of Liability
            </p>
            <p>
              The author assumes no liability for the misuse of technical information, commands, or concepts presented herein. Readers are solely responsible for ensuring that their actions comply with all applicable local, national, and international cybersecurity laws.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs font-sans text-ink-muted leading-relaxed">
            <p className="font-semibold text-ink">
              1. Zero Personal Data Collection
            </p>
            <p>
              Akte 511 is a purely static publication hosted via GitHub Pages CDN. We do not operate databases, user accounts, ad tracking networks, marketing analytics, or fingerprinting scripts.
            </p>

            <p className="font-semibold text-ink">
              2. Cookies and Storage
            </p>
            <p>
              This website does not set tracking cookies. If you author drafts locally in development mode, draft data is stored strictly in your browser's private local storage and is never transmitted to any external server.
            </p>

            <p className="font-semibold text-ink">
              3. External Links and Media
            </p>
            <p>
              Articles may contain embedded companion walkthrough videos hosted on YouTube (using youtube-nocookie.com). Interaction with embedded players is governed by the respective platform policies.
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-paper-border text-right">
          <button
            onClick={onClose}
            className="font-mono text-xs px-4 py-1.5 bg-ink text-paper hover:bg-ink-muted transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
