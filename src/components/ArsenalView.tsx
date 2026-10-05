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
    'Daily Driver': 'text-pink-700 bg-pink-50 border-pink-200',
    'Active Lab': 'text-purple-700 bg-purple-50 border-purple-200',
    'Currently Studying': 'text-sky-700 bg-sky-50 border-sky-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-sans text-xs font-bold shadow-cute-pill">
          <Wrench className="w-3.5 h-3.5" />
          <span>ARSENAL &amp; TOOLS // HOMELAB SPECS 🛠️</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">
          Tools, Hardware &amp; Security Stack ✨
        </h1>
        <p className="text-sm text-slate-600 font-sans">
          The exact software stack, hypervisors, and frameworks used across my cybersecurity lab walkthroughs~
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arsenal.map((tool, index) => (
          <div
            key={tool.name}
            className="bg-white border border-pink-100 hover:border-pink-300 rounded-3xl p-6 shadow-cute-sm hover:shadow-cute-card transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-pink-500 block mb-1">
                  🌸 {tool.category}
                </span>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  {tool.name}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-bold border ${
                  statusColors[tool.status]
                }`}
              >
                {tool.status === 'Daily Driver' && '🐾 Daily Driver'}
                {tool.status === 'Active Lab' && '💻 Active Lab'}
                {tool.status === 'Currently Studying' && '🎀 Studying'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {tool.purpose}
            </p>

            {tool.commandExample && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-sans font-bold text-slate-500 flex items-center justify-between">
                  <span>QUICK CHEATSHEET 🐾</span>
                  <button
                    onClick={() => handleCopy(tool.commandExample!, index)}
                    className="text-pink-600 hover:text-pink-800 transition-colors flex items-center gap-1 font-sans font-bold"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-pink-600" />
                        <span className="text-[11px] text-pink-600">(｡♥‿♥｡) Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 font-mono text-xs text-pink-700 break-all select-all shadow-sm">
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
