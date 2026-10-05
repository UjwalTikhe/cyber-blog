import { useState, useMemo, useEffect } from 'react';
import type { Post, PostCategory, PostDifficulty } from '../types';
import { calculateReadTime, renderMarkdown } from '../utils/markdown';

interface ComposeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: Post, isEdit: boolean) => void;
  initialPost?: Post | null;
  suggestedEpisodeNumber: number;
}

const DEFAULT_TEMPLATE = `# Akte 001: [Title of Your Discovery]

Write a brief, honest opening about what you set out to investigate or build today.

---

## 1. First Principles Breakdown (Feynman Technique)

Break down the core concept in simple terms, as if explaining to a curious friend who has never touched a terminal. What is the fundamental mechanism at work?

---

## 2. Lab Setup & Hands-on Simulation

Document your exact test environment:
- Environment: Kali Linux / VM / Docker Container
- Target IP: 192.168.56.x (Isolated Host-Only Subnet)
- Tools: Nmap, Wireshark, Python, etc.

\`\`\`bash
# Commands executed during the simulation
\`\`\`

---

## 3. Observations & Key Takeaways

Record what surprised you, what broke, and what mitigation prevents this vulnerability.
`;

export const ComposeStudio = ({
  isOpen,
  onClose,
  onPublish,
  initialPost,
  suggestedEpisodeNumber,
}: ComposeStudioProps) => {
  const isEditing = Boolean(initialPost);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('Foundations');
  const [difficulty, setDifficulty] = useState<PostDifficulty>('Beginner');
  const [tagsStr, setTagsStr] = useState('foundations, lab-notes, feynman');
  const [excerpt, setExcerpt] = useState('');
  const [markdown, setMarkdown] = useState(DEFAULT_TEMPLATE);
  const [episode, setEpisode] = useState<number>(1);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [feynmanSummary, setFeynmanSummary] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copiedMd, setCopiedMd] = useState(false);

  // Initialize form when opening or changing initialPost
  useEffect(() => {
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
    } else {
      setTitle('');
      setCategory('Foundations');
      setDifficulty('Beginner');
      setTagsStr('foundations, cybersecurity, feynman');
      setExcerpt('');
      setMarkdown(DEFAULT_TEMPLATE);
      setEpisode(suggestedEpisodeNumber > 0 ? suggestedEpisodeNumber : 1);
      setThumbnailUrl('');
      setYoutubeUrl('');
      setFeynmanSummary('');
    }
  }, [initialPost, suggestedEpisodeNumber, isOpen]);

  // Auto-generate slug
  const slug = useMemo(() => {
    if (initialPost) return initialPost.id;
    if (!title.trim()) return `akte-${String(episode).padStart(3, '0')}-entry`;
    const clean = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `akte-${String(episode).padStart(3, '0')}-${clean}`;
  }, [title, episode, initialPost]);

  const readTime = useMemo(() => calculateReadTime(markdown), [markdown]);
  const previewHtml = useMemo(() => renderMarkdown(markdown), [markdown]);

  if (!isOpen) return null;

  // Handle local image file upload (convert to Base64 Data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image exceeds 2MB limit. Please choose a smaller image.');
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

  // Generate minimalist editorial SVG plate if author has no custom thumbnail
  const handleGenerateCover = () => {
    const epDisplay = String(episode).padStart(3, '0');
    const safeTitle = (title.trim() || 'Akte Research Dossier')
      .replace(/[<>&"]/g, '');

    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675"><rect width="1200" height="675" fill="%23f2f0ea"/><rect x="40" y="40" width="1120" height="595" fill="none" stroke="%23dfdbd0" stroke-width="2"/><text x="80" y="110" font-family="monospace" font-size="16" letter-spacing="4" fill="%23881337" font-weight="bold">AKTE 511 // RESEARCH LEDGER</text><text x="80" y="240" font-family="serif" font-size="72" font-weight="bold" fill="%231c1917">Akte ${epDisplay}</text><text x="80" y="320" font-family="serif" font-size="32" fill="%2344403c">${safeTitle.slice(0, 48)}</text><line x1="80" y1="520" x2="1120" y2="520" stroke="%23dfdbd0" stroke-width="1"/><text x="80" y="565" font-family="monospace" font-size="14" fill="%2378716c">DISCIPLINE: ${category.toUpperCase()} // LEVEL: ${difficulty.toUpperCase()}</text><text x="1120" y="565" text-anchor="end" font-family="monospace" font-size="14" fill="%2378716c">AUTEUR VERIFIED</text></svg>`;
    setThumbnailUrl(svg);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for this dossier.');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const today = initialPost?.date || new Date().toISOString().split('T')[0];

    // If no thumbnail, auto-generate clean editorial plate
    let finalThumbnail = thumbnailUrl.trim();
    if (!finalThumbnail) {
      const epDisplay = String(episode).padStart(3, '0');
      const safeTitle = title.trim().replace(/[<>&"]/g, '');
      finalThumbnail = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675"><rect width="1200" height="675" fill="%23f2f0ea"/><rect x="40" y="40" width="1120" height="595" fill="none" stroke="%23dfdbd0" stroke-width="2"/><text x="80" y="110" font-family="monospace" font-size="16" letter-spacing="4" fill="%23881337" font-weight="bold">AKTE 511 // RESEARCH LEDGER</text><text x="80" y="240" font-family="serif" font-size="72" font-weight="bold" fill="%231c1917">Akte ${epDisplay}</text><text x="80" y="320" font-family="serif" font-size="32" fill="%2344403c">${safeTitle.slice(0, 48)}</text><line x1="80" y1="520" x2="1120" y2="520" stroke="%23dfdbd0" stroke-width="1"/><text x="80" y="565" font-family="monospace" font-size="14" fill="%2378716c">DISCIPLINE: ${category.toUpperCase()} // LEVEL: ${difficulty.toUpperCase()}</text><text x="1120" y="565" text-anchor="end" font-family="monospace" font-size="14" fill="%2378716c">AUTEUR VERIFIED</text></svg>`;
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

    onPublish(postPayload, isEditing);
    onClose();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex flex-col p-2 sm:p-4">
      <div className="bg-paper border border-paper-border flex flex-col h-full max-w-7xl mx-auto w-full overflow-hidden">
        {/* Top Studio Header */}
        <div className="px-6 py-3 border-b border-paper-border flex flex-wrap items-center justify-between gap-3 bg-paper-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-crimson uppercase tracking-wider">
              [ ✦ AUTEUR STUDIO // {isEditing ? `REVISING AKTE ${String(episode).padStart(3, '0')}` : 'PENNING NEW DOSSIER'} ]
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* View Mode Buttons */}
            <div className="flex items-center border border-paper-border">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 transition-colors ${
                  viewMode === 'edit' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 transition-colors border-l border-paper-border ${
                  viewMode === 'split' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 transition-colors border-l border-paper-border ${
                  viewMode === 'preview' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1 border border-paper-border bg-paper text-ink hover:bg-paper-subtle transition-colors"
            >
              {copiedMd ? 'Copied' : 'Copy .md'}
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1 bg-crimson text-paper hover:opacity-90 transition-opacity font-bold"
            >
              {isEditing ? 'Save Changes' : 'Publish Dossier &rarr;'}
            </button>

            <button
              onClick={onClose}
              className="px-2.5 py-1 border border-paper-border text-ink-muted hover:text-ink transition-colors ml-1"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="p-4 border-b border-paper-border bg-paper-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs font-mono">
          <div className="lg:col-span-1 space-y-1">
            <label className="text-ink font-bold">AKTE #</label>
            <input
              type="number"
              min="1"
              max="511"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none text-center font-bold"
            />
          </div>

          <div className="lg:col-span-5 space-y-1">
            <label className="text-ink font-bold font-sans">TITLE *</label>
            <input
              type="text"
              placeholder="e.g. Akte 001: The Geometry of Cryptographic Ciphers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
            />
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="text-ink font-bold font-sans">DISCIPLINE</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
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
            <label className="text-ink font-bold font-sans">COMPLEXITY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PostDifficulty)}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
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
                [Auto-Generate Plate]
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="URL or use Auto/Upload..."
                value={thumbnailUrl.startsWith('data:') ? '[Embedded Plate Plate]' : thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono text-[11px]"
              />
              <label className="px-2 py-1.5 border border-paper-border bg-paper hover:bg-paper-surface cursor-pointer text-[10px] shrink-0">
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
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono"
            />
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">TAGS (COMMA-SEPARATED)</label>
            <input
              type="text"
              placeholder="cryptography, packets, kali"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">EXCERPT (1-2 SENTENCE SYNOPSIS)</label>
            <input
              type="text"
              placeholder="A brief overview of today's laboratory findings..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">FEYNMAN SUMMARY (INTUITIVE TAKEAWAY)</label>
            <input
              type="text"
              placeholder="Explain the core mechanism in simple, accessible language..."
              value={feynmanSummary}
              onChange={(e) => setFeynmanSummary(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Editor & Preview Panes */}
        <div className="flex-1 flex overflow-hidden">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex flex-col border-r border-paper-border ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Markdown Body</span>
                <span>{readTime} &bull; {markdown.split(/\s+/).filter(Boolean).length} words</span>
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
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted">
                Dossier Preview
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
