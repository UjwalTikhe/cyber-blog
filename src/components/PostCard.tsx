import type { Post, PostCategory, PostDifficulty } from '../types';
import { Calendar, ArrowRight, Play } from 'lucide-react';

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
      className="group relative bg-white hover:bg-pink-50/20 border border-pink-100 hover:border-pink-300 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-cute-sm hover:shadow-cute-card hover:-translate-y-1.5"
    >
      {/* 16:9 Thumbnail Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 border-b border-pink-100">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100">
            <span className="text-4xl">{categoryEmojis[post.category]}</span>
            <div className="font-display font-bold text-sm text-pink-700">
              {post.category} &bull; EP. {post.episode || '01'}
            </div>
          </div>
        )}

        {/* Floating Episode Sticker */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {post.episode && (
            <span className="px-3 py-1 rounded-full bg-pink-500/90 backdrop-blur-md text-white font-sans text-[11px] font-extrabold tracking-wider shadow-sm">
              ★ EPISODE {post.episode < 10 ? `0${post.episode}` : post.episode} ★
            </span>
          )}

          {post.youtubeUrl && (
            <span className="px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-md text-white font-sans text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <Play className="w-3 h-3 fill-current" />
              <span>VLOG</span>
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-sans font-bold shadow-sm">
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Category & Difficulty Badges */}
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

            <div className="flex items-center gap-1 text-xs font-sans text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>{post.date}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 font-sans">
            {post.excerpt}
          </p>

          {/* Cute Feynman ELI5 Callout Preview */}
          {post.feynmanSummary && (
            <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200/80 text-[11px] font-sans text-pink-800 flex items-start gap-2">
              <span className="text-base leading-none">💡</span>
              <div className="line-clamp-2 leading-relaxed">
                <strong className="font-bold">Feynman Takeaway: </strong>
                {post.feynmanSummary}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Tags and Action Link */}
        <div className="pt-4 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
                className="text-[11px] font-sans font-semibold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 font-sans text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform ml-auto">
            <span>Read Episode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};
