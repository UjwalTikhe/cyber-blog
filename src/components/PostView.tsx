import { useEffect, useState, useMemo } from 'react';
import type { Post } from '../types';
import { renderMarkdown, extractToc, highlightAllCodeBlocks } from '../utils/markdown';
import { 
  ArrowLeft, Calendar, Clock, Share2, Check, Copy, 
  ChevronRight, Tag, BookOpen, Lightbulb, ShieldCheck
} from 'lucide-react';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

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

    const preBlocks = document.querySelectorAll('.post-content pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const codeElement = pre.querySelector('code');
      const textToCopy = codeElement ? codeElement.innerText : (pre as HTMLElement).innerText;

      const button = document.createElement('button');
      button.className = 'code-copy-btn absolute top-3 right-3 px-3 py-1 rounded-full bg-white hover:bg-pink-50 text-[11px] font-sans font-bold text-rose-600 border border-pink-200 flex items-center gap-1 transition-all shadow-sm z-10';
      button.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy';

      button.addEventListener('click', () => {
        navigator.clipboard.writeText(textToCopy);
        button.innerHTML = '<svg class="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        button.classList.add('bg-pink-100');
        setTimeout(() => {
          button.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy';
          button.classList.remove('bg-pink-100');
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
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-pink-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Navigation Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-100">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-sans font-bold text-xs text-rose-600 hover:text-rose-800 bg-white hover:bg-pink-50 px-4 py-2 rounded-full border border-pink-200 transition-all shadow-cute-pill group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>&larr; Back to all writeups</span>
          </button>

          <div className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-500">
            {post.episode && (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                Episode {post.episode < 10 ? `0${post.episode}` : post.episode}
              </span>
            )}
            <span className="text-slate-400">•</span>
            <span>Technical Writeup</span>
          </div>
        </div>

        {/* Post Hero Header */}
        <header className="mb-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-sans font-bold border border-rose-200">
              {post.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-sans font-semibold border border-slate-200">
              Level: {post.difficulty}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.date}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans border-l-4 border-rose-400 pl-4 py-1 bg-pink-50/40 rounded-r-2xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="text-xs font-sans font-semibold text-rose-600 hover:text-rose-800 bg-white px-3 py-1 rounded-full border border-pink-200 hover:border-pink-400 transition-colors flex items-center gap-1 shadow-cute-pill"
              >
                <Tag className="w-3 h-3 text-rose-400" />
                <span>#{tag}</span>
              </button>
            ))}
          </div>
        </header>

        {/* 16:9 Thumbnail Cover Hero */}
        {post.thumbnailUrl && (
          <div className="mb-10 rounded-3xl overflow-hidden border border-pink-200 shadow-cute-card bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* YouTube Video Embed (if companion video exists) */}
        {embedUrl && (
          <div className="mb-10 bg-white border border-pink-200 rounded-3xl p-6 shadow-cute-card space-y-4">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-slate-900">
              <svg className="w-5 h-5 fill-red-600" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Watch Companion Video Episode (YouTube)</span>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-pink-100 shadow-sm">
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

        {/* Dedicated Feynman Technique Highlight Box */}
        {post.feynmanSummary && (
          <div className="mb-10 bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-purple-50/80 border border-rose-200 rounded-3xl p-6 shadow-cute-sm space-y-2">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-rose-800">
              <Lightbulb className="w-5 h-5 text-rose-500 fill-rose-200" />
              <span>THE FEYNMAN TECHNIQUE (CORE INSIGHT)</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
              "{post.feynmanSummary}"
            </p>
          </div>
        )}

        {/* Main Content Grid: Article Body + Table of Contents Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article Body */}
          <main className="lg:col-span-8 bg-white border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-cute-card">
            <div
              className="post-content prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-slate-700 prose-li:text-slate-700 prose-pre:relative"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Post End Actions & Share */}
            <div className="mt-14 pt-8 border-t border-pink-100 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-pink-50/50 border border-pink-200 p-5 rounded-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-pink-200 flex items-center justify-center text-rose-600 shadow-cute-pill">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900">End of Transmission</div>
                    <div className="text-xs text-slate-500 font-sans">Documented as part of the 100-Day Cybersecurity Roadmap.</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-pink-200 text-xs font-sans font-bold text-slate-700 hover:text-rose-600 hover:border-pink-400 transition-all shadow-cute-pill"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-rose-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-sans font-bold hover:bg-rose-600 transition-all shadow-cute-pill"
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
                    className="p-5 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 text-left transition-all group shadow-cute-sm hover:shadow-cute-card hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-sans font-bold text-rose-600 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous Writeup</span>
                    </div>
                    <div className="text-sm font-display font-bold text-slate-900 group-hover:text-rose-600 transition-colors mt-1 line-clamp-1">
                      {prevPost.title}
                    </div>
                  </button>
                ) : <div />}

                {nextPost ? (
                  <button
                    onClick={() => onSelectPost(nextPost)}
                    className="p-5 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 text-right transition-all group shadow-cute-sm hover:shadow-cute-card hover:-translate-y-0.5 ml-auto w-full"
                  >
                    <div className="text-[11px] font-sans font-bold text-rose-600 flex items-center justify-end gap-1">
                      <span>Next Writeup</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-sm font-display font-bold text-slate-900 group-hover:text-rose-600 transition-colors mt-1 line-clamp-1">
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
              <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-cute-card">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-pink-100 font-display font-bold text-xs text-slate-800">
                  <BookOpen className="w-4 h-4 text-rose-500" />
                  <span>TABLE OF CONTENTS</span>
                </div>
                <nav className="space-y-2 text-xs font-sans font-medium">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-1 transition-colors ${
                        item.level === 3 ? 'pl-4 text-slate-500' : 'text-slate-700'
                      } ${
                        activeHeading === item.id
                          ? 'text-rose-600 font-bold bg-rose-50 px-2 rounded-lg'
                          : 'hover:text-rose-600'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author Bio Card */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-cute-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 border border-pink-200 flex items-center justify-center font-display font-bold text-rose-600 text-lg shadow-cute-pill">
                  0xU
                </div>
                <div>
                  <div className="font-display font-bold text-slate-900 text-base">Security Researcher</div>
                  <div className="text-xs font-sans font-bold text-rose-600">@Journey Day 1</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Learning defensive and offensive engineering in public using the Feynman technique. Documenting lab walkthroughs, protocol dissections, and certification milestones.
              </p>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-[11px] font-sans font-semibold text-slate-500">
                <span>Lab OS: Kali Linux</span>
                <span className="text-rose-600">100-Day Tracker</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
