import { Template } from './types';
import { v4 as uuid } from 'uuid';

const h = (text: string, level: number = 1, style: Record<string, unknown> = {}) => ({
  id: uuid(), type: 'heading' as const,
  content: { text, level },
  style: { color: '#ffffff', fontSize: level === 1 ? '3.5rem' : level === 2 ? '2rem' : '1.5rem', fontWeight: '700', textAlign: 'center' as const, ...style }
});

const t = (text: string, style: Record<string, unknown> = {}) => ({
  id: uuid(), type: 'text' as const,
  content: { text },
  style: { color: '#ffffffcc', fontSize: '1.15rem', textAlign: 'center' as const, maxWidth: '600px', margin: '0 auto', lineHeight: '1.7', ...style }
});

const btn = (text: string, url: string = '#', style: Record<string, unknown> = {}) => ({
  id: uuid(), type: 'button' as const,
  content: { text, url, variant: 'solid' },
  style: { backgroundColor: '#6366f1', color: '#ffffff', padding: '14px 36px', borderRadius: '9999px', fontSize: '1rem', fontWeight: '600', ...style }
});

const img = (url: string, style: Record<string, unknown> = {}) => ({
  id: uuid(), type: 'image' as const,
  content: { url, alt: 'Image' },
  style: { width: '100%', maxWidth: '500px', borderRadius: '16px', margin: '0 auto', ...style }
});

const social = (links: Record<string, string> = {}) => ({
  id: uuid(), type: 'social-links' as const,
  content: { links: { twitter: '#', github: '#', linkedin: '#', instagram: '#', ...links } },
  style: { gap: '16px', fontSize: '1.5rem', color: '#ffffff' }
});

const divider = () => ({
  id: uuid(), type: 'divider' as const, content: { style: 'line' }, style: { margin: '20px auto', width: '60px', opacity: 0.3 }
});

