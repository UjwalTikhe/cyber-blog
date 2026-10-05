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
  id: string; // url slug e.g. 'day-1-embarking-on-cybersecurity'
  title: string;
  date: string;
  category: PostCategory;
  difficulty: PostDifficulty;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string; // Full markdown
  author?: string;
  isCustom?: boolean; // added via the live composer
  episode?: number; // e.g. Ep. 01
  thumbnailUrl?: string; // 16:9 thumbnail image URL
  youtubeUrl?: string; // Optional YouTube vlog video URL or ID
  feynmanSummary?: string; // ELI5 / simple breakdown
}

export interface JourneyMilestone {
  day: number;
  title: string;
  phase: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  relatedPostId?: string;
  dateTarget?: string;
}

export interface ArsenalTool {
  name: string;
  category: 'Virtualization & OS' | 'Network Analysis' | 'Security Monitoring' | 'Penetration Testing' | 'Scripting & Automation';
  purpose: string;
  status: 'Daily Driver' | 'Active Lab' | 'Currently Studying';
  commandExample?: string;
}
