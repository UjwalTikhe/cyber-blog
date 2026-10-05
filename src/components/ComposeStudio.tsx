import { useState, useMemo } from 'react';
import type { Post, PostCategory, PostDifficulty } from '../types';
import { calculateReadTime, renderMarkdown } from '../utils/markdown';
import { X, Download, Copy, Save, Edit3, Check } from 'lucide-react';

interface ComposeStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: Post) => void;
}

const TEMPLATE_SAMPLE = `# Day 4: [Title of Your Lab or Walkthrough]

Brief opening explaining the purpose of this lab and what vulnerability or concept you are investigating.

---

## 1. Laboratory Environment & Target Info

- **Attacking System:** Kali Linux 2026.x (\`192.168.56.10\`)
- **Target System:** Metasploitable 2 (\`192.168.56.101\`)
- **Primary Tool:** Nmap / Wireshark / Burp Suite

---

## 2. Reconnaissance & Enumeration

\`\`\`bash
# Run service detection scan
sudo nmap -sV -sC -p 80,443 192.168.56.101
\`\`\`

> [!NOTE]
> Record observations here. What ports were found open? What banner versions were leaked?

---

## 3. Vulnerability Analysis & Exploitation

\`\`\`bash
# Exploit command or script execution
python3 exploit.py --target 192.168.56.101
\`\`\`

> [!FLAG]
> Root shell obtained or flag discovered: \`THM{sample_flag_hash_here}\`

---

## 4. Blue Team Mitigation & Key Takeaways

1. **How to patch this:** Update software package to latest release.
2. **Detection Rule:** Inspect web application firewall logs for traversal sequences.
`;

export const ComposeStudio: React.FC<ComposeStudioProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('CTF & Labs');
  const [difficulty, setDifficulty] = useState<PostDifficulty>('Beginner');
  const [tagsStr, setTagsStr] = useState('tryhackme, linux, recon');
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
      title: title.trim(),
      date: today,
      category,
      difficulty,
      readTime,
      tags: tags.length ? tags : ['cybersecurity'],
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-cyber-surface border border-cyber-border rounded-xl flex flex-col h-full max-w-7xl mx-auto w-full shadow-2xl overflow-hidden">
        {/* Top Studio Bar */}
        <div className="px-4 py-3 border-b border-cyber-border flex items-center justify-between bg-cyber-card/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <span>WRITEUP STUDIO</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LIVE COMPOSER
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Write in Markdown • Auto-save • Export to .md or publish live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switches */}
            <div className="hidden md:flex bg-cyber-bg p-1 rounded-lg border border-cyber-border text-xs font-mono">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'edit' ? 'bg-cyber-card text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Editor Only
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'split' ? 'bg-cyber-card text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Split Preview
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'preview' ? 'bg-cyber-card text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Live Preview
              </button>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Copy clean markdown + frontmatter"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedMd ? 'Copied' : 'Copy .md'}</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="px-3 py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-xs font-mono text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              title="Download as clean .md file for your repository"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .md</span>
            </button>

            <button
              onClick={handlePublish}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish to Blog</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-cyber-card text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Metadata Configuration Ribbon */}
        <div className="p-4 border-b border-cyber-border bg-cyber-card/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs font-mono">
          <div className="lg:col-span-4 space-y-1">
            <label className="text-slate-400">WRITEUP TITLE *</label>
            <input
              type="text"
              placeholder="e.g. Day 4: Cracking Hashes with Hashcat & John"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="lg:col-span-2 space-y-1">
            <label className="text-slate-400">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-slate-200 focus:outline-none focus:border-emerald-500"
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

          <div className="lg:col-span-2 space-y-1">
            <label className="text-slate-400">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PostDifficulty)}
              className="w-full px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label className="text-slate-400">TAGS (COMMA SEPARATED)</label>
            <input
              type="text"
              placeholder="nmap, wireshark, tryhackme"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="lg:col-span-12 space-y-1">
            <label className="text-slate-400">EXCERPT / BRIEF SUMMARY</label>
            <input
              type="text"
              placeholder="A brief 1-2 sentence description shown on the blog feed card."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Quick Snippet Insert Toolbar */}
        <div className="px-4 py-2 border-b border-cyber-border/70 bg-cyber-surface flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[10px] mr-1">SNIPPETS:</span>
          <button
            onClick={() => insertSnippet('## New Section Header')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-slate-300 border border-cyber-border"
          >
            ## Heading
          </button>
          <button
            onClick={() => insertSnippet('```bash\n# Enter bash commands here\n```')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-emerald-400 border border-cyber-border"
          >
            `bash` Code
          </button>
          <button
            onClick={() => insertSnippet('> [!FLAG]\n> Flag captured: THM{your_flag_here}')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-emerald-400 border border-cyber-border"
          >
            Flag Callout
          </button>
          <button
            onClick={() => insertSnippet('> [!NOTE]\n> Key technical observation or protocol behavior.')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-cyan-400 border border-cyber-border"
          >
            Intel Note
          </button>
          <button
            onClick={() => insertSnippet('> [!WARNING]\n> Operational safety warning for test labs.')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-amber-400 border border-cyber-border"
          >
            Warning
          </button>
          <button
            onClick={() => insertSnippet('> [!INTEL]\n> Blue team defensive mitigation & detection rule.')}
            className="px-2 py-0.5 rounded bg-cyber-card hover:bg-slate-800 text-purple-400 border border-cyber-border"
          >
            Defense Rule
          </button>
        </div>

        {/* Main Work Area: Split Editor & Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex-1 flex flex-col border-r border-cyber-border ${viewMode === 'edit' ? 'w-full' : 'w-1/2'}`}>
              <div className="bg-cyber-card/60 px-4 py-1.5 text-[11px] font-mono text-slate-400 border-b border-cyber-border flex justify-between items-center">
                <span>MARKDOWN SOURCE</span>
                <span>{readTime} • {markdown.trim().split(/\s+/).length} words</span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your article in Markdown..."
                className="flex-1 w-full p-4 bg-cyber-bg text-slate-200 font-mono text-sm resize-none focus:outline-none selection:bg-emerald-500/30 leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex-1 flex flex-col overflow-y-auto bg-cyber-bg/95 p-6 ${viewMode === 'preview' ? 'w-full' : 'w-1/2'}`}>
              <div className="mb-4 pb-2 border-b border-cyber-border text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>LIVE ARTICLE PREVIEW</span>
                <span className="text-emerald-400 font-semibold">{title || 'Untitled Writeup'}</span>
              </div>

              <div
                className="prose prose-invert prose-emerald max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
