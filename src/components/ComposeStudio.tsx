import { useState, useMemo, useEffect, useRef } from 'react';
import type { Post, PostCategory, PostDifficulty } from '../types';
import { calculateReadTime, renderMarkdown } from '../utils/markdown';

interface ComposeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: Post, isEdit: boolean) => void;
  initialPost?: Post | null;
  suggestedEpisodeNumber: number;
}

const DEFAULT_GIRLY_TEMPLATE = `# Akte 001: [Title of Your Discovery]

*Dear diary, today in the lab I set out to investigate...*

Write a genuine, honest opening about what caught your curiosity today.

---

## 1. First Principles Breakdown (Feynman Technique)

Explain the core mechanism in simple, accessible terms: what is actually happening behind the curtain? No unnecessary jargon—just clear logic and intuition.

---

## 2. Lab Setup & Hands-on Simulation

Document your exact test environment:
- **Workstation:** Kali Linux / Dedicated VM
- **Target Subnet:** 192.168.56.x (Isolated Host-Only Network)
- **Primary Tools:** Nmap, Wireshark, Python

\`\`\`bash
# Commands executed during the simulation
\`\`\`

---

## 3. What Broke & How to Defend It

Record what surprised you, what went wrong, and the exact blue-team configuration to harden against this attack vector.
`;

const DRAFT_STORAGE_KEY = 'akte511_composer_draft_v1';

