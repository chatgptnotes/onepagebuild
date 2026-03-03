'use client';
import React from 'react';
import { templates } from '@/lib/templates';

export default function Home() {
  return <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
    {/* Nav */}
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1e293b' }}>
      <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.2rem' }}>◆ OnePage</span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="/sites" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>My Sites</a>
      </div>
    </nav>

    {/* Hero */}
    <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
        Beautiful one-page sites<br />
        <span style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in minutes.</span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
        Pick a template, customize everything, export clean HTML. No signup required.
      </p>
    </div>

    {/* Templates grid */}
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Choose a template</h2>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{templates.length} templates</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Blank */}
        <a href={`/editor/blank-${Date.now()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px dashed #334155', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', background: '#0b1120' }}>
              <span style={{ fontSize: '2rem' }}>+</span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Blank Page</span>
            </div>
            <div style={{ padding: '16px', background: '#1e293b' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Start from scratch</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Empty canvas</p>
            </div>
          </div>
        </a>

        {templates.map(tmpl => (
          <a key={tmpl.id} href={`/editor/${tmpl.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: '180px', background: tmpl.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{tmpl.name}</span>
              </div>
              <div style={{ padding: '16px', background: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{tmpl.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#6366f1', background: '#6366f120', padding: '2px 8px', borderRadius: '4px' }}>{tmpl.category}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{tmpl.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid #1e293b', color: '#475569', fontSize: '0.85rem' }}>
      Built with ◆ OnePage
    </div>
  </div>;
}
