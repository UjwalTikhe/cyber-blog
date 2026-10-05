import { useEffect, useState, useMemo } from 'react';
import type { Post } from '../types';
import { renderMarkdown, extractToc, highlightAllCodeBlocks } from '../utils/markdown';
import { 
  ArrowLeft, Calendar, Clock, Share2, Check, Copy, 
  ShieldCheck, ChevronRight, Tag, BookOpen
} from 'lucide-react';

interface PostViewProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  onTagClick: (tag: string) => void;
}

export const PostView: React.FC<PostViewProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  onTagClick,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Extract table of contents
  const toc = useMemo(() => extractToc(post.content), [post.content]);

  // Render markdown to HTML
  const htmlContent = useMemo(() => renderMarkdown(post.content), [post.content]);

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Track scroll progress and active heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check active heading
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

    // Inject copy buttons onto all pre blocks
    const preBlocks = document.querySelectorAll('.post-content pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const codeElement = pre.querySelector('code');
      const textToCopy = codeElement ? codeElement.innerText : (pre as HTMLElement).innerText;

      const button = document.createElement('button');
      button.className = 'code-copy-btn absolute top-2 right-2 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1 transition-all opacity-70 hover:opacity-100 z-10';
      button.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy';

      button.addEventListener('click', () => {
        navigator.clipboard.writeText(textToCopy);
        button.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        button.classList.add('text-emerald-400');
        setTimeout(() => {
          button.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy';
          button.classList.remove('text-emerald-400');
        }, 2000);
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
    <div className="min-h-screen pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-cyber-border z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyber-border/70">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO TRANSMISSIONS</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>STATUS:</span>
            <span className="text-emerald-400 font-bold">DECRYPTED</span>
            <span className="text-slate-600">//</span>
            <span>ID: {post.id.slice(0, 14)}...</span>
          </div>
        </div>

        {/* Post Hero Header */}
        <header className="mb-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase">
              {post.category}
            </span>
            <span className="px-2.5 py-1 rounded bg-cyber-card border border-cyber-border text-slate-300 text-xs font-mono uppercase">
              LEVEL: {post.difficulty}
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-sans border-l-2 border-emerald-500/40 pl-4 py-1">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="text-xs font-mono text-slate-400 hover:text-emerald-400 bg-cyber-card px-2.5 py-1 rounded border border-cyber-border hover:border-emerald-500/40 transition-colors flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-emerald-500/60" />
                <span>#{tag}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Grid: Article Body + Table of Contents Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article Body */}
          <main className="lg:col-span-8">
            <div
              className="post-content prose prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-slate-300 prose-li:text-slate-300 prose-pre:relative"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Post End Actions & Feedback */}
            <div className="mt-14 pt-8 border-t border-cyber-border space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-cyber-card/60 border border-cyber-border p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">END OF TRANSMISSION</div>
                    <div className="text-xs text-slate-400 font-mono">Found this useful? Share or save it to your bookmarks.</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </a>
                </div>
              </div>

              {/* Prev / Next Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {prevPost ? (
                  <button
                    onClick={() => onSelectPost(prevPost)}
                    className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      <span>PREVIOUS WRITEUP</span>
                    </div>
                    <div className="text-sm font-display font-semibold text-white group-hover:text-emerald-400 transition-colors mt-1 line-clamp-1">
                      {prevPost.title}
                    </div>
                  </button>
                ) : <div />}

                {nextPost ? (
                  <button
                    onClick={() => onSelectPost(nextPost)}
                    className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border hover:border-emerald-500/40 text-right transition-all group ml-auto w-full"
                  >
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-end gap-1">
                      <span>NEXT WRITEUP</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-sm font-display font-semibold text-white group-hover:text-emerald-400 transition-colors mt-1 line-clamp-1">
                      {nextPost.title}
                    </div>
                  </button>
                ) : <div />}
              </div>
            </div>
          </main>

          {/* Sticky Sidebar: Table of Contents & Author Card */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-cyber-card/80 border border-cyber-border rounded-xl p-5 shadow-cyber-sm">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-cyber-border/70 font-mono text-xs font-bold text-slate-300">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>TABLE OF CONTENTS</span>
                </div>
                <nav className="space-y-1.5 text-xs font-mono">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-1 transition-colors ${
                        item.level === 3 ? 'pl-4 text-slate-400' : 'text-slate-300'
                      } ${
                        activeHeading === item.id
                          ? 'text-emerald-400 font-semibold'
                          : 'hover:text-emerald-300'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author / Operator Bio Card */}
            <div className="bg-cyber-card/80 border border-cyber-border rounded-xl p-5 shadow-cyber-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-base">
                  0xU
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">Security Researcher</div>
                  <div className="text-xs font-mono text-emerald-400">@Journey Day 1</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Learning defensive and offensive engineering in public. Building isolated virtual labs, reverse engineering protocols, and preparing for industry certifications.
              </p>

              <div className="pt-3 border-t border-cyber-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>LAB OS: Kali Linux</span>
                <span className="text-emerald-400 font-semibold">100-Day Tracker</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
