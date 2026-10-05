import { useState, useMemo } from 'react';
import type { Post, PostCategory, PostDifficulty } from '../types';
import { calculateReadTime, renderMarkdown } from '../utils/markdown';
import { X, Download, Copy, Save, Check } from 'lucide-react';

interface ComposeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: Post) => void;
}

const TEMPLATE_SAMPLE = `# Day 4: [Title of Your Cute Security Lab] 🌸

Brief cozy introduction explaining the target machine or network packet concept you are investigating today! (｡♥‿♥｡)

---

## 1. Laboratory Setup & Target Info 💻

- **Attacking System:** Kali Linux 2026.x (\`192.168.56.10\`)
- **Target System:** Metasploitable 2 (\`192.168.56.101\`)
- **Primary Tool:** Nmap / Wireshark / Burp Suite

---

## 2. Reconnaissance & Enumeration 🐾

\`\`\`bash
# Run service detection scan
sudo nmap -sV -sC -p 80,443 192.168.56.101
\`\`\`

> [!NOTE]
> Record observations here. What ports were found open? Any vulnerable services leaked?

---

## 3. Vulnerability Analysis & Exploitation 🚩

\`\`\`bash
# Exploit command or script execution
python3 exploit.py --target 192.168.56.101
\`\`\`

> [!FLAG]
> Root shell obtained or flag discovered: \`THM{cute_hacker_flag_secured_✨}\`

---

## 4. Blue Team Mitigation & Key Takeaways 🛡️

1. **How to patch this:** Update package to latest secure release.
2. **Detection Rule:** Inspect web application firewall logs for traversal sequences.
`;

