import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with standard syntax parsing
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
  let processed = markdown;

  // Replace GitHub / Obsidian style alert callouts with uniform 1px bordered boxes (no colored left stripes)
  processed = processed.replace(
    />\s*\[!NOTE\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-box"><div class="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">[ Note: Protocol Specification ]</div><div class="text-sm text-ink leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!WARNING\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-box"><div class="font-mono text-[11px] font-bold uppercase tracking-wider text-crimson mb-1">[ Warning: Lab Safety Threshold ]</div><div class="text-sm text-ink leading-relaxed font-sans">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!FLAG\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-box"><div class="font-mono text-[11px] font-bold uppercase tracking-wider text-ink mb-1">[ Proof of Work: Flag Captured ]</div><div class="text-sm text-ink leading-relaxed font-sans font-mono">$1</div></div>'
  );

  processed = processed.replace(
    />\s*\[!INTEL\]\s*([\s\S]*?)(?=\n\n|\n(?!>)|$)/gi,
    '<div class="callout-box"><div class="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">[ Defensive Mitigation Signature ]</div><div class="text-sm text-ink leading-relaxed font-sans">$1</div></div>'
  );

  const rawHtml = marked.parse(processed) as string;

  // Add IDs to h2 and h3 headers with quiet anchor tags
  const withHeaderIds = rawHtml.replace(/<(h[23])>(.*?)<\/\1>/gi, (_match, tag, content) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const id = plainText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `<${tag} id="${id}" class="scroll-mt-20 group flex items-center">${content} <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-ink-light hover:text-ink transition-opacity ml-2 text-xs font-mono">#</a></${tag}>`;
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
