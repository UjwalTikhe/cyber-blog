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
  return `${minutes} min read ✨`;
}

export function renderMarkdown(markdown: string): string {
  // Pre-process callouts with cute pastel style
  let processed = markdown;

  // Replace GitHub / Obsidian style alert callouts
  processed = processed.replace(
    />\s*\[!NOTE\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-info"><div class="flex items-center gap-1.5 font-display font-bold text-xs uppercase text-sky-600 mb-1.5"><span>🌸</span> <span>MISSION INTEL</span> <span>✨</span></div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!WARNING\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-warning"><div class="flex items-center gap-1.5 font-display font-bold text-xs uppercase text-amber-700 mb-1.5"><span>⚠️</span> <span>LAB SAFETY CAUTION</span></div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!FLAG\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-flag"><div class="flex items-center gap-1.5 font-display font-bold text-xs uppercase text-pink-600 mb-1.5"><span>🚩</span> <span>FLAG CAPTURED (｡♥‿♥｡)</span> <span>🎀</span></div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!INTEL\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-intel"><div class="flex items-center gap-1.5 font-display font-bold text-xs uppercase text-purple-600 mb-1.5"><span>🛡️</span> <span>BLUE TEAM DEFENSE TIP</span> <span>🐾</span></div><div class="text-sm text-slate-700 leading-relaxed font-sans">$1</div></div>'
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