export const ComposeStudio = ({
  isOpen,
  onClose,
  onPublish,
}: ComposeStudioProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('CTF & Labs');
  const [difficulty, setDifficulty] = useState<PostDifficulty>('Beginner');
  const [tagsStr, setTagsStr] = useState('tryhackme, linux, recon, cute');
  const [excerpt, setExcerpt] = useState('');
  const [markdown, setMarkdown] = useState(TEMPLATE_SAMPLE);
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

  // Auto-calculate read time
  const readTime = useMemo(() => calculateReadTime(markdown), [markdown]);

  // Preview HTML
  const previewHtml = useMemo(() => renderMarkdown(markdown), [markdown]);

  if (!isOpen) return null;

  const insertSnippet = (snippet: string) => {
    setMarkdown((prev) => prev + '\n' + snippet + '\n');
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Please enter an article title dear~ 🌸');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const today = new Date().toISOString().split('T')[0];

    const newPost: Post = {
      id: slug,
      title: title.trim(),
      date: today,
      category,
      difficulty,
      readTime,
      tags: tags.length ? tags : ['cybersecurity', 'kawaii'],
      excerpt: excerpt.trim() || title.trim(),
      content: markdown,
      isCustom: true,
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
date: "${today}"
category: "${category}"
difficulty: "${difficulty}"
readTime: "${readTime}"
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-pink-200 rounded-3xl flex flex-col h-full max-w-7xl mx-auto w-full shadow-2xl overflow-hidden">
        {/* Top Studio Bar */}
        <div className="px-6 py-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-500 text-xl shadow-cute-pill">
              🌸
            </div>
            <div>
              <div className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <span>WRITEUP STUDIO</span>
                <span className="text-[11px] font-sans font-bold text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
                  LIVE COMPOSER ✨
                </span>
              </div>
              <div className="text-xs font-sans text-slate-500 font-medium">
                Write in Markdown &bull; Live Preview &bull; Export to .md or publish live~
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switches */}
            <div className="hidden md:flex bg-pink-50 p-1 rounded-full border border-pink-200 text-xs font-sans font-bold">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === 'edit' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Editor Only
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === 'split' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split Preview
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === 'preview' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Preview
              </button>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-full bg-white border border-pink-200 text-xs font-sans font-bold text-slate-700 hover:text-pink-600 transition-colors flex items-center gap-1.5 shadow-cute-pill"
              title="Copy clean markdown + frontmatter"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-pink-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedMd ? 'Copied! ✨' : 'Copy .md'}</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="px-3.5 py-2 rounded-full bg-white border border-pink-200 text-xs font-sans font-bold text-slate-700 hover:text-pink-600 transition-colors flex items-center gap-1.5 shadow-cute-pill"
              title="Download as clean .md file for your repository"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .md 🎀</span>
            </button>

            <button
              onClick={handlePublish}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-sans text-xs font-bold transition-all flex items-center gap-1.5 shadow-cute-pill hover:scale-105"
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Published! (｡♥‿♥｡)</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish to Blog 🌸</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-pink-100 text-slate-400 hover:text-slate-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Configuration Ribbon */}
        <div className="p-5 border-b border-pink-100 bg-pink-50/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs font-sans">
          <div className="lg:col-span-4 space-y-1">
            <label className="text-slate-600 font-bold">WRITEUP TITLE *</label>
            <input
              type="text"
              placeholder="e.g. Day 4: Cracking Hashes with Hashcat & John 🌸"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-pink-200 text-slate-800 focus:outline-none focus:border-pink-500 shadow-sm"
            />
          </div>

          <div className="lg:col-span-2 space-y-1">
            <label className="text-slate-600 font-bold">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-pink-200 text-slate-800 focus:outline-none focus:border-pink-500 shadow-sm"
            >
              <option value="Foundations">🌸 Foundations</option>
              <option value="Homelab">🏠 Homelab</option>
              <option value="CTF & Labs">🚩 CTF &amp; Labs</option>
              <option value="Networking">📡 Networking</option>
              <option value="Blue Team">🛡️ Blue Team</option>
              <option value="Red Team">⚔️ Red Team</option>
              <option value="Tools & Scripts">✨ Tools &amp; Scripts</option>
            </select>
          </div>

          <div className="lg:col-span-2 space-y-1">
            <label className="text-slate-600 font-bold">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PostDifficulty)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-pink-200 text-slate-800 focus:outline-none focus:border-pink-500 shadow-sm"
            >
              <option value="Beginner">🐾 Beginner</option>
              <option value="Intermediate">🎀 Intermediate</option>
              <option value="Advanced">🔥 Advanced</option>
            </select>
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-slate-600 font-bold">TAGS (COMMA SEPARATED)</label>
            <input
              type="text"
              placeholder="nmap, wireshark, tryhackme, cute"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-pink-200 text-slate-800 focus:outline-none focus:border-pink-500 shadow-sm"
            />
          </div>

          <div className="lg:col-span-12 space-y-1">
            <label className="text-slate-600 font-bold">EXCERPT / BRIEF SUMMARY</label>
            <input
              type="text"
              placeholder="A brief 1-2 sentence description shown on the cute blog card~"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-pink-200 text-slate-800 focus:outline-none focus:border-pink-500 shadow-sm"
            />
          </div>
        </div>

        {/* Quick Snippet Insert Toolbar */}
        <div className="px-6 py-2.5 border-b border-pink-100 bg-white flex flex-wrap items-center gap-2 text-xs font-sans font-bold">
          <span className="text-slate-400 text-[11px] mr-1">SNIPPETS:</span>
          <button
            onClick={() => insertSnippet('## New Section Header 🌸')}
            className="px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 transition-colors"
          >
            🌸 Heading
          </button>
          <button
            onClick={() => insertSnippet('```bash\n# Enter bash commands here\n```')}
            className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
          >
            🎀 `bash` Code
          </button>
          <button
            onClick={() => insertSnippet('> [!FLAG]\n> Flag captured: THM{your_cute_flag_here} ✨')}
            className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
          >
            🚩 Flag Alert
          </button>
          <button
            onClick={() => insertSnippet('> [!NOTE]\n> Key technical observation or protocol behavior.')}
            className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors"
          >
            ✨ Intel Note
          </button>
          <button
            onClick={() => insertSnippet('> [!WARNING]\n> Lab safety reminder! Always keep virtual networks isolated.')}
            className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
          >
            ⚠️ Caution
          </button>
          <button
            onClick={() => insertSnippet('> [!INTEL]\n> Blue team defensive mitigation & detection rule.')}
            className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
          >
            🛡️ Defense Tip
          </button>
        </div>

        {/* Main Work Area: Split Editor & Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex-1 flex flex-col border-r border-pink-100 ${viewMode === 'edit' ? 'w-full' : 'w-1/2'}`}>
              <div className="bg-pink-50/50 px-6 py-2 text-[11px] font-sans font-bold text-slate-500 border-b border-pink-100 flex justify-between items-center">
                <span>MARKDOWN SOURCE 🐾</span>
                <span>{readTime} &bull; {markdown.trim().split(/\s+/).length} words</span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your cute writeup in Markdown..."
                className="flex-1 w-full p-6 bg-white text-slate-800 font-mono text-sm resize-none focus:outline-none selection:bg-pink-200 leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex-1 flex flex-col overflow-y-auto bg-pink-50/20 p-6 ${viewMode === 'preview' ? 'w-full' : 'w-1/2'}`}>
              <div className="mb-4 pb-2 border-b border-pink-100 text-[11px] font-sans font-bold text-slate-500 flex items-center justify-between">
                <span>LIVE ARTICLE PREVIEW 🌸</span>
                <span className="text-pink-600 font-bold">{title || 'Untitled Writeup'}</span>
              </div>

              <div
                className="prose max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