const countdown = (date: string) => ({
  id: uuid(), type: 'countdown' as const,
  content: { targetDate: date, label: '' },
  style: { color: '#ffffff', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center' as const }
});

const form = () => ({
  id: uuid(), type: 'form' as const,
  content: { fields: ['name', 'email', 'message'], buttonText: 'Send Message' },
  style: { maxWidth: '450px', margin: '0 auto' }
});

const sec = (elements: any[], style: Record<string, unknown> = {}) => ({
  id: uuid(),
  elements,
  style: { padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '100vh', ...style }
});

export const templates: Template[] = [
  {
    id: 'developer-portfolio',
    name: 'Developer Portfolio',
    description: 'Dark, minimal portfolio for devs',
    category: 'Portfolio',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    settings: { title: 'Dev Portfolio', description: '', favicon: '', ogImage: '', backgroundColor: '#0f0c29', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        h('Hi, I\'m Alex.', 1, { letterSpacing: '-0.02em' }),
        t('Full-stack developer crafting beautiful digital experiences with code.'),
        social()
      ], { backgroundGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }),
      sec([
        h('Projects', 2, { color: '#a5b4fc' }),
        divider(),
        t('Featured work that I\'m proud of. Each project pushed me to learn something new.'),
        btn('View on GitHub', '#', { backgroundColor: '#4f46e5' })
      ], { backgroundColor: '#1a1a2e' }),
      sec([
        h('Let\'s Connect', 2),
        t('Have an interesting project? Let\'s talk about it.'),
        form()
      ], { backgroundColor: '#16162a' })
    ]
  },
  {
    id: 'startup-landing',
    name: 'Startup Landing',
    description: 'Bold gradient landing page with CTA',
    category: 'Landing Page',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    settings: { title: 'LaunchPad', description: '', favicon: '', ogImage: '', backgroundColor: '#0a0a0a', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        h('Ship faster.\nScale smarter.', 1, { fontSize: '4rem', lineHeight: '1.1' }),
        t('The all-in-one platform that helps startups go from idea to IPO. No fluff, just results.'),
        btn('Start Free Trial', '#'),
        btn('Watch Demo →', '#', { backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.3)' })
      ], { backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }),
      sec([
        h('Why teams love us', 2, { color: '#667eea' }),
        t('10,000+ startups trust our platform to build, launch, and grow their products.'),
      ], { backgroundColor: '#111' }),
      sec([
        h('Ready to launch?', 2),
        t('Join thousands of founders who chose the faster path.'),
        btn('Get Started Free', '#')
      ], { backgroundGradient: 'linear-gradient(135deg, #764ba2, #667eea)' })
    ]
  },
  {
    id: 'personal-profile',
    name: 'Personal Profile',
    description: 'Centered profile with photo and bio',
    category: 'Profile',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    settings: { title: 'About Me', description: '', favicon: '', ogImage: '', backgroundColor: '#1a1a2e', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        img('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', { borderRadius: '50%', width: '150px', height: '150px' }),
        h('Sarah Chen', 1, { fontSize: '2.5rem', margin: '16px 0 0' }),
        t('Designer, traveler, coffee addict. ☕\nMaking the world more beautiful, one pixel at a time.', { fontSize: '1.1rem' }),
        divider(),
        social()
      ], { backgroundGradient: 'linear-gradient(135deg, #1a1a2e, #2d1b4e)', minHeight: '100vh' })
    ]
  },
  {
    id: 'link-in-bio',
    name: 'Link in Bio',
    description: 'Stacked links, Linktree-style',
    category: 'Link-in-Bio',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    settings: { title: 'My Links', description: '', favicon: '', ogImage: '', backgroundColor: '#0f172a', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        img('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face', { borderRadius: '50%', width: '100px', height: '100px' }),
        h('@username', 2, { fontSize: '1.5rem', margin: '12px 0 4px' }),
        t('Creator • Dreamer • Builder', { fontSize: '0.95rem', margin: '0 0 24px' }),
        btn('🎬 My YouTube Channel', '#', { backgroundColor: '#ef4444', width: '100%', maxWidth: '320px', borderRadius: '12px' }),
        btn('📸 Instagram', '#', { backgroundColor: '#e1306c', width: '100%', maxWidth: '320px', borderRadius: '12px' }),
        btn('🎵 Spotify Playlist', '#', { backgroundColor: '#1db954', width: '100%', maxWidth: '320px', borderRadius: '12px' }),
        btn('💼 Portfolio', '#', { backgroundColor: '#6366f1', width: '100%', maxWidth: '320px', borderRadius: '12px' }),
        btn('☕ Buy Me a Coffee', '#', { backgroundColor: '#f59e0b', width: '100%', maxWidth: '320px', borderRadius: '12px' }),
      ], { backgroundGradient: 'linear-gradient(180deg, #0f172a, #1e293b)', minHeight: '100vh', padding: '60px 24px' })
    ]
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    description: 'Countdown timer with email signup',
    category: 'Coming Soon',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #0c0c0c, #1a1a1a)',
    settings: { title: 'Coming Soon', description: '', favicon: '', ogImage: '', backgroundColor: '#0c0c0c', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        h('Something\nBig Is Coming', 1, { fontSize: '4rem', lineHeight: '1.1', letterSpacing: '-0.03em' }),
        t('We\'re working on something exciting. Be the first to know.'),
        countdown('2026-06-01T00:00:00'),
        divider(),
        form()
      ], { backgroundGradient: 'linear-gradient(180deg, #0c0c0c, #1a0a2e)', minHeight: '100vh' })
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Elegant menu and reservation page',
    category: 'Business',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #2c1810, #8b4513)',
    settings: { title: 'The Golden Fork', description: '', favicon: '', ogImage: '', backgroundColor: '#1a0f0a', customCSS: '', fontFamily: 'Playfair Display' },
    sections: [
      sec([
        h('The Golden Fork', 1, { fontSize: '3.5rem', fontFamily: 'Playfair Display', letterSpacing: '0.05em' }),
        t('Fine dining reimagined. Since 1987.', { fontFamily: 'Inter', letterSpacing: '0.2em', fontSize: '0.9rem', textTransform: 'uppercase' } as any),
        btn('Reserve a Table', '#', { backgroundColor: '#c9a96e', color: '#1a0f0a', borderRadius: '0' })
      ], { backgroundGradient: 'linear-gradient(180deg, #1a0f0a, #2c1810)', minHeight: '100vh' }),
      sec([
        h('Menu Highlights', 2, { color: '#c9a96e', fontFamily: 'Playfair Display' }),
        divider(),
        t('🥩 Wagyu Ribeye — $85\n🦞 Butter Poached Lobster — $65\n🍝 Truffle Risotto — $45\n🍷 Chef\'s Wine Pairing — $40', { textAlign: 'left' as const, lineHeight: '2.5' }),
      ], { backgroundColor: '#1a0f0a' }),
      sec([
        h('Visit Us', 2, { color: '#c9a96e', fontFamily: 'Playfair Display' }),
        t('📍 123 Gourmet Ave, NYC\n⏰ Tue-Sun: 5PM - 11PM\n📞 (212) 555-0123'),
        btn('Make Reservation', '#', { backgroundColor: '#c9a96e', color: '#1a0f0a', borderRadius: '0' })
      ], { backgroundColor: '#2c1810' })
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Elegant wedding invitation with RSVP',
    category: 'Personal',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #fdfcfb, #e2d1c3)',
    settings: { title: 'Wedding Invitation', description: '', favicon: '', ogImage: '', backgroundColor: '#faf8f5', customCSS: '', fontFamily: 'Playfair Display' },
    sections: [
      sec([
        t('Together with their families', { color: '#8b7355', fontSize: '0.9rem', letterSpacing: '0.2em' }),
        h('Emma & James', 1, { color: '#2c1810', fontSize: '4rem', fontFamily: 'Playfair Display' }),
        t('Request the pleasure of your company at their wedding celebration', { color: '#6b5b4a', fontFamily: 'Inter' }),
        divider(),
        countdown('2026-09-15T16:00:00'),
        t('September 15, 2026 • 4:00 PM\nRosewood Garden Estate', { color: '#8b7355', fontSize: '1rem' }),
      ], { backgroundColor: '#faf8f5', minHeight: '100vh' }),
      sec([
        h('RSVP', 2, { color: '#2c1810', fontFamily: 'Playfair Display' }),
        t('Kindly respond by August 1, 2026', { color: '#8b7355' }),
        form()
      ], { backgroundColor: '#f5f0ea' })
    ]
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'Product landing with features and pricing',
    category: 'Landing Page',
    thumbnail: '',
    gradient: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
    settings: { title: 'CloudSync', description: '', favicon: '', ogImage: '', backgroundColor: '#030712', customCSS: '', fontFamily: 'Inter' },
    sections: [
      sec([
        h('Your data,\neverywhere.', 1, { fontSize: '4rem', lineHeight: '1.1', letterSpacing: '-0.03em' }),
        t('CloudSync keeps your files, notes, and projects in perfect harmony across all your devices.'),
        btn('Start Free', '#', { backgroundColor: '#3b82f6' }),
        btn('See Pricing ↓', '#', { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)' })
      ], { backgroundGradient: 'linear-gradient(180deg, #030712, #0f172a)', minHeight: '100vh' }),
      sec([
        h('Features', 2, { color: '#60a5fa' }),
        t('⚡ Lightning Sync — Files update in real-time\n🔒 End-to-End Encryption — Your data, your rules\n🌍 Works Everywhere — Mac, PC, iOS, Android\n📊 Smart Analytics — Know how your team works', { textAlign: 'left' as const, lineHeight: '2.5' }),
      ], { backgroundColor: '#0f172a' }),
      sec([
        h('Simple Pricing', 2, { color: '#60a5fa' }),
        t('Free — 5GB, 1 user\nPro $9/mo — 100GB, 5 users\nTeam $29/mo — Unlimited'),
        btn('Get Started', '#', { backgroundColor: '#3b82f6' })
      ], { backgroundGradient: 'linear-gradient(180deg, #0f172a, #030712)' })
    ]
  }
];
