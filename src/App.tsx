import { useState, useEffect, useMemo } from 'react';
import type { Post, PostCategory, JourneyMilestone, ArsenalTool } from './types';
import { INITIAL_POSTS, INITIAL_MILESTONES, INITIAL_ARSENAL } from './data/posts';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PostCard } from './components/PostCard';
import { PostView } from './components/PostView';
import { JourneyTimeline } from './components/JourneyTimeline';
import { ArsenalView } from './components/ArsenalView';
import { ComposeStudio } from './components/ComposeStudio';
import { TerminalModal } from './components/TerminalModal';
import { Footer } from './components/Footer';
import { Search, Filter, Shield, Tag, X, PlusCircle } from 'lucide-react';

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
  // Posts state initialized from localStorage + defaults
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cyber_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Combine custom posts with initial posts (avoiding duplicate IDs)
        const initialIds = new Set(INITIAL_POSTS.map((p) => p.id));
        const customOnly = parsed.filter((p: Post) => !initialIds.has(p.id));
        return [...customOnly, ...INITIAL_POSTS];
      }
    } catch (e) {
      console.error('Error loading stored posts', e);
    }
    return INITIAL_POSTS;
  });

  const [milestones] = useState<JourneyMilestone[]>(INITIAL_MILESTONES);
  const [arsenal] = useState<ArsenalTool[]>(INITIAL_ARSENAL);

  // Navigation states
  const [currentTab, setCurrentTab] = useState<'logs' | 'timeline' | 'arsenal'>('logs');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PostCategory>('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Handle URL hash routing or deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        if (hash === 'timeline') {
          setCurrentTab('timeline');
          setSelectedPost(null);
        } else if (hash === 'arsenal') {
          setCurrentTab('arsenal');
          setSelectedPost(null);
        } else {
          const found = posts.find((p) => p.id === hash);
          if (found) {
            setSelectedPost(found);
            setCurrentTab('logs');
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [posts]);

  // Sync selectedPost with URL hash
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    window.location.hash = post.id;
  };

  const handleBackToLogs = () => {
    setSelectedPost(null);
    window.location.hash = '';
  };

  // Add new post from Compose Studio
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

    // Directly open the newly created post!
    handleSelectPost(newPost);
  };

  // Filter posts based on search, category, and active tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (activeTag && !post.tags.includes(activeTag)) {
        return false;
      }

      // Search query
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

  // All unique tags for tag cloud
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-200 flex flex-col font-sans selection:bg-emerald-500/25 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedPost(null);
        }}
        onOpenCompose={() => setIsComposeOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onHomeClick={handleBackToLogs}
      />

      {/* Main View Router */}
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
        ) : currentTab === 'timeline' ? (
          /* 100-Day Roadmap */
          <JourneyTimeline
            milestones={milestones}
            posts={posts}
            onSelectPost={handleSelectPost}
          />
        ) : currentTab === 'arsenal' ? (
          /* Tools & Homelab Specs */
          <ArsenalView arsenal={arsenal} />
        ) : (
          /* Main Feed & Logs */
          <>
            <HeroBanner
              postCount={posts.length}
              onExploreClick={() => {
                const feed = document.getElementById('feed-section');
                feed?.scrollIntoView({ behavior: 'smooth' });
              }}
              onComposeClick={() => setIsComposeOpen(true)}
            />

            {/* Filter & Search Ribbon */}
            <section id="feed-section" className="max-w-6xl mx-auto px-4 pt-10 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border pb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logs by keyword, CVE, or tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 rounded-lg bg-cyber-card border border-cyber-border focus:border-emerald-500 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Compose CTA helper */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    Showing <strong className="text-emerald-400">{filteredPosts.length}</strong> transmissions
                  </span>
                  <button
                    onClick={() => setIsComposeOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-emerald-500/40 text-xs font-mono text-slate-200 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>New Article</span>
                  </button>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                  <span>FILTER:</span>
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTag(null);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                      selectedCategory === cat && !activeTag
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-cyber-card text-slate-400 hover:text-slate-200 hover:bg-cyber-surface border border-cyber-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Active Tag Filter Indicator */}
              {activeTag && (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-xs font-mono text-slate-400">Filtering by tag:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                    #{activeTag}
                    <button onClick={() => setActiveTag(null)} className="hover:text-white ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  <button
                    onClick={() => setActiveTag(null)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-300 underline"
                  >
                    Clear tag
                  </button>
                </div>
              )}
            </section>

            {/* Articles Grid */}
            <main className="max-w-6xl mx-auto px-4 pb-20">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="text-center py-16 bg-cyber-card/40 border border-cyber-border rounded-xl p-8 max-w-lg mx-auto space-y-4">
                  <Shield className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-display font-bold text-lg text-white">No Transmissions Found</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    No articles match your query "{searchQuery || activeTag}". Try clearing filters or create a new writeup in the Studio.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setActiveTag(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-xs font-mono text-emerald-400 hover:border-emerald-500/40"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Tag Cloud Overview */}
              <div className="mt-16 pt-8 border-t border-cyber-border/60">
                <div className="flex items-center gap-2 mb-4 font-mono text-xs text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KNOWLEDGE TOPIC CLUSTER</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`text-xs font-mono px-3 py-1 rounded-md border transition-all ${
                        activeTag === tag
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-cyber-card/60 text-slate-400 hover:text-emerald-400 border-cyber-border hover:border-emerald-500/30'
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

      {/* Footer */}
      <Footer />

      {/* Compose Studio Modal */}
      <ComposeStudio
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPublish={handlePublishPost}
      />

      {/* Interactive Cyber Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        posts={posts}
        onSelectPost={handleSelectPost}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setSelectedPost(null);
        }}
      />
    </div>
  );
}

export default App;
