import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*_`]/g, '');
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      toc.push({ id, text, level });
    }
  }

  return toc;
}

export function calculateReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function renderMarkdown(markdown: string): string {
  // Pre-process callouts with clean pastel style
  let processed = markdown;

  // Replace GitHub / Obsidian style alert callouts
  processed = processed.replace(
    />\s*\[!NOTE\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-info"><div class="font-sans font-bold text-xs uppercase tracking-wider text-sky-700 mb-1.5 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> PROTOCOL NOTE</div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!WARNING\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-warning"><div class="font-sans font-bold text-xs uppercase tracking-wider text-amber-700 mb-1.5 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> LAB SAFETY WARNING</div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!FLAG\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-flag"><div class="font-sans font-bold text-xs uppercase tracking-wider text-pink-700 mb-1.5 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> TARGET PWNED / FLAG CAPTURED</div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!INTEL\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-intel"><div class="font-sans font-bold text-xs uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg> BLUE TEAM MITIGATION</div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  const rawHtml = marked.parse(processed) as string;

  // Add IDs to h2 and h3 headers with cute anchor tags
  const withHeaderIds = rawHtml.replace(/<(h[23])>(.*?)<\/\1>/gi, (_match, tag, content) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const id = plainText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `<${tag} id="${id}" class="scroll-mt-24 group flex items-center">${content} <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-pink-400 hover:text-pink-600 transition-opacity ml-2 text-sm font-sans font-normal">#</a></${tag}>`;
  });

  return withHeaderIds;
}

export function highlightAllCodeBlocks() {
  if (typeof document !== 'undefined') {
    document.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }
}
