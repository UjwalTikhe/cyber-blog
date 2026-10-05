import type { Post } from '../types';

interface DeleteConfirmModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (postId: string) => void;
}

export const DeleteConfirmModal = ({
  post,
  isOpen,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) => {
  if (!isOpen || !post) return null;

  const akteNum = post.akteNumber ?? post.episode ?? 1;
  const akteDisplay = `AKTE ${String(akteNum).padStart(3, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
      <div className="bg-paper border border-paper-border max-w-md w-full p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
        <div className="space-y-2 border-b border-paper-border pb-4">
          <div className="font-mono text-[11px] font-bold text-crimson uppercase tracking-wider">
            [ CAUTION: DOSSIER DELETION ]
          </div>
          <h2 className="text-xl font-serif font-bold text-ink tracking-tight">
            Permanently Remove Entry?
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed font-sans">
            You are about to eliminate this entry from the archive ledger. This change will take effect immediately.
          </p>
        </div>

        {/* Target post summary card */}
        <div className="p-3 border border-paper-border bg-paper-surface space-y-1 font-mono text-xs">
          <div className="text-crimson font-bold">{akteDisplay}</div>
          <div className="text-ink font-semibold line-clamp-1">{post.title}</div>
          <div className="text-ink-muted text-[11px]">{post.category} &bull; {post.date}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-paper-border text-xs font-mono text-ink hover:border-paper-darkBorder transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmDelete(post.id)}
            className="px-4 py-1.5 bg-crimson text-paper text-xs font-mono font-bold hover:opacity-90 transition-opacity"
          >
            Confirm Deletion &times;
          </button>
        </div>
      </div>
    </div>
  );
};
