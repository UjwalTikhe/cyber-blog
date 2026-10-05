import { useState } from 'react';
import type { ArsenalTool } from '../types';
import { Wrench, Check, Copy } from 'lucide-react';

interface ArsenalViewProps {
  arsenal: ArsenalTool[];
}

export const ArsenalView = ({ arsenal }: ArsenalViewProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const statusColors = {
    'Daily Driver': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Active Lab': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Currently Studying': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
          <Wrench className="w-3.5 h-3.5" />
          <span>ARSENAL &amp; ENVIRONMENT // HOMELAB SPECS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Tools, Hardware &amp; Security Stack
        </h1>
        <p className="text-sm text-slate-400">
          The exact toolstack, operating systems, hypervisors, and security frameworks utilized across all lab walkthroughs and exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arsenal.map((tool, index) => (
          <div
            key={tool.name}
            className="bg-cyber-card/80 border border-cyber-border hover:border-cyan-500/40 rounded-xl p-5 shadow-cyber-sm transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  {tool.category}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {tool.name}
                </h3>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border font-medium ${
                  statusColors[tool.status]
                }`}
              >
                {tool.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {tool.purpose}
            </p>

            {tool.commandExample && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>COMMAND / CHEATSHEET</span>
                  <button
                    onClick={() => handleCopy(tool.commandExample!, index)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-cyber-bg border border-cyber-border font-mono text-xs text-emerald-400 break-all select-all">
                  {tool.commandExample}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
