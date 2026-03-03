'use client';
import React, { useState, useEffect } from 'react';
import { SiteData } from '@/lib/types';
import { storage } from '@/lib/storage';

export default function SitesPage() {
  const [sites, setSites] = useState<SiteData[]>([]);

  useEffect(() => {
    setSites(storage.getSites());
  }, []);

  const deleteSite = (id: string) => {
    if (confirm('Delete this site?')) {
      storage.deleteSite(id);
      setSites(storage.getSites());
    }
  };

  return <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1e293b' }}>
      <a href="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none' }}>◆ PurePage.co</a>
      <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>← Templates</a>
    </nav>
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '32px' }}>My Sites</h1>
      {sites.length === 0 ? <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>No sites yet</p>
        <a href="/" style={{ color: '#6366f1', textDecoration: 'none' }}>Choose a template to get started →</a>
      </div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {sites.map(site => (
          <div key={site.id} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}>
            <div style={{ height: '140px', background: site.sections[0]?.style.backgroundGradient || site.sections[0]?.style.backgroundColor || '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
              {site.name}
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{site.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>Updated {new Date(site.updatedAt).toLocaleDateString()}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`/editor/${site.id}`} style={{ flex: 1, padding: '8px', background: '#6366f1', borderRadius: '6px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem' }}>Edit</a>
                <a href={`/preview/${site.id}`} target="_blank" style={{ flex: 1, padding: '8px', background: '#334155', borderRadius: '6px', color: '#e2e8f0', textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem' }}>Preview</a>
                <button onClick={() => deleteSite(site.id)} style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  </div>;
}
