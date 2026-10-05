import type { Post, PostCategory, PostDifficulty } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
  onTagClick?: (tag: string) => void;
}

const categoryEmojis: Record<PostCategory, string> = {
  'Foundations': '🌸',
  'Homelab': '🏠',
  'CTF & Labs': '🚩',
  'Networking': '📡',
  'Blue Team': '🛡️',
  'Red Team': '⚔️',
  'Tools & Scripts': '✨',
};

const categoryStyles: Record<PostCategory, string> = {
  'Foundations': 'text-pink-700 bg-pink-100/70 border-pink-200',
  'Homelab': 'text-amber-700 bg-amber-100/70 border-amber-200',
  'CTF & Labs': 'text-rose-700 bg-rose-100/70 border-rose-200',
  'Networking': 'text-sky-700 bg-sky-100/70 border-sky-200',
  'Blue Team': 'text-indigo-700 bg-indigo-100/70 border-indigo-200',
  'Red Team': 'text-purple-700 bg-purple-100/70 border-purple-200',
  'Tools & Scripts': 'text-teal-700 bg-teal-100/70 border-teal-200',
};

const difficultyStyles: Record<PostDifficulty, string> = {
  'Beginner': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Intermediate': 'text-amber-700 bg-amber-50 border-amber-200',
  'Advanced': 'text-rose-700 bg-rose-50 border-rose-200',
};

const difficultyEmojis: Record<PostDifficulty, string> = {
  'Beginner': '🐾',
  'Intermediate': '🎀',
  'Advanced': '🔥',
};

export const PostCard = ({ post, onSelect, onTagClick }: PostCardProps) => {
  return (
    <article
      onClick={() => onSelect(post)}
      className="group relative bg-white hover:bg-pink-50/20 border border-pink-100 hover:border-pink-300 rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-cute-sm hover:shadow-cute-card hover:-translate-y-1"
    >
      <div className="space-y-4">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold border ${
                categoryStyles[post.category] || 'text-slate-700 bg-slate-100 border-slate-200'
              }`}
            >
              <span>{categoryEmojis[post.category]}</span>
              <span>{post.category}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold border ${
                difficultyStyles[post.difficulty]
              }`}
            >
              <span>{difficultyEmojis[post.difficulty]}</span>
              <span>{post.difficulty}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>{post.date}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-sans">
          {post.excerpt}
        </p>
      </div>

      {/* Footer: Tags and Action Link */}
      <div className="pt-5 mt-5 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
              className="text-[11px] font-sans font-semibold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-full border border-pink-200 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 font-sans text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform ml-auto">
          <span>Read log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};
