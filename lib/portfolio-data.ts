// Portfolio Data Schema & Types

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  description: string;
  contributions: string[];
  stack: string[];
  features: string[];
  github?: string;
  demo?: string;
  status: 'live' | 'development' | 'completed';
  accentColor: string;
}

export interface SkillCategory {
  label: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  type: string;
  role: string;
  org: string;
  period: string;
  desc: string;
}

export interface PortfolioData {
  theme: {
    accentColor: string;
    accentDim?: string;
    accentDim2?: string;
  };
  hero: {
    label: string;
    headlineLine1: string;
    headlineLine2: string;
    headlineAccent: string;
    headlineLine4: string;
    description: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
  about: {
    headlineLine1: string;
    headlineLine2: string;
    headlineAccent: string;
    bioParagraphs: string[];
    details: {
      location: string;
      focus: string;
      education: string;
      status: string;
    };
    stats: {
      projectsCount: number;
      yearsCoding: number;
      deploymentsLive: number;
      technologiesCount: number;
    };
  };
  projects: ProjectItem[];
  skills: SkillCategory[];
  experiences: ExperienceItem[];
  contact: {
    label: string;
    headlineNormal: string;
    headlineAccent: string;
    subtitle: string;
    email: string;
    github: string;
    linkedin: string;
    resumeUrl: string;
    resumeFileName: string;
  };
}

// Convert hex color to rgba helper
export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(198, 255, 77, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
