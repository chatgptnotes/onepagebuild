'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { templates } from '@/lib/templates';

const categories = ['All', ...new Set(templates.map(t => t.category))];

export default function Home() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);

  return <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
    {/* Nav */}
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1a1a2e', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
      <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.1rem' }}>◆ PurePage.co</span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="/sites" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>My Sites</a>
      </div>
    </nav>

    {/* Hero */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', padding: '100px 24px 60px' }}>
      <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '24px' }}>
        <span style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>✨ Free • No signup • Export HTML</span>
      </div>
      <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '20px', letterSpacing: '-0.04em' }}>
        Build beautiful<br />
        <span style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one-page sites</span>
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
        Pick a template. Customize everything. Export clean HTML or publish instantly.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#templates" style={{ padding: '14px 32px', background: '#6366f1', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>Start Building →</a>
        <a href="/sites" style={{ padding: '14px 32px', background: 'transparent', borderRadius: '10px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', border: '1px solid #1e293b' }}>My Sites</a>
      </div>
    </motion.div>

    {/* Features */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px', background: '#1a1a2e', borderRadius: '16px', overflow: 'hidden' }}>
      {[
        { icon: '🎨', title: 'Visual Editor', desc: 'Drag, drop, customize everything' },
        { icon: '📱', title: 'Responsive', desc: 'Looks great on every device' },
        { icon: '⚡', title: 'Animations', desc: 'Smooth entrance effects' },
        { icon: '🚀', title: 'Instant Publish', desc: 'One-click shareable URL' },
      ].map(f => (
        <div key={f.title} style={{ padding: '28px', background: '#0f0f1a', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '8px' }}>{f.title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{f.desc}</p>
        </div>
      ))}
    </div>

    {/* Templates */}
    <div id="templates" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Templates</h2>
        <span style={{ color: '#475569', fontSize: '0.85rem' }}>{templates.length} templates</span>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '6px 16px', background: filter === c ? '#6366f1' : '#1a1a2e', border: '1px solid', borderColor: filter === c ? '#6366f1' : '#1e293b', borderRadius: '999px', color: filter === c ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Blank */}
        <motion.a href={`/editor/blank-${Date.now()}`} style={{ textDecoration: 'none', color: 'inherit' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px dashed #1e293b', transition: 'all 0.25s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', background: '#0b0b14' }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>+</span>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>Blank Canvas</span>
            </div>
            <div style={{ padding: '16px', background: '#111118' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Start from scratch</h3>
              <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>Complete creative freedom</p>
            </div>
          </div>
        </motion.a>

        {filtered.map((tmpl, i) => (
          <motion.a key={tmpl.id} href={`/editor/${tmpl.id}`} style={{ textDecoration: 'none', color: 'inherit' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (i + 1) }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a2e', transition: 'all 0.25s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: '200px', background: tmpl.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '-0.02em' }}>{tmpl.name}</span>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '60px', background: 'linear-gradient(transparent, rgba(0,0,0,0.3))' }} />
              </div>
              <div style={{ padding: '16px', background: '#111118' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{tmpl.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>{tmpl.category}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>{tmpl.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div style={{ textAlign: 'center', padding: '40px', borderTop: '1px solid #1a1a2e' }}>
      <p style={{ color: '#334155', fontSize: '0.85rem' }}>Built with ◆ PurePage.co</p>
    </div>
  </div>;
}
