import { SiteData } from './types';

const SITES_KEY = 'purepage_sites';
const AUTH_KEY = 'purepage_auth';

export const storage = {
  getSites(): SiteData[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  getSite(id: string): SiteData | null {
    return this.getSites().find(s => s.id === id) || null;
  },

  saveSite(site: SiteData): void {
    const sites = this.getSites();
    const idx = sites.findIndex(s => s.id === site.id);
    site.updatedAt = Date.now();
    if (idx >= 0) sites[idx] = site;
    else sites.push(site);
    localStorage.setItem(SITES_KEY, JSON.stringify(sites));
  },

  deleteSite(id: string): void {
    const sites = this.getSites().filter(s => s.id !== id);
    localStorage.setItem(SITES_KEY, JSON.stringify(sites));
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  authenticate(password: string): boolean {
    // Simple password gate for export
    if (password === 'purepage2026') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
};
