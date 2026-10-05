import type { Post, PostCategory, PostDifficulty } from '../types';
import { Calendar, Clock, ArrowRight, Shield, Terminal, HardDrive, Network, Eye, Crosshair, Wrench } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
  onTagClick?: (tag: string) => void;
}

const categoryIcons: Record<PostCategory, React.ReactNode> = {
  'Foundations': <Shield className="w-3.5 h-3.5 text-emerald-400" />,
  'Homelab': <HardDrive className="w-3.5 h-3.5 text-amber-400" />,
  'CTF & Labs': <Crosshair className="w-3.5 h-3.5 text-rose-400" />,
  'Networking': <Network className="w-3.5 h-3.5 text-cyan-400" />,
  'Blue Team': <Eye className="w-3.5 h-3.5 text-blue-400" />,
  'Red Team': <Terminal className="w-3.5 h-3.5 text-red-400" />,
  'Tools & Scripts': <Wrench className="w-3.5 h-3.5 text-purple-400" />,
};

const categoryColors: Record<PostCategory, string> = {
  'Foundations': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'Homelab': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  'CTF & Labs': 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  'Networking': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  'Blue Team': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  'Red Team': 'text-red-400 border-red-500/30 bg-red-500/10',
  'Tools & Scripts': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
};

const difficultyColors: Record<PostDifficulty, string> = {
  'Beginner': 'text-emerald-300 border-emerald-800/60 bg-emerald-950/40',
  'Intermediate': 'text-amber-300 border-amber-800/60 bg-amber-950/40',
  'Advanced': 'text-rose-300 border-rose-800/60 bg-rose-950/40',
};

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, onTagClick }) => {
  return (
    <article
      onClick={() => onSelect(post)}
      className="group relative bg-cyber-card/70 hover:bg-cyber-cardHover border border-cyber-border hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-cyber-sm hover:shadow-cyber-glow-emerald"
    >
      <div className="space-y-4">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
                categoryColors[post.category] || 'text-slate-300 border-slate-700 bg-slate-800/50'
              }`}
            >
              {categoryIcons[post.category]}
              <span>{post.category}</span>
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                difficultyColors[post.difficulty]
              }`}
            >
              {post.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {/* Footer: Tags and Action Link */}
      <div className="pt-5 mt-5 border-t border-cyber-border/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 bg-cyber-surface px-2 py-0.5 rounded border border-cyber-border hover:border-emerald-500/30 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 group-hover:translate-x-1 transition-transform ml-auto">
          <span>Read Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};
