import { useState } from 'react';
import type { JourneyMilestone, Post } from '../types';
import { ArrowRight, Layers } from 'lucide-react';

interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const JourneyTimeline = ({
  milestones,
  posts,
  onSelectPost,
}: JourneyTimelineProps) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');

  const filtered = milestones.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-sans text-xs font-bold shadow-sm">
          <Layers className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] uppercase tracking-wider">AKTE 511 // MASTER INDEX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Curriculum Index
        </h1>
        <p className="text-sm text-slate-600 font-sans leading-relaxed">
          Structured progression framework spanning 511 documented technical dossiers: from protocol primitives to enterprise attack surfaces and forensic engineering.
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {(['all', 'in-progress', 'upcoming'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                filter === status
                  ? 'bg-rose-500 text-white shadow-cute-pill'
                  : 'bg-white text-slate-600 border border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {status === 'all' && 'All Phases'}
              {status === 'in-progress' && 'Active Phase'}
              {status === 'upcoming' && 'Upcoming Phases'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items list */}
      <div className="relative border-l-2 border-pink-200 ml-4 sm:ml-36 space-y-8">
        {filtered.map((milestone, idx) => {
          const linkedPost = milestone.relatedPostId
            ? posts.find((p) => p.id === milestone.relatedPostId)
            : null;

          return (
            <div key={milestone.akteRange || idx} className="relative pl-6 sm:pl-8 group">
              {/* Dot on line */}
              <div
                className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center text-[10px] ${
                  milestone.status === 'completed'
                    ? 'bg-rose-500 border-white text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                    : milestone.status === 'in-progress'
                    ? 'bg-rose-500 border-white text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                    : 'bg-white border-pink-200'
                }`}
              >
                {milestone.status === 'completed' ? '✓' : ''}
              </div>

              {/* Akte range label on left (desktop) */}
              <div className="hidden sm:block absolute -left-36 top-1 w-28 text-right">
                <span className="font-mono font-bold text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {milestone.akteRange}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white border border-pink-100 group-hover:border-pink-300 rounded-3xl p-6 shadow-cute-sm hover:shadow-cute-card transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden font-mono font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {milestone.akteRange}
                    </span>
                    <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                      {milestone.phase}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-sans font-bold border ${
                      milestone.status === 'in-progress'
                        ? 'text-rose-700 bg-rose-50 border-rose-200'
                        : 'text-slate-600 bg-slate-50 border-slate-200'
                    }`}
                  >
                    {milestone.status === 'in-progress' ? 'Active' : 'Planned'}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {milestone.description}
                </p>

                {linkedPost && (
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectPost(linkedPost)}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-full border border-rose-200 transition-all shadow-cute-pill"
                    >
                      <span>Open Dossier: {linkedPost.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
