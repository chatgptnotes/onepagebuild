'use client';
import React, { useState, useEffect, use } from 'react';
import { SiteData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import ElementRenderer from '@/components/ElementRenderer';

export default function PublishedSite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('sites').select('*').eq('is_public', true).limit(50);
      // Find by name slug
      const match = data?.find((s: any) => s.name.toLowerCase().replace(/\s+/g, '-') === slug || s.id === slug);
      if (match) {
        setSite({ ...match, sections: match.sections || [], settings: match.settings || {} } as any);
        // Track view
        await supabase.from('sites').update({ updated_at: new Date().toISOString() }).eq('id', match.id);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>◆</div>
      <p>Loading...</p>
    </div>
  </div>;

  if (notFound) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: '16px' }}>
    <h1 style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.1 }}>404</h1>
    <p style={{ color: '#94a3b8' }}>This page doesn't exist yet</p>
    <a href="/" style={{ color: '#6366f1', textDecoration: 'none' }}>Create one with PurePage.co →</a>
  </div>;

  return <div style={{ background: site!.settings.backgroundGradient || site!.settings.backgroundColor || '#0a0a0a', fontFamily: `${site!.settings.fontFamily || 'Inter'}, sans-serif`, minHeight: '100vh' }}>
    {site!.sections.map(section => {
      const sStyle: React.CSSProperties = {
        padding: section.style.padding || '80px 24px',
        minHeight: section.style.minHeight || 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
        ...(section.style.backgroundGradient ? { background: section.style.backgroundGradient } : {}),
        ...(section.style.backgroundColor && !section.style.backgroundGradient ? { backgroundColor: section.style.backgroundColor } : {}),
        ...(section.style.backgroundImage ? { backgroundImage: `url(${section.style.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      };
      return <section key={section.id} style={sStyle}>
        {section.elements.map(el => <ElementRenderer key={el.id} element={el} selected={false} onClick={() => {}} isPreview />)}
      </section>;
    })}
    <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', color: '#334155' }}>
      <a href="/" style={{ color: '#475569', textDecoration: 'none' }}>Built with ◆ PurePage.co</a>
    </div>
  </div>;
}
