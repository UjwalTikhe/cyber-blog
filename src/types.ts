export type PostCategory = 
  | 'Foundations'
  | 'Homelab'
  | 'CTF & Labs'
  | 'Networking'
  | 'Blue Team'
  | 'Red Team'
  | 'Tools & Scripts';

export type PostDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Post {
  id: string; // url slug e.g. 'akte-001-philosophy-of-proof-of-work'
  akteNumber: number; // 1 to 511
  title: string;
  date: string;
  category: PostCategory;
  difficulty: PostDifficulty;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string; // Full markdown
  author?: string;
  thumbnailUrl?: string; // 16:9 thumbnail image URL
  youtubeUrl?: string; // Optional YouTube companion vlog video URL or ID
  feynmanSummary?: string; // Core concept breakdown
  episode?: number; // legacy alias
}
