import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Post, PostCategory } from './types';
import { INITIAL_POSTS } from './data/posts';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PostCard } from './components/PostCard';
import { PostView } from './components/PostView';
import { ComposeStudio } from './components/ComposeStudio';
import { LoginModal } from './components/LoginModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ArchiveManagerModal } from './components/ArchiveManagerModal';
import { LegalModal } from './components/LegalModals';
import { Footer } from './components/Footer';
import { isAuthorAuthenticated, logoutAuthor } from './utils/auth';

const STORAGE_KEY = 'akte511_archive_v1';

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
  // Load posts strictly from local storage; falls back to INITIAL_POSTS (empty array)
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored posts', e);
    }
    return INITIAL_POSTS;
  });

  // Author Authentication State
  const [isAuthor, setIsAuthor] = useState<boolean>(() => isAuthorAuthenticated());

  // Navigation and Search State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PostCategory>('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isArchiveManagerOpen, setIsArchiveManagerOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms',
  });

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  // Save posts to localStorage whenever updated
  const savePostsToStorage = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (err) {
      console.error('Failed to save archive to localStorage', err);
      showToast('Storage warning: could not write to browser storage.');
    }
  };

  // Keyboard shortcut to toggle Author Login: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAuthor) {
          showToast('Author session currently active.');
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthor, showToast]);

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

  // Author CRUD Handlers
  const handlePublishOrUpdatePost = (postPayload: Post, isEdit: boolean) => {
    if (isEdit) {
      const updated = posts.map((p) => (p.id === postPayload.id ? postPayload : p));
      savePostsToStorage(updated);
      setSelectedPost(postPayload);
      showToast(`Akte ${String(postPayload.akteNumber).padStart(3, '0')} updated.`);
    } else {
      const updated = [postPayload, ...posts];
      savePostsToStorage(updated);
      handleSelectPost(postPayload);
      showToast(`Akte ${String(postPayload.akteNumber).padStart(3, '0')} published to archive.`);
    }
    setEditingPost(null);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setIsComposeOpen(true);
  };

  const handleConfirmDelete = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    const updated = posts.filter((p) => p.id !== postId);
    savePostsToStorage(updated);
    setPostToDelete(null);

    if (selectedPost?.id === postId) {
      handleBackToLogs();
    }
    const numDisplay = target ? String(target.akteNumber ?? target.episode ?? '').padStart(3, '0') : '';
    showToast(`Akte ${numDisplay} removed from archive.`);
  };

  const handleLogout = () => {
    logoutAuthor();
    setIsAuthor(false);
    showToast('Author session locked.');
  };

  const handleImportArchive = (imported: Post[]) => {
    savePostsToStorage(imported);
    showToast(`Archive restored: ${imported.length} entries loaded.`);
  };

  const handleResetArchive = () => {
    savePostsToStorage([]);
    handleBackToLogs();
    showToast('Archive reset to zero entries.');
  };

  // Filter posts
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-ink text-paper text-xs font-mono px-3.5 py-2 border border-paper-darkBorder shadow-none flex items-center gap-2 animate-in fade-in duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onHomeClick={handleBackToLogs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAuthor={isAuthor}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onNewPostClick={() => {
          setEditingPost(null);
          setIsComposeOpen(true);
        }}
        onOpenArchiveManager={() => setIsArchiveManagerOpen(true)}
      />

      {/* Main View Area */}
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
            isAuthor={isAuthor}
            onEditPost={handleStartEdit}
            onDeletePost={(post) => setPostToDelete(post)}
          />
        ) : (
          /* Main Feed */
          <>
            <HeroBanner
              postCount={posts.length}
              onExploreClick={() => {
                const feed = document.getElementById('feed-section');
                feed?.scrollIntoView({ behavior: 'smooth' });
              }}
              isAuthor={isAuthor}
              onNewPostClick={() => {
                setEditingPost(null);
                setIsComposeOpen(true);
              }}
              onLoginClick={() => setIsLoginModalOpen(true)}
            />

            {/* Filter Ribbon (shown when posts exist) */}
            {posts.length > 0 && (
              <section id="feed-section" className="max-w-6xl mx-auto px-4 pt-10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-border pb-5">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="Search dossiers..."
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

                {/* Category Pills Bar */}
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
                    <span>Active Tag:</span>
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
            )}

            {/* Articles Grid / Empty State */}
            <main className="max-w-6xl mx-auto px-4 pb-20 pt-4">
              {posts.length === 0 ? (
                /* Poetic, pristine empty state */
                <div className="border border-paper-blushBorder bg-paper-blush p-8 sm:p-14 max-w-xl mx-auto text-center space-y-5 my-8">
                  <div className="font-mono text-xs font-bold text-crimson uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <span>✦</span>
                    <span>AKTE 511 // AUTEUR JOURNAL INITIALIZATION</span>
                  </div>

                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink tracking-tight">
                    The Journal Begins at Episode 001
                  </h2>

                  <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-md mx-auto">
                    The personal archive is prepared and waiting for its first record. Every cybersecurity journey begins with a curious mind, an open terminal, and verifiable proof-of-work.
                  </p>

                  <div className="pt-2">
                    {isAuthor ? (
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setIsComposeOpen(true);
                        }}
                        className="px-6 py-2.5 bg-crimson text-paper font-mono text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        [ + Pen Episode 001 Now ]
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="px-6 py-2 bg-ink text-paper font-mono text-xs font-bold hover:bg-ink-muted transition-colors"
                      >
                        [ Author Access &rarr; Sign In to Pen First Entry ]
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-paper-border text-[11px] font-mono text-ink-muted">
                    Hot-key shortcut: press <kbd className="border border-paper-border px-1 py-0.5 bg-paper">Ctrl</kbd> + <kbd className="border border-paper-border px-1 py-0.5 bg-paper">Shift</kbd> + <kbd className="border border-paper-border px-1 py-0.5 bg-paper">A</kbd> anytime to open author authentication.
                  </div>
                </div>
              ) : filteredPosts.length > 0 ? (
                /* Active 2-column editorial grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelect={handleSelectPost}
                      onTagClick={(tag) => setActiveTag(tag)}
                      isAuthor={isAuthor}
                      onEdit={handleStartEdit}
                      onDelete={(post) => setPostToDelete(post)}
                    />
                  ))}
                </div>
              ) : (
                /* Search zero results */
                <div className="text-center py-16 border border-paper-border bg-paper-surface p-8 max-w-md mx-auto space-y-3 font-sans">
                  <h3 className="font-serif font-bold text-xl text-ink">No Records Found</h3>
                  <p className="text-xs text-ink-muted">
                    No articles match "{searchQuery || activeTag}".
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

              {/* Tag Index (if tags exist) */}
              {allTags.length > 0 && (
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
              )}
            </main>
          </>
        )}
      </div>

      {/* Footer with TOS and Privacy triggers */}
      <Footer
        onOpenLegal={(type) => setLegalModal({ isOpen: true, type })}
      />

      {/* Author Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthor(true);
          showToast('Author credentials verified. Full access active.');
        }}
      />

      {/* Author Compose / Edit Studio */}
      <ComposeStudio
        isOpen={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false);
          setEditingPost(null);
        }}
        onPublish={handlePublishOrUpdatePost}
        initialPost={editingPost}
        suggestedEpisodeNumber={posts.length + 1}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        post={postToDelete}
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Archive Manager (Backup, JSON sync, Passphrase update) */}
      <ArchiveManagerModal
        isOpen={isArchiveManagerOpen}
        onClose={() => setIsArchiveManagerOpen(false)}
        posts={posts}
        onImportArchive={handleImportArchive}
        onResetArchive={handleResetArchive}
      />

      {/* Legal Modals (TOS and Privacy Policy) */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ isOpen: false, type: 'terms' })}
      />
    </div>
  );
}

export default App;
