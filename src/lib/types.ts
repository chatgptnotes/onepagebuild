export type ElementType = 
  | 'heading' | 'text' | 'image' | 'button' | 'icon' 
  | 'divider' | 'embed' | 'form' | 'countdown' | 'social-links';

export interface ElementStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  opacity?: number;
  maxWidth?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  border?: string;
  letterSpacing?: string;
  lineHeight?: string;
  gap?: string;
}

export interface SectionStyle {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  padding?: string;
  minHeight?: string;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  flexDirection?: string;
  textAlign?: string;
  overlay?: string;
}

export interface PageElement {
  id: string;
  type: ElementType;
  content: Record<string, unknown>;
  style: ElementStyle;
}

export interface Section {
  id: string;
  elements: PageElement[];
  style: SectionStyle;
}

export interface SiteData {
  id: string;
  name: string;
  title: string;
  sections: Section[];
  settings: SiteSettings;
  createdAt: number;
  updatedAt: number;
  templateId?: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
  backgroundColor: string;
  backgroundGradient?: string;
  customCSS: string;
  fontFamily: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  gradient: string;
  sections: Section[];
  settings: SiteSettings;
}
