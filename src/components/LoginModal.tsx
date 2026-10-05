import { useState, useEffect } from 'react';
import { verifyPassphrase, setAuthorAuthenticated } from '../utils/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [passphrase, setPassphrase] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Golden Rule 2 & 6: Keyboard shortcut Esc to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError('Please provide your author passphrase.');
      return;
    }

    if (verifyPassphrase(passphrase)) {
      setAuthorAuthenticated(true);
      setError(null);
      setPassphrase('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid authorization key. Check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4 selection:bg-paper-border">
      <div className="bg-paper border border-paper-border max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="space-y-1.5 border-b border-paper-border pb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-crimson uppercase tracking-wider">
              [ ✦ AUTEUR STUDIO // SECURE KEY ]
            </span>
            <button
              onClick={onClose}
              className="font-mono text-xs text-ink-muted hover:text-ink px-1.5 py-0.5 border border-paper-border hover:border-paper-darkBorder transition-colors"
            >
              [X]
            </button>
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Author Authentication
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed font-sans">
            Authenticate to compose, revise, and manage dossiers across the Akte 511 archive.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-ink font-semibold">MASTER PASSPHRASE</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-ink-muted hover:text-ink transition-colors text-[11px]"
              >
                {showPassword ? '[Hide]' : '[Reveal]'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter authorization key..."
              className="w-full px-3 py-2 bg-paper border border-paper-border text-sm font-mono text-ink placeholder:text-ink-light focus:outline-none focus:border-paper-darkBorder transition-colors"
            />
            {error && (
              <div className="text-[11px] font-mono text-crimson pt-1">
                &bull; {error}
              </div>
            )}
          </div>

          {/* First run hint */}
          <div className="p-3 border border-paper-border bg-paper text-[11px] font-mono text-ink-muted space-y-1">
            <div className="font-bold text-ink">FIRST-TIME SETUP NOTICE</div>
            <p>
              Default master key: <code className="bg-paper px-1.5 py-0.2 border border-paper-border text-ink font-bold">akte511</code>
            </p>
            <p className="text-[10px]">
              You can modify this key at any time in the Author Settings menu once logged in.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-paper-border text-xs font-mono text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-ink text-paper text-xs font-mono font-bold hover:bg-ink-muted transition-colors"
            >
              Authorize Session &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
