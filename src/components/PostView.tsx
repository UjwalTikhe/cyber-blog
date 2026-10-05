import { useEffect, useState, useMemo } from 'react';
import type { Post } from '../types';
import { renderMarkdown, extractToc, highlightAllCodeBlocks } from '../utils/markdown';

interface PostViewProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  onTagClick: (tag: string) => void;
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export const PostView = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  onTagClick,
}: PostViewProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  const akteNum = post.akteNumber ?? post.episode ?? 1;
  const akteDisplay = `AKTE ${String(akteNum).padStart(3, '0')}`;

  // Extract table of contents
  const toc = useMemo(() => extractToc(post.content), [post.content]);

  // Render markdown to HTML
  const htmlContent = useMemo(() => renderMarkdown(post.content), [post.content]);

  // YouTube embed url
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(post.youtubeUrl), [post.youtubeUrl]);

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Track active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
      for (const el of headingElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 0) {
            setActiveHeading(el.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  // Syntax highlighting & code copy buttons injection
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    highlightAllCodeBlocks();

    const preBlocks = document.querySelectorAll('.post-content pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const codeElement = pre.querySelector('code');
      const textToCopy = codeElement ? codeElement.innerText : (pre as HTMLElement).innerText;

      const button = document.createElement('button');
      button.className = 'code-copy-btn absolute top-2.5 right-2.5 px-2 py-0.5 bg-paper border border-paper-border text-[11px] font-mono text-ink-muted hover:text-ink transition-colors';
      button.innerText = 'Copy';

      button.addEventListener('click', () => {
        navigator.clipboard.writeText(textToCopy);
        button.innerText = 'Copied';
        setTimeout(() => {
          button.innerText = 'Copy';
        }, 1500);
      });

      pre.appendChild(button);
    });
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24 bg-paper">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Navigation Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-paper-border">
          <button
            onClick={onBack}
            className="font-mono text-xs text-ink-muted hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Back to all dossiers</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
            <span className="font-bold text-ink">
              {akteDisplay}
            </span>
            <span>/</span>
            <span>Technical Dossier</span>
          </div>
        </div>

        {/* Post Header */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-muted">
            <span className="text-ink font-semibold">
              {post.category}
            </span>
            <span>&bull;</span>
            <span>Level: {post.difficulty}</span>
            <span>&bull;</span>
            <span>{post.date}</span>
            <span>&bull;</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ink tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt with clean uniform border, no colored left stripe */}
          <div className="p-4 border border-paper-border bg-paper-surface rounded-sm text-base text-ink-muted leading-relaxed font-sans">
            {post.excerpt}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-0.5 border border-paper-border bg-paper transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </header>

        {/* 16:9 Thumbnail Cover Hero */}
        {post.thumbnailUrl && (
          <div className="mb-10 border border-paper-border bg-paper-surface">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* YouTube Video Embed (if companion video exists) */}
        {embedUrl && (
          <div className="mb-10 p-5 border border-paper-border bg-paper-surface space-y-3">
            <div className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              [ Companion Video Walkthrough: YouTube ]
            </div>
            <div className="aspect-video w-full border border-paper-border">
              <iframe
                src={embedUrl}
                title="YouTube Video Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Dedicated Feynman Technique Highlight Box: Uniform 1px border, no colored left stripe */}
        {post.feynmanSummary && (
          <div className="mb-10 p-5 border border-paper-border bg-paper-surface space-y-2">
            <div className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              [ Core Concept: First Principles Breakdown ]
            </div>
            <p className="text-sm text-ink-muted leading-relaxed font-sans">
              "{post.feynmanSummary}"
            </p>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Article Body */}
          <main className="lg:col-span-8 p-6 sm:p-8 border border-paper-border bg-paper-surface">
            <div
              className="post-content prose max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-ink prose-li:text-ink"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Post End Actions & Share */}
            <div className="mt-12 pt-6 border-t border-paper-border space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-paper-border bg-paper">
                <div className="font-mono text-xs text-ink-muted">
                  End of Dossier Record &bull; Akte 511
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="font-mono text-xs px-3 py-1 border border-paper-border bg-paper-surface text-ink hover:border-paper-darkBorder transition-colors"
                  >
                    {copiedLink ? 'Link Copied' : 'Copy Link'}
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs px-3 py-1 border border-ink bg-ink text-paper transition-colors"
                  >
                    Share
                  </a>
                </div>
              </div>

              {/* Prev / Next Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {prevPost ? (
                  <button
                    onClick={() => onSelectPost(prevPost)}
                    className="p-4 border border-paper-border bg-paper hover:border-paper-darkBorder text-left transition-colors"
                  >
                    <div className="font-mono text-[11px] text-ink-muted">
                      &larr; Previous Dossier
                    </div>
                    <div className="font-serif font-bold text-sm text-ink mt-1 line-clamp-1">
                      {prevPost.title}
                    </div>
                  </button>
                ) : <div />}

                {nextPost ? (
                  <button
                    onClick={() => onSelectPost(nextPost)}
                    className="p-4 border border-paper-border bg-paper hover:border-paper-darkBorder text-right transition-colors ml-auto w-full"
                  >
                    <div className="font-mono text-[11px] text-ink-muted">
                      Next Dossier &rarr;
                    </div>
                    <div className="font-serif font-bold text-sm text-ink mt-1 line-clamp-1">
                      {nextPost.title}
                    </div>
                  </button>
                ) : <div />}
              </div>
            </div>
          </main>

          {/* Sidebar: Table of Contents */}
          <aside className="lg:col-span-4 space-y-4">
            {toc.length > 0 && (
              <div className="p-4 border border-paper-border bg-paper-surface">
                <div className="pb-2 mb-3 border-b border-paper-border font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  Contents
                </div>
                <nav className="space-y-1.5 text-xs font-sans">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-0.5 transition-colors ${
                        item.level === 3 ? 'pl-3 text-ink-muted' : 'text-ink'
                      } ${
                        activeHeading === item.id
                          ? 'font-bold text-crimson'
                          : 'hover:text-ink'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            <div className="p-4 border border-paper-border bg-paper-surface font-mono text-xs text-ink-muted space-y-2">
              <div className="font-bold text-ink uppercase tracking-wider">Akte 511</div>
              <p className="text-[11px] leading-relaxed">
                Verifiable cybersecurity lab records, packet captures, and defensive blueprints.
              </p>
              <div className="pt-2 border-t border-paper-border text-[10px]">
                Host: VirtualBox 7.x &bull; Kali Linux
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
