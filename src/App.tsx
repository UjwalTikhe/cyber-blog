import { useState, useEffect, useMemo } from 'react';
import type { Post, PostCategory } from './types';
import { INITIAL_POSTS } from './data/posts';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PostCard } from './components/PostCard';
import { PostView } from './components/PostView';
import { ComposeStudio } from './components/ComposeStudio';
import { LegalModal } from './components/LegalModals';
import { Footer } from './components/Footer';

const CATEGORIES: ('All' | PostCategory)[] = [
  'All',
  'Foundations',
  'Homelab',
  'CTF & Labs',
  'Networking',
  'Blue Team',
  'Red Team',
  'Tools & Scripts',
];

export function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cyber_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        const initialIds = new Set(INITIAL_POSTS.map((p) => p.id));
        const customOnly = parsed.filter((p: Post) => !initialIds.has(p.id));
        return [...customOnly, ...INITIAL_POSTS];
      }
    } catch (e) {
      console.error('Error loading stored posts', e);
    }
    return INITIAL_POSTS;
  });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PostCategory>('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Legal Modal state (TOS & Privacy Policy)
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms',
  });

  // Local Compose Studio (localhost dev only)
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Deep linking via URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        const found = posts.find((p) => p.id === hash);
        if (found) {
          setSelectedPost(found);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [posts]);

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    window.location.hash = post.id;
  };

  const handleBackToLogs = () => {
    setSelectedPost(null);
    window.location.hash = '';
  };

  const handlePublishPost = (newPost: Post) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      try {
        localStorage.setItem('cyber_blog_posts', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to cache to localStorage', err);
      }
      return updated;
    });

    handleSelectPost(newPost);
  };

  // Filter posts based on search, category, and active tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }

      if (activeTag && !post.tags.includes(activeTag)) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesTags = post.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = post.category.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesTags || matchesCategory;
      }

      return true;
    });
  }, [posts, selectedCategory, activeTag, searchQuery]);

  // Unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-paper-subtle selection:text-ink">
      {/* Top Navbar */}
      <Navbar
        onHomeClick={handleBackToLogs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main View */}
      <div className="flex-1">
        {selectedPost ? (
          /* Single Article Reader */
          <PostView
            post={selectedPost}
            allPosts={posts}
            onBack={handleBackToLogs}
            onSelectPost={handleSelectPost}
            onTagClick={(tag) => {
              setActiveTag(tag);
              setSelectedPost(null);
            }}
          />
        ) : (
          /* Main Blog Feed */
          <>
            <HeroBanner
              postCount={posts.length}
              onExploreClick={() => {
                const feed = document.getElementById('feed-section');
                feed?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Filter & Search Ribbon */}
            <section id="feed-section" className="max-w-6xl mx-auto px-4 pt-10 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-border pb-5">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Filter articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 bg-paper-surface border border-paper-border text-xs font-mono text-ink placeholder:text-ink-light focus:outline-none focus:border-paper-darkBorder transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink font-mono text-xs"
                    >
                      [clear]
                    </button>
                  )}
                </div>

                {/* Article count */}
                <div className="text-xs font-mono text-ink-muted">
                  Indexed: <strong className="text-ink font-semibold">{filteredPosts.length}</strong> of {posts.length} dossiers
                </div>
              </div>

              {/* Category Pills Bar: Uniform, no rainbow colors, no giant pill radius */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none font-mono text-xs">
                <span className="text-ink-muted text-[11px] uppercase mr-1">Discipline:</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTag(null);
                    }}
                    className={`px-2.5 py-1 text-xs transition-colors border ${
                      selectedCategory === cat && !activeTag
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-paper-surface text-ink-muted hover:text-ink border-paper-border hover:border-paper-darkBorder'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Active Tag Filter Indicator */}
              {activeTag && (
                <div className="flex items-center gap-2 py-2 font-mono text-xs text-ink-muted">
                  <span>Tag:</span>
                  <span className="px-2 py-0.5 border border-paper-border bg-paper-surface text-ink font-bold">
                    #{activeTag}
                  </span>
                  <button
                    onClick={() => setActiveTag(null)}
                    className="underline hover:text-ink"
                  >
                    [Clear]
                  </button>
                </div>
              )}
            </section>

            {/* Articles Grid: 2-column editorial structure, not generic 3-box feature cards */}
            <main className="max-w-6xl mx-auto px-4 pb-20">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelect={handleSelectPost}
                      onTagClick={(tag) => setActiveTag(tag)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-paper-border bg-paper-surface p-8 max-w-md mx-auto space-y-3 font-sans">
                  <h3 className="font-serif font-bold text-xl text-ink">No Articles Found</h3>
                  <p className="text-xs text-ink-muted">
                    No records match "{searchQuery || activeTag}".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setActiveTag(null);
                    }}
                    className="font-mono text-xs px-3 py-1.5 border border-paper-border bg-paper hover:border-paper-darkBorder transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Tag Index */}
              <div className="mt-14 pt-6 border-t border-paper-border">
                <div className="mb-3 font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  Topic Index
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-2 py-0.5 border transition-colors ${
                        activeTag === tag
                          ? 'bg-ink text-paper border-ink'
                          : 'bg-paper-surface text-ink-muted hover:text-ink border-paper-border'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Footer with working TOS and Privacy triggers */}
      <Footer
        onOpenLegal={(type) => setLegalModal({ isOpen: true, type })}
      />

      {/* Legal Modals (TOS and Privacy Policy) */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ isOpen: false, type: 'terms' })}
      />

      {/* Localhost Development Author Studio (Vite eliminates this completely in production) */}
      {import.meta.env.DEV && (
        <>
          <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-ink text-paper px-3 py-1 border border-paper-darkBorder text-xs font-mono">
            <span>[Local Dev]</span>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="underline hover:text-paper-surface ml-1"
            >
              + Draft Article
            </button>
          </div>

          <ComposeStudio
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            onPublish={handlePublishPost}
          />
        </>
      )}
    </div>
  );
}

export default App;