export const ComposeStudio = ({
  isOpen,
  onClose,
  onPublish,
  initialPost,
  suggestedEpisodeNumber,
}: ComposeStudioProps) => {
  const isEditing = Boolean(initialPost);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('Foundations');
  const [difficulty, setDifficulty] = useState<PostDifficulty>('Beginner');
  const [tagsStr, setTagsStr] = useState('foundations, lab-notes, feynman');
  const [excerpt, setExcerpt] = useState('');
  const [markdown, setMarkdown] = useState(DEFAULT_GIRLY_TEMPLATE);
  const [episode, setEpisode] = useState<number>(1);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [feynmanSummary, setFeynmanSummary] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copiedMd, setCopiedMd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize or restore draft (Golden Rule 6: Permit easy reversal of actions)
  useEffect(() => {
    if (!isOpen) return;

    if (initialPost) {
      setTitle(initialPost.title);
      setCategory(initialPost.category);
      setDifficulty(initialPost.difficulty);
      setTagsStr(initialPost.tags.join(', '));
      setExcerpt(initialPost.excerpt);
      setMarkdown(initialPost.content);
      setEpisode(initialPost.akteNumber ?? initialPost.episode ?? 1);
      setThumbnailUrl(initialPost.thumbnailUrl || '');
      setYoutubeUrl(initialPost.youtubeUrl || '');
      setFeynmanSummary(initialPost.feynmanSummary || '');
      setFormError(null);
    } else {
      // Check for saved session draft if creating new
      try {
        const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setCategory(parsed.category || 'Foundations');
          setDifficulty(parsed.difficulty || 'Beginner');
          setTagsStr(parsed.tagsStr || 'foundations, lab-notes, feynman');
          setExcerpt(parsed.excerpt || '');
          setMarkdown(parsed.markdown || DEFAULT_GIRLY_TEMPLATE);
          setEpisode(suggestedEpisodeNumber > 0 ? suggestedEpisodeNumber : 1);
          setThumbnailUrl(parsed.thumbnailUrl || '');
          setYoutubeUrl(parsed.youtubeUrl || '');
          setFeynmanSummary(parsed.feynmanSummary || '');
          setFormError(null);
          return;
        }
      } catch {
        // Ignore session draft errors
      }

      // Default blank state
      setTitle('');
      setCategory('Foundations');
      setDifficulty('Beginner');
      setTagsStr('foundations, cybersecurity, feynman');
      setExcerpt('');
      setMarkdown(DEFAULT_GIRLY_TEMPLATE);
      setEpisode(suggestedEpisodeNumber > 0 ? suggestedEpisodeNumber : 1);
      setThumbnailUrl('');
      setYoutubeUrl('');
      setFeynmanSummary('');
      setFormError(null);
    }
  }, [initialPost, suggestedEpisodeNumber, isOpen]);

  // Auto-save draft to sessionStorage when author types (Golden Rule 5 & 6: Prevent errors and loss of work)
  useEffect(() => {
    if (isOpen && !isEditing) {
      try {
        const draft = {
          title,
          category,
          difficulty,
          tagsStr,
          excerpt,
          markdown,
          thumbnailUrl,
          youtubeUrl,
          feynmanSummary,
        };
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // Ignore storage exceptions
      }
    }
  }, [isOpen, isEditing, title, category, difficulty, tagsStr, excerpt, markdown, thumbnailUrl, youtubeUrl, feynmanSummary]);

  // Focus title input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-generate clean URL slug
  const slug = useMemo(() => {
    if (initialPost) return initialPost.id;
    if (!title.trim()) return `akte-${String(episode).padStart(3, '0')}-entry`;
    const clean = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `akte-${String(episode).padStart(3, '0')}-${clean}`;
  }, [title, episode, initialPost]);

  // Golden Rule 3 & 8: Real-time reading time and word count calculation
  const readTime = useMemo(() => calculateReadTime(markdown), [markdown]);
  const wordCount = useMemo(() => markdown.split(/\s+/).filter(Boolean).length, [markdown]);
  const previewHtml = useMemo(() => renderMarkdown(markdown), [markdown]);

  if (!isOpen) return null;

  // Handle local image file upload (convert to Base64 data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image exceeds 2MB limit. Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Golden Rule 5: Prevent broken images with auto-generated case plate
  const handleGenerateCover = () => {
    const epDisplay = String(episode).padStart(3, '0');
    const safeTitle = (title.trim() || 'Akte Research Dossier').replace(/[<>&"]/g, '');

    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675"><rect width="1200" height="675" fill="%23fbf5f2"/><rect x="40" y="40" width="1120" height="595" fill="none" stroke="%23e8d5ce" stroke-width="2"/><text x="80" y="115" font-family="monospace" font-size="16" letter-spacing="4" fill="%238b263e" font-weight="bold">✦ AKTE 511 // AUTEUR JOURNAL</text><text x="80" y="240" font-family="serif" font-size="76" font-weight="bold" fill="%23221e1f">Akte ${epDisplay}</text><text x="80" y="325" font-family="serif" font-size="34" fill="%2369605d" font-style="italic">${safeTitle.slice(0, 48)}</text><line x1="80" y1="520" x2="1120" y2="520" stroke="%23e8d5ce" stroke-width="1"/><text x="80" y="565" font-family="monospace" font-size="14" fill="%238b263e font-weight="bold">DISCIPLINE: ${category.toUpperCase()} // LEVEL: ${difficulty.toUpperCase()}</text><text x="1120" y="565" text-anchor="end" font-family="monospace" font-size="14" fill="%239d938f">VERIFIED AUTEUR RECORD</text></svg>`;
    setThumbnailUrl(svg);
  };

  const handleSave = () => {
    // Golden Rule 5: Error prevention validation
    if (!title.trim()) {
      setFormError('Please provide a title for this dossier.');
      titleInputRef.current?.focus();
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const today = initialPost?.date || new Date().toISOString().split('T')[0];

    // Auto-generate cover plate if empty
    let finalThumbnail = thumbnailUrl.trim();
    if (!finalThumbnail) {
      const epDisplay = String(episode).padStart(3, '0');
      const safeTitle = title.trim().replace(/[<>&"]/g, '');
      finalThumbnail = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675"><rect width="1200" height="675" fill="%23fbf5f2"/><rect x="40" y="40" width="1120" height="595" fill="none" stroke="%23e8d5ce" stroke-width="2"/><text x="80" y="115" font-family="monospace" font-size="16" letter-spacing="4" fill="%238b263e" font-weight="bold">✦ AKTE 511 // AUTEUR JOURNAL</text><text x="80" y="240" font-family="serif" font-size="76" font-weight="bold" fill="%23221e1f">Akte ${epDisplay}</text><text x="80" y="325" font-family="serif" font-size="34" fill="%2369605d" font-style="italic">${safeTitle.slice(0, 48)}</text><line x1="80" y1="520" x2="1120" y2="520" stroke="%23e8d5ce" stroke-width="1"/><text x="80" y="565" font-family="monospace" font-size="14" fill="%238b263e">DISCIPLINE: ${category.toUpperCase()} // LEVEL: ${difficulty.toUpperCase()}</text><text x="1120" y="565" text-anchor="end" font-family="monospace" font-size="14" fill="%239d938f">VERIFIED AUTEUR RECORD</text></svg>`;
    }

    const postPayload: Post = {
      id: initialPost?.id || slug,
      akteNumber: Number(episode) || 1,
      episode: Number(episode) || 1,
      title: title.trim(),
      date: today,
      category,
      difficulty,
      readTime,
      thumbnailUrl: finalThumbnail,
      youtubeUrl: youtubeUrl.trim() || undefined,
      feynmanSummary: feynmanSummary.trim() || undefined,
      tags: tags.length ? tags : ['cybersecurity'],
      excerpt: excerpt.trim() || title.trim(),
      content: markdown,
    };

    // Clear saved draft on successful publish
    if (!isEditing) {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }

    onPublish(postPayload, isEditing);
    onClose();
  };

  // Golden Rule 2: Keyboard shortcut handler (Ctrl+Enter to save, Esc to exit)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/50 flex flex-col p-2 sm:p-4 animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Auteur Drafting Studio"
    >
      <div className="bg-paper border border-paper-border flex flex-col h-full max-w-7xl mx-auto w-full overflow-hidden shadow-none">
        {/* Top Studio Bar */}
        <div className="px-5 py-3 border-b border-paper-border flex flex-wrap items-center justify-between gap-3 bg-paper">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-crimson uppercase tracking-wider flex items-center gap-1.5">
              <span>✦</span>
              <span>AUTEUR STUDIO // {isEditing ? `REVISING AKTE ${String(episode).padStart(3, '0')}` : 'NEW JOURNAL ENTRY'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* View Mode Switcher (Golden Rule 7: Keep users in control) */}
            <div className="flex items-center border border-paper-border bg-paper">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 transition-colors ${
                  viewMode === 'edit' ? 'bg-ink text-paper font-bold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 transition-colors border-l border-paper-border ${
                  viewMode === 'split' ? 'bg-ink text-paper font-bold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 transition-colors border-l border-paper-border ${
                  viewMode === 'preview' ? 'bg-ink text-paper font-bold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1 border border-paper-border bg-paper text-ink hover:bg-paper transition-colors"
              title="Copy raw markdown to clipboard"
            >
              {copiedMd ? 'Copied ✧' : 'Copy .md'}
            </button>

            {/* Save / Publish Button */}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1 bg-crimson text-paper hover:opacity-90 transition-opacity font-bold"
              title="Press Ctrl+Enter to save immediately"
            >
              {isEditing ? 'Save Revisions' : 'Publish to Archive ✦'}
            </button>

            {/* Cancel / Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 border border-paper-border text-ink-muted hover:text-ink transition-colors ml-1"
              title="Close without publishing (Esc)"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Inline Error Notice (Golden Rule 5: Error Prevention) */}
        {formError && (
          <div className="px-5 py-2 bg-crimson/10 border-b border-crimson/30 text-crimson text-xs font-mono flex items-center justify-between">
            <span>&bull; {formError}</span>
            <button onClick={() => setFormError(null)} className="underline">[dismiss]</button>
          </div>
        )}

        {/* Metadata Configuration Grid */}
        <div className="p-4 border-b border-paper-border bg-paper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs font-mono">
          <div className="lg:col-span-1 space-y-1">
            <label className="text-ink font-bold">AKTE #</label>
            <input
              type="number"
              min="1"
              max="511"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson text-center font-bold"
            />
          </div>

          <div className="lg:col-span-5 space-y-1">
            <label className="text-ink font-bold font-sans">TITLE *</label>
            <input
              ref={titleInputRef}
              type="text"
              placeholder="e.g. Akte 001: The Geometry of Cryptographic Ciphers"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-sans"
            />
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="text-ink font-bold font-sans">DISCIPLINE</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-sans"
            >
              <option value="Foundations">Foundations</option>
              <option value="Homelab">Homelab</option>
              <option value="CTF & Labs">CTF &amp; Labs</option>
              <option value="Networking">Networking</option>
              <option value="Blue Team">Blue Team</option>
              <option value="Red Team">Red Team</option>
              <option value="Tools & Scripts">Tools &amp; Scripts</option>
            </select>
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="text-ink font-bold font-sans">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PostDifficulty)}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-sans"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Thumbnail Controls */}
          <div className="lg:col-span-4 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-ink font-bold font-sans">COVER (16:9)</label>
              <button
                type="button"
                onClick={handleGenerateCover}
                className="text-[10px] text-crimson hover:underline"
              >
                [✦ Auto-Generate Case Plate]
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Image URL or Auto-Plate..."
                value={thumbnailUrl.startsWith('data:') ? '[✦ Bespoke Editorial Plate]' : thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-mono text-[11px]"
              />
              <label className="px-2 py-1.5 border border-paper-border bg-paper hover:bg-paper cursor-pointer text-[10px] shrink-0 text-ink">
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">YOUTUBE VLOG URL (OPTIONAL)</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-mono"
            />
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">TAGS (COMMA-SEPARATED)</label>
            <input
              type="text"
              placeholder="cryptography, packets, kali"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-mono"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">EXCERPT (1-2 SENTENCE SYNOPSIS)</label>
            <input
              type="text"
              placeholder="A brief reflection on today's discoveries..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-sans"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">FEYNMAN INTUITION SUMMARY (ELI5)</label>
            <input
              type="text"
              placeholder="Explain the core idea simply, as if sharing with a friend..."
              value={feynmanSummary}
              onChange={(e) => setFeynmanSummary(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none focus:border-crimson font-sans"
            />
          </div>
        </div>

        {/* Editor & Preview Panes */}
        <div className="flex-1 flex overflow-hidden">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex flex-col border-r border-paper-border ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Markdown Body</span>
                <span>{readTime} &bull; {wordCount} words &bull; <kbd className="border border-paper-border px-1 py-0.2 bg-paper">Ctrl+Enter</kbd> to save</span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-4 bg-paper font-mono text-xs text-ink focus:outline-none resize-none leading-relaxed"
                placeholder="Write your dossier in Markdown..."
              />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex flex-col overflow-y-auto bg-paper ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Live Dossier Preview</span>
                <span className="text-crimson font-semibold">✦ Formatted Output</span>
              </div>
              <div className="p-6">
                <div
                  className="prose max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-ink prose-li:text-ink"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
