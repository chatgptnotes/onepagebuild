'use client';
import React, { useState, useEffect, use } from 'react';
import { SiteData } from '@/lib/types';
import { storage } from '@/lib/storage';
import ElementRenderer from '@/components/ElementRenderer';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [site, setSite] = useState<SiteData | null>(null);

  useEffect(() => {
    setSite(storage.getSite(id));
  }, [id]);

  if (!site) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}>Site not found</div>;

  return <div style={{ background: site.settings.backgroundGradient || site.settings.backgroundColor || '#0a0a0a', fontFamily: `${site.settings.fontFamily || 'Inter'}, sans-serif`, minHeight: '100vh' }}>
    {site.sections.map(section => {
      const sStyle: React.CSSProperties = {
        padding: section.style.padding || '80px 24px',
        minHeight: section.style.minHeight || 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
        ...(section.style.backgroundGradient ? { background: section.style.backgroundGradient } : {}),
        ...(section.style.backgroundColor && !section.style.backgroundGradient ? { backgroundColor: section.style.backgroundColor } : {}),
        ...(section.style.backgroundImage ? { backgroundImage: `url(${section.style.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      };
      return <section key={section.id} style={sStyle}>
        {section.elements.map(el => <ElementRenderer key={el.id} element={el} selected={false} onClick={() => {}} />)}
      </section>;
    })}
  </div>;
}
