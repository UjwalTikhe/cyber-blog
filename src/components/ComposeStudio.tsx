import { useState, useMemo } from 'react';
import type { Post, PostCategory, PostDifficulty } from '../types';
import { calculateReadTime, renderMarkdown } from '../utils/markdown';

interface ComposeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: Post) => void;
}

const TEMPLATE_SAMPLE = `# Akte 004: [Investigation Title]

Brief introduction explaining the target machine, tool, or protocol concept being analyzed today.

---

## 1. Environment Setup & Target Specifications

- Attacking System: Kali Linux 2026.x (192.168.56.10)
- Target System: Metasploitable 2 (192.168.56.101)
- Primary Tool: Nmap / Wireshark / Burp Suite

---

## 2. Reconnaissance & Packet Inspection

\`\`\`bash
# Run service detection scan
sudo nmap -sV -sC -p 80,443 192.168.56.101
\`\`\`

> [!NOTE]
> Record observations here. What ports were found open? Any banner versions leaked?

---

## 3. Vulnerability Analysis & Exploitation

\`\`\`bash
# Exploit command or script execution
python3 exploit.py --target 192.168.56.101
\`\`\`

> [!FLAG]
> Target exploited or test flag obtained: FLAG{sample_flag_hash_here}

---

## 4. Blue Team Mitigation & Key Takeaways

1. How to patch this: Update package to latest verified release.
2. Detection Rule: Inspect web application firewall logs for traversal patterns.
`;

export const ComposeStudio = ({
  isOpen,
  onClose,
  onPublish,
}: ComposeStudioProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('CTF & Labs');
  const [difficulty, setDifficulty] = useState<PostDifficulty>('Beginner');
  const [tagsStr, setTagsStr] = useState('nmap, wireshark, tryhackme');
  const [excerpt, setExcerpt] = useState('');
  const [markdown, setMarkdown] = useState(TEMPLATE_SAMPLE);
  const [episode, setEpisode] = useState<number>(4);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [feynmanSummary, setFeynmanSummary] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copiedMd, setCopiedMd] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Auto-generate slug
  const slug = useMemo(() => {
    if (!title.trim()) return 'untitled-log';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, [title]);

  const readTime = useMemo(() => calculateReadTime(markdown), [markdown]);
  const previewHtml = useMemo(() => renderMarkdown(markdown), [markdown]);

  if (!isOpen) return null;

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const today = new Date().toISOString().split('T')[0];

    const newPost: Post = {
      id: slug,
      akteNumber: Number(episode) || 4,
      episode: Number(episode) || 4,
      title: title.trim(),
      date: today,
      category,
      difficulty,
      readTime,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      youtubeUrl: youtubeUrl.trim() || undefined,
      feynmanSummary: feynmanSummary.trim() || undefined,
      tags: tags.length ? tags : ['cybersecurity'],
      excerpt: excerpt.trim() || title.trim(),
      content: markdown,
    };

    onPublish(newPost);
    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      onClose();
    }, 1200);
  };

  const generateFullMarkdownWithFrontmatter = () => {
    const today = new Date().toISOString().split('T')[0];
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    return `---
title: "${title.replace(/"/g, '\\"') || 'Untitled Writeup'}"
akteNumber: ${episode}
date: "${today}"
category: "${category}"
difficulty: "${difficulty}"
readTime: "${readTime}"
thumbnailUrl: "${thumbnailUrl}"
youtubeUrl: "${youtubeUrl}"
feynmanSummary: "${feynmanSummary.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
excerpt: "${excerpt.replace(/"/g, '\\"') || title}"
---

${markdown}
`;
  };

  const handleDownloadMd = () => {
    const content = generateFullMarkdownWithFrontmatter();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug || 'article'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const content = generateFullMarkdownWithFrontmatter();
    navigator.clipboard.writeText(content);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex flex-col p-2 sm:p-4">
      <div className="bg-paper border border-paper-border flex flex-col h-full max-w-7xl mx-auto w-full overflow-hidden">
        {/* Top Studio Bar */}
        <div className="px-6 py-3 border-b border-paper-border flex items-center justify-between bg-paper-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Akte 511 Drafting Studio (Localhost Only)
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 border border-paper-border transition-colors ${
                viewMode === 'edit' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 border border-paper-border transition-colors ${
                viewMode === 'split' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 border border-paper-border transition-colors ${
                viewMode === 'preview' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-subtle'
              }`}
            >
              Preview
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1 border border-paper-border bg-paper text-ink hover:bg-paper-subtle transition-colors"
            >
              {copiedMd ? 'Copied' : 'Copy .md'}
            </button>

            <button
              onClick={handleDownloadMd}
              className="px-3 py-1 border border-paper-border bg-paper text-ink hover:bg-paper-subtle transition-colors"
            >
              Export
            </button>

            <button
              onClick={handlePublish}
              className="px-4 py-1 bg-ink text-paper hover:bg-ink-muted transition-colors font-bold"
            >
              {publishedSuccess ? 'Saved' : 'Save Local'}
            </button>

            <button
              onClick={onClose}
              className="px-2 py-1 border border-paper-border text-ink-muted hover:text-ink transition-colors ml-1"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Metadata Configuration Grid */}
        <div className="p-4 border-b border-paper-border bg-paper-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs font-mono">
          <div className="lg:col-span-1 space-y-1">
            <label className="text-ink font-bold">AKTE #</label>
            <input
              type="number"
              placeholder="4"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none text-center font-bold"
            />
          </div>

          <div className="lg:col-span-5 space-y-1">
            <label className="text-ink font-bold font-sans">TITLE *</label>
            <input
              type="text"
              placeholder="Akte 004: Password Recovery Internals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
            />
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="text-ink font-bold font-sans">CATEGORY</label>
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
            <label className="text-ink font-bold font-sans">DIFFICULTY</label>
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

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">THUMBNAIL URL (16:9)</label>
            <input
              type="text"
              placeholder="./thumbnails/thumb-ep4.svg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono"
            />
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">YOUTUBE URL (OPTIONAL)</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono"
            />
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-ink font-bold font-sans">TAGS</label>
            <input
              type="text"
              placeholder="hashcat, passwords, linux"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-mono"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">EXCERPT (1-2 SENTENCES)</label>
            <input
              type="text"
              placeholder="Brief summary of the test simulation..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-1.5 bg-paper border border-paper-border text-ink focus:outline-none font-sans"
            />
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-ink font-bold font-sans">FEYNMAN SUMMARY (ELI5 CORE CONCEPT)</label>
            <input
              type="text"
              placeholder="Explain the concept in simple terms..."
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
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted">
                Markdown Editor
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-4 bg-paper font-mono text-xs text-ink focus:outline-none resize-none leading-relaxed"
                placeholder="Write your article in Markdown..."
              />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex flex-col overflow-y-auto bg-paper ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 border-b border-paper-border bg-paper text-[11px] font-mono text-ink-muted">
                Live Preview
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
