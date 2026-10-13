export type PageId = 'home' | 'work' | 'services' | 'about' | 'contact';

export type ProjectCategory = 'all' | 'brand-identity' | 'campaign-design' | 'visual-direction' | 'print-editorial' | 'digital-design';

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: 'brand-identity' | 'campaign-design' | 'visual-direction' | 'print-editorial' | 'digital-design';
  brandingType?: string;
  year: string;
  client: string;
  role: string;
  image: string;
  featured: boolean;
  tagline: string;
  overview: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  palette: {
    name: string;
    hex: string;
    role: string;
  }[];
  typography: {
    display: string;
    body: string;
    sample: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
    company: string;
  };
  behanceUrl?: string;
  instagramUrl?: string;
  scents?: {
    name: string;
    atmosphere: string;
    notes: string;
    hex: string;
  }[];
  packagingDetails?: {
    label: string;
    description: string;
  }[];
  menuHighlights?: {
    category: string;
    items: {
      name: string;
      price: string;
      desc?: string;
    }[];
  }[];
  gallery?: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  iconType: 'planet' | 'discs' | 'sparkle';
  deliverables: string[];
  timeline: string;
  idealFor: string;
}

export interface ScopeEstimate {
  services: string[];
  deliverables: string[];
  timeline: 'rush' | 'standard' | 'extended';
  currency: 'USD' | 'EUR' | 'GBP';
}
