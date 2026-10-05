import { useState, useEffect } from 'react';
import type { Post } from '../types';
import { updatePassphrase } from '../utils/auth';

interface ArchiveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onImportArchive: (importedPosts: Post[]) => void;
  onResetArchive: () => void;
}

export const ArchiveManagerModal = ({
  isOpen,
  onClose,
  posts,
  onImportArchive,
  onResetArchive,
}: ArchiveManagerModalProps) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'passphrase'>('sync');

  // Passphrase form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; isError: boolean } | null>(null);

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

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `akte511_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportArchive(parsed);
            alert(`Successfully imported ${parsed.length} dossier records into archive.`);
            onClose();
          } else {
            alert('Invalid archive file format. Expected a JSON array of posts.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleUpdatePassphrase = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updatePassphrase(currentPass, newPass);
    if (result.success) {
      setPassMsg({ text: 'Master authorization key updated successfully.', isError: false });
      setCurrentPass('');
      setNewPass('');
    } else {
      setPassMsg({ text: result.error || 'Failed to update key.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
      <div className="bg-paper border border-paper-border max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-paper-border pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-crimson uppercase tracking-wider">
              [ ✦ AUTEUR ARCHIVE SUITE ]
            </span>
            <h2 className="text-xl font-serif font-bold text-ink">
              Archive &amp; Security Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-ink-muted hover:text-ink px-1.5 py-0.5 border border-paper-border"
          >
            [X]
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-paper-border pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1 border transition-colors ${
              activeTab === 'sync'
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink-muted border-paper-border hover:text-ink'
            }`}
          >
            Archive Backup &amp; Sync
          </button>
          <button
            onClick={() => setActiveTab('passphrase')}
            className={`px-3 py-1 border transition-colors ${
              activeTab === 'passphrase'
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink-muted border-paper-border hover:text-ink'
            }`}
          >
            Security Passphrase
          </button>
        </div>

        {activeTab === 'sync' ? (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 border border-paper-border bg-paper space-y-2">
              <div className="font-bold text-ink">CURRENT LOCAL LEDGER: {posts.length} ENTRIES</div>
              <p className="text-ink-muted text-[11px] leading-relaxed font-sans">
                Articles you compose are instantly stored in your browser's persistent storage. You can export a verifiable backup at any moment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export Button */}
              <button
                onClick={handleExportJson}
                className="p-3 border border-paper-border bg-paper hover:bg-paper hover:border-paper-darkBorder text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-ink">&darr; Export Archive (.json)</div>
                <div className="text-[10px] text-ink-muted">Download entire article ledger for safe keeping.</div>
              </button>

              {/* Import Button */}
              <label className="p-3 border border-paper-border bg-paper hover:bg-paper hover:border-paper-darkBorder text-left space-y-1 transition-colors cursor-pointer block">
                <div className="font-bold text-ink">&uarr; Import Archive (.json)</div>
                <div className="text-[10px] text-ink-muted">Restore records from a previously exported file.</div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear All Warning */}
            <div className="pt-3 border-t border-paper-border flex items-center justify-between">
              <div>
                <div className="font-bold text-crimson text-[11px]">RESET ARCHIVE</div>
                <div className="text-[10px] text-ink-muted">Delete all local records to start from 000.</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to completely clear all local posts? This cannot be undone.')) {
                    onResetArchive();
                    onClose();
                  }
                }}
                className="px-3 py-1 border border-crimson text-crimson hover:bg-crimson hover:text-paper transition-colors text-[11px]"
              >
                Reset to Zero
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassphrase} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-ink font-semibold">CURRENT PASSPHRASE</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Current authorization key..."
                className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ink font-semibold">NEW PASSPHRASE</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New secret key (min 4 characters)..."
                className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none"
              />
            </div>

            {passMsg && (
              <div className={`text-[11px] ${passMsg.isError ? 'text-crimson' : 'text-ink font-bold'}`}>
                &bull; {passMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-ink text-paper font-bold hover:bg-ink-muted transition-colors"
            >
              Update Authorization Key
            </button>
          </form>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-paper-border text-xs font-mono text-ink-muted hover:text-ink"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
