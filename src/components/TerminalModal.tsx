import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import type { Post } from '../types';
import { X, CornerDownLeft, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onNavigateTab: (tab: 'logs' | 'timeline' | 'arsenal') => void;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  output: ReactNode;
}

export const TerminalModal = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  onNavigateTab,
}: TerminalModalProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init',
      command: 'sys.status',
      output: (
        <div className="text-slate-700 space-y-1 font-sans">
          <p className="text-rose-600 font-bold font-display">AKTE 511 // RESEARCH ARCHIVE SHELL v3.0</p>
          <p className="text-slate-500 text-xs">
            Type <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">help</span> to view commands, or query dossiers by keyword or ID.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    let response: ReactNode = null;

    if (lower === 'help') {
      response = (
        <div className="space-y-1.5 text-slate-700 text-xs font-sans">
          <p className="text-rose-600 font-bold font-display">AVAILABLE COMMANDS:</p>
          <p>• <span className="text-purple-600 font-bold font-mono">ls / dossiers</span> : List all published dossiers</p>
          <p>• <span className="text-purple-600 font-bold font-mono">read &lt;id|number&gt;</span> : Open dossier record</p>
          <p>• <span className="text-purple-600 font-bold font-mono">index</span> : Open Akte 511 master curriculum index</p>
          <p>• <span className="text-purple-600 font-bold font-mono">arsenal</span> : View homelab specifications &amp; tooling</p>
          <p>• <span className="text-purple-600 font-bold font-mono">whoami</span> : Display operator and series metadata</p>
          <p>• <span className="text-purple-600 font-bold font-mono">clear</span> : Clear terminal display</p>
          <p>• <span className="text-purple-600 font-bold font-mono">exit</span> : Close search terminal</p>
        </div>
      );
    } else if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (lower === 'exit') {
      onClose();
      return;
    } else if (lower === 'posts' || lower === 'dossiers' || lower === 'ls') {
      response = (
        <div className="space-y-1.5 text-xs font-sans">
          <p className="text-rose-600 font-bold font-display">PUBLISHED DOSSIERS ({posts.length}):</p>
          {posts.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPost(p);
                onClose();
              }}
              className="flex items-center justify-between p-2 rounded-xl bg-pink-50/60 hover:bg-pink-100 cursor-pointer text-slate-800 hover:text-rose-700 transition-colors group"
            >
              <span className="font-mono text-[11px]">[{String(p.akteNumber ?? idx + 1).padStart(3, '0')}] {p.title}</span>
              <span className="text-rose-600 font-bold text-[11px]">read &rarr;</span>
            </div>
          ))}
        </div>
      );
    } else if (lower === 'timeline' || lower === 'index') {
      onNavigateTab('timeline');
      onClose();
      return;
    } else if (lower === 'arsenal') {
      onNavigateTab('arsenal');
      onClose();
      return;
    } else if (lower === 'whoami') {
      response = (
        <div className="space-y-1 text-xs font-sans text-slate-700 border-l-4 border-rose-400 pl-3 py-1 bg-pink-50/60 rounded-r-xl">
          <p className="text-rose-600 font-bold font-display">ARCHIVE: Akte 511</p>
          <p>OPERATOR: Ujwal Tikhe</p>
          <p>SCOPE: Penetration testing labs, network protocol forensics &amp; blue-team mitigation.</p>
          <p>ENVIRONMENT: Isolated dual-adapter hypervisor sandbox.</p>
        </div>
      );
    } else if (lower.startsWith('read ') || lower.startsWith('cat ')) {
      const target = lower.replace(/^(read|cat)\s+/, '').trim();
      const num = parseInt(target, 10);
      let targetPost: Post | undefined;

      if (!isNaN(num) && num >= 1 && num <= posts.length) {
        targetPost = posts[num - 1];
      } else {
        targetPost = posts.find((p) => p.id.includes(target) || p.title.toLowerCase().includes(target));
      }

      if (targetPost) {
        onSelectPost(targetPost);
        onClose();
        return;
      } else {
        response = <p className="text-rose-600 text-xs">Error: Dossier matching "{target}" not found.</p>;
      }
    } else {
      const matches = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)) ||
          p.category.toLowerCase().includes(lower)
      );

      if (matches.length > 0) {
        response = (
          <div className="space-y-2 text-xs font-sans">
            <p className="text-rose-600 font-bold">Search results for "{cmd}":</p>
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectPost(m);
                  onClose();
                }}
                className="p-2.5 rounded-2xl bg-pink-50/70 border border-pink-200 hover:border-pink-400 cursor-pointer text-slate-800 hover:text-rose-600 flex items-center justify-between"
              >
                <span className="font-semibold text-xs">{m.title}</span>
                <span className="text-[10px] text-rose-600 font-mono bg-white px-2 py-0.5 rounded-full border border-pink-200">
                  {m.category}
                </span>
              </div>
            ))}
          </div>
        );
      } else {
        response = (
          <p className="text-slate-500 text-xs font-sans">
            Command not recognized. Type <span className="text-rose-600 font-bold font-mono">help</span> to view commands.
          </p>
        );
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmd,
        output: response,
      },
    ]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-pink-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Terminal Title Bar */}
        <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 px-5 py-3 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xs text-slate-800">
            <TerminalIcon className="w-4 h-4 text-rose-500" />
            <span className="font-mono">AKTE 511 // COMMAND SEARCH SHELL</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-sans text-slate-400 hidden sm:inline">ESC to close</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-pink-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-4 bg-pink-50/15">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <span className="text-purple-600">guest@akte511:~$</span>
                <span>{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form onSubmit={handleCommandSubmit} className="p-3.5 bg-white border-t border-pink-100 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-rose-600">guest@akte511:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or search dossiers..."
            className="flex-1 bg-transparent font-mono text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-rose-600 transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
