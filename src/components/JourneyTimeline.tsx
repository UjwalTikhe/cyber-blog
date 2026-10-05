import { useState } from 'react';
import type { JourneyMilestone, Post } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

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

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Cute Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-sans text-xs font-bold shadow-cute-pill">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ROADMAP // 100-DAY CYBER JOURNEY 🌸</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">
          The 100-Day Progression ✨
        </h1>
        <p className="text-sm text-slate-600 font-sans">
          Tracking every milestone from networking fundamentals to enterprise Active Directory penetration testing and industry certifications~
        </p>

        {/* Cute Progress bar */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-sans font-bold mb-2">
            <span className="text-slate-600">Roadmap Progress 🐾</span>
            <span className="text-pink-600">{completedCount} of {milestones.length} Milestones ({progressPercent}%) ✨</span>
          </div>
          <div className="w-full h-3 rounded-full bg-pink-100 border border-pink-200 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400 transition-all duration-500 shadow-sm"
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
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                filter === status
                  ? 'bg-pink-500 text-white shadow-cute-pill'
                  : 'bg-white text-slate-600 border border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {status === 'all' && 'All ✨'}
              {status === 'completed' && 'Completed 🌸'}
              {status === 'in-progress' && 'In Progress 🐾'}
              {status === 'upcoming' && 'Upcoming 🎀'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items list */}
      <div className="relative border-l-2 border-pink-200 ml-4 sm:ml-32 space-y-8">
        {filtered.map((milestone) => {
          const linkedPost = milestone.relatedPostId
            ? posts.find((p) => p.id === milestone.relatedPostId)
            : null;

          return (
            <div key={milestone.day} className="relative pl-6 sm:pl-8 group">
              {/* Dot on line */}
              <div
                className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center text-[10px] ${
                  milestone.status === 'completed'
                    ? 'bg-pink-500 border-white text-white shadow-[0_0_12px_rgba(244,114,182,0.8)]'
                    : milestone.status === 'in-progress'
                    ? 'bg-purple-500 border-white text-white animate-pulse shadow-[0_0_12px_rgba(192,132,252,0.8)]'
                    : 'bg-white border-pink-200'
                }`}
              >
                {milestone.status === 'completed' ? '✓' : ''}
              </div>

              {/* Day label on left (for desktop) */}
              <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
                <span className="font-display font-bold text-xs text-pink-600 bg-pink-100/70 px-2.5 py-0.5 rounded-full border border-pink-200">
                  DAY {milestone.day}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white border border-pink-100 group-hover:border-pink-300 rounded-3xl p-6 shadow-cute-sm hover:shadow-cute-card transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden font-display font-bold text-xs text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                      DAY {milestone.day}
                    </span>
                    <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                      {milestone.phase}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-bold border ${
                      milestone.status === 'completed'
                        ? 'text-pink-700 bg-pink-50 border-pink-200'
                        : milestone.status === 'in-progress'
                        ? 'text-purple-700 bg-purple-50 border-purple-200'
                        : 'text-slate-600 bg-slate-50 border-slate-200'
                    }`}
                  >
                    {milestone.status === 'completed' && <span>🌸 Completed</span>}
                    {milestone.status === 'in-progress' && <span>🐾 In Progress</span>}
                    {milestone.status === 'upcoming' && <span>🎀 Planned</span>}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {milestone.description}
                </p>

                {linkedPost && (
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectPost(linkedPost)}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-full border border-pink-200 transition-all shadow-cute-pill"
                    >
                      <span>Read Log: {linkedPost.title} 🌸</span>
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
