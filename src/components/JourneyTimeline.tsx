import { useState } from 'react';
import type { JourneyMilestone, Post } from '../types';
import { CheckCircle2, Clock, ArrowRight, Target, Flag } from 'lucide-react';

interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  milestones,
  posts,
  onSelectPost,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');

  const filtered = milestones.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <Target className="w-3.5 h-3.5" />
          <span>MISSION TRACKER // 100-DAY SECURITY ROADMAP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          The 100-Day Progression
        </h1>
        <p className="text-sm text-slate-400">
          Tracking every milestone from initial network fundamentals to enterprise Active Directory penetration testing and industry certifications.
        </p>

        {/* Progress bar */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Roadmap Progress</span>
            <span className="text-emerald-400 font-bold">{completedCount} of {milestones.length} Milestones ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cyber-card border border-cyber-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {(['all', 'completed', 'in-progress', 'upcoming'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                filter === status
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-cyber-card text-slate-400 border border-cyber-border hover:border-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items list */}
      <div className="relative border-l-2 border-cyber-border ml-4 sm:ml-32 space-y-8">
        {filtered.map((milestone) => {
          const linkedPost = milestone.relatedPostId
            ? posts.find((p) => p.id === milestone.relatedPostId)
            : null;

          return (
            <div key={milestone.day} className="relative pl-6 sm:pl-8 group">
              {/* Dot on line */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  milestone.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                    : milestone.status === 'in-progress'
                    ? 'bg-amber-500 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    : 'bg-cyber-card border-slate-700'
                }`}
              />

              {/* Day label on left (for desktop) */}
              <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
                <span className="font-mono text-xs font-bold text-slate-400">
                  DAY {milestone.day}
                </span>
              </div>

              {/* Card */}
              <div className="bg-cyber-card/80 border border-cyber-border group-hover:border-emerald-500/40 rounded-xl p-5 shadow-cyber-sm transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      DAY {milestone.day}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {milestone.phase}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                      milestone.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : milestone.status === 'in-progress'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : 'text-slate-400 bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    {milestone.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {milestone.status === 'in-progress' && <Clock className="w-3 h-3 text-amber-400" />}
                    {milestone.status === 'upcoming' && <Flag className="w-3 h-3 text-slate-400" />}
                    <span>{milestone.status}</span>
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {milestone.description}
                </p>

                {linkedPost && (
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectPost(linkedPost)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all"
                    >
                      <span>Read Log: {linkedPost.title}</span>
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
