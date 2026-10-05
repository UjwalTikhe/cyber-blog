import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import type { Post } from '../types';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';

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
        <div className="text-slate-300 space-y-1">
          <p className="text-emerald-400 font-bold">SYSTEM CONNECTED: 0xSEC KERNEL v2.6</p>
          <p className="text-slate-400 text-xs">Type <span className="text-emerald-400 font-bold">help</span> to view commands, or search writeups by title / keyword.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Global Ctrl+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
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
        <div className="space-y-1 text-slate-300 text-xs font-mono">
          <p className="text-emerald-400 font-bold">AVAILABLE COMMANDS:</p>
          <p>• <span className="text-cyan-400">ls / posts</span> : List all available writeups</p>
          <p>• <span className="text-cyan-400">read &lt;id&gt;</span> : Open a specific writeup by slug or number</p>
          <p>• <span className="text-cyan-400">timeline</span> : View 100-Day progression tracker</p>
          <p>• <span className="text-cyan-400">arsenal</span> : View homelab specifications &amp; tools</p>
          <p>• <span className="text-cyan-400">whoami</span> : Print operator background &amp; certifications</p>
          <p>• <span className="text-cyan-400">clear</span> : Clear terminal history</p>
          <p>• <span className="text-cyan-400">exit</span> : Close terminal</p>
        </div>
      );
    } else if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (lower === 'exit') {
      onClose();
      return;
    } else if (lower === 'posts' || lower === 'ls') {
      response = (
        <div className="space-y-1.5 text-xs font-mono">
          <p className="text-emerald-400 font-bold">LOGGED TRANSMISSIONS ({posts.length}):</p>
          {posts.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPost(p);
                onClose();
              }}
              className="flex items-center justify-between p-1.5 rounded hover:bg-cyber-surface cursor-pointer text-slate-300 hover:text-emerald-400 group"
            >
              <span>[{idx + 1}] {p.title}</span>
              <span className="text-slate-500 group-hover:text-emerald-400">read {idx + 1} &gt;</span>
            </div>
          ))}
        </div>
      );
    } else if (lower === 'timeline') {
      onNavigateTab('timeline');
      onClose();
      return;
    } else if (lower === 'arsenal') {
      onNavigateTab('arsenal');
      onClose();
      return;
    } else if (lower === 'whoami') {
      response = (
        <div className="space-y-1 text-xs font-mono text-slate-300 border-l-2 border-emerald-500 pl-3 py-1">
          <p className="text-emerald-400 font-bold">OPERATOR: Security Researcher / Student</p>
          <p>MISSION: Document 100 consecutive days of ethical security research, lab attacks, and blue team defenses.</p>
          <p>CERT GOALS: CompTIA Security+, eJPT, OSCP</p>
          <p>LAB ENVIRONMENT: VirtualBox 7.x, Kali Linux, Isolated NAT/Host-Only Subnets</p>
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
        response = <p className="text-rose-400 text-xs">Error: Post matching "{target}" not found.</p>;
      }
    } else {
      // Treat as keyword search
      const matches = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)) ||
          p.category.toLowerCase().includes(lower)
      );

      if (matches.length > 0) {
        response = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-emerald-400">Search results for "{cmd}":</p>
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectPost(m);
                  onClose();
                }}
                className="p-2 rounded bg-cyber-surface border border-cyber-border hover:border-emerald-500/40 cursor-pointer text-slate-200 hover:text-emerald-400 flex items-center justify-between"
              >
                <span>{m.title}</span>
                <span className="text-[10px] text-slate-400">{m.category}</span>
              </div>
            ))}
          </div>
        );
      } else {
        response = (
          <p className="text-slate-400 text-xs">
            Command or search query not recognized. Type <span className="text-emerald-400 font-bold">help</span> for commands.
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="bg-cyber-surface px-4 py-3 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span>OPERATOR_TERMINAL // INTERACTIVE CLI</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">ESC to close</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-4 bg-cyber-bg/95">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-slate-500">sec@kali:~$</span>
                <span>{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-cyber-surface border-t border-cyber-border flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400">sec@kali:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or search writeups..."
            className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
