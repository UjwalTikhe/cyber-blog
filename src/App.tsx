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
import { Search, Filter, Tag, X, PlusCircle, SearchX } from 'lucide-react';

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

const categoryLabels: Record<'All' | PostCategory, string> = {
  'All': 'All Topics',
  'Foundations': 'Foundations',
  'Homelab': 'Homelab',
  'CTF & Labs': 'CTF & Labs',
  'Networking': 'Networking',
  'Blue Team': 'Blue Team',
  'Red Team': 'Red Team',
  'Tools & Scripts': 'Tools & Scripts',
};

export function App() {
  // Author check: In local development, the user is the owner.
  // On production, visitors have read-only access.
  // The owner can unlock author studio locally, or with '?author=1' or '#author' if needed.
  const isOwner = useMemo(() => {
    if (import.meta.env.DEV) return true;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('author') === '1' || window.location.hash === '#author') return true;
      if (localStorage.getItem('is_blog_author') === 'true') return true;
    }
    return false;
  }, []);

  // Posts state initialized from localStorage + defaults
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
        } else if (hash === 'author') {
          // Author mode shortcut
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

  // All unique tags for tag cloud
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#faf7f9] text-[#1e1b4b] flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
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
        isOwner={isOwner}
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
              isOwner={isOwner}
            />

            {/* Filter & Search Ribbon */}
            <section id="feed-section" className="max-w-6xl mx-auto px-4 pt-10 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-100 pb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search writeups by tool, concept, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white border border-pink-200 focus:border-rose-400 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-cute-pill"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter info & Owner Compose Trigger */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans text-slate-500 font-medium">
                    Showing <strong className="text-rose-600 font-bold">{filteredPosts.length}</strong> writeups
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => setIsComposeOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-xs font-sans font-bold text-rose-600 transition-all shadow-cute-pill hover:scale-105"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>New Writeup</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                <span className="text-[11px] font-sans font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-pink-400" />
                  <span>FILTER:</span>
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTag(null);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat && !activeTag
                        ? 'bg-rose-500 text-white shadow-cute-pill'
                        : 'bg-white text-slate-600 hover:text-rose-600 hover:bg-pink-50 border border-pink-200'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>

              {/* Active Tag Filter Indicator */}
              {activeTag && (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-xs font-sans text-slate-500 font-medium">Filtering by tag:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-sans font-bold border border-rose-200">
                    #{activeTag}
                    <button onClick={() => setActiveTag(null)} className="hover:text-rose-900 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  <button
                    onClick={() => setActiveTag(null)}
                    className="text-xs font-sans font-medium text-rose-500 hover:underline"
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
                <div className="text-center py-16 bg-white border border-pink-200 rounded-3xl p-8 max-w-lg mx-auto space-y-4 shadow-cute-card">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-rose-500 flex items-center justify-center mx-auto">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900">No Writeups Found</h3>
                  <p className="text-xs text-slate-600 font-sans">
                    No articles match "{searchQuery || activeTag}". Try clearing the search filter or browsing other categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setActiveTag(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-sans font-bold text-rose-600 hover:bg-pink-100 transition-colors shadow-cute-pill"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Tag Cloud Overview */}
              <div className="mt-16 pt-8 border-t border-pink-100">
                <div className="flex items-center gap-2 mb-4 font-display font-bold text-xs text-slate-700">
                  <Tag className="w-3.5 h-3.5 text-rose-500" />
                  <span>KNOWLEDGE TOPIC CLUSTER</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`text-xs font-sans font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                        activeTag === tag
                          ? 'bg-rose-500 text-white font-bold border-rose-500 shadow-cute-pill'
                          : 'bg-white text-slate-600 hover:text-rose-600 hover:bg-pink-50 border-pink-200 shadow-sm'
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
