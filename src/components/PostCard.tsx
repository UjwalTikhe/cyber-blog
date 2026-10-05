import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
  onTagClick?: (tag: string) => void;
  isAuthor?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const PostCard = ({
  post,
  onSelect,
  onTagClick,
  isAuthor = false,
  onEdit,
  onDelete,
}: PostCardProps) => {
  const akteNum = post.akteNumber ?? post.episode ?? 1;
  const akteDisplay = `AKTE ${String(akteNum).padStart(3, '0')}`;

  return (
    <article
      onClick={() => onSelect(post)}
      className="group bg-paper-blush/60 hover:bg-paper-surface border border-paper-blushBorder hover:border-paper-darkBorder rounded-sm transition-colors cursor-pointer flex flex-col justify-between relative"
    >
      {/* 16:9 Thumbnail Frame */}
      {post.thumbnailUrl && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-paper-border bg-paper-subtle">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {post.youtubeUrl && (
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-ink text-paper text-[10px] font-mono tracking-wider">
              VIDEO LOG
            </div>
          )}
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink bg-paper px-2 py-0.5 border border-paper-border">
                {akteDisplay}
              </span>
              <span className="text-ink-muted">/</span>
              <span>{post.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>{post.date}</span>
              <span>&bull;</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink group-hover:text-crimson transition-colors leading-tight">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-ink-muted text-sm leading-relaxed font-sans line-clamp-2">
            {post.excerpt}
          </p>

          {/* Feynman Takeaway Box */}
          {post.feynmanSummary && (
            <div className="p-3 border border-paper-border bg-paper rounded-sm text-xs font-sans text-ink space-y-1">
              <div className="font-mono text-[10px] uppercase font-bold text-crimson tracking-wider">
                [ ✦ Feynman Intuition Breakdown ]
              </div>
              <p className="leading-relaxed text-ink-muted">
                {post.feynmanSummary}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Tags, Author CRUD controls, and Read Link */}
        <div className="pt-4 border-t border-paper-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
                className="font-mono text-[11px] text-ink-muted hover:text-ink px-1.5 py-0.5 border border-paper-border bg-paper transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto font-mono text-xs">
            {/* Author Controls */}
            {isAuthor && (
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEdit) onEdit(post);
                  }}
                  className="px-2 py-0.5 border border-paper-border bg-paper text-ink hover:border-paper-darkBorder transition-colors text-[11px]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(post);
                  }}
                  className="px-2 py-0.5 border border-crimson/40 text-crimson hover:bg-crimson hover:text-paper transition-colors text-[11px]"
                >
                  Delete
                </button>
              </div>
            )}

            <div className="font-semibold text-crimson group-hover:text-ink transition-colors">
              [ Read dossier &rarr; ]
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
