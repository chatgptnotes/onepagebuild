'use client';
import React from 'react';
import { PageElement, ElementType } from '@/lib/types';
import { v4 as uuid } from 'uuid';

const elementDefs: { type: ElementType; icon: string; label: string }[] = [
  { type: 'heading', icon: 'H', label: 'Heading' },
  { type: 'text', icon: 'T', label: 'Text' },
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'button', icon: '▶', label: 'Button' },
  { type: 'divider', icon: '—', label: 'Divider' },
  { type: 'embed', icon: '📹', label: 'Video' },
  { type: 'form', icon: '📝', label: 'Form' },
  { type: 'countdown', icon: '⏱', label: 'Countdown' },
  { type: 'social-links', icon: '🔗', label: 'Social' },
  { type: 'icon', icon: '★', label: 'Icon' },
];

function createDefault(type: ElementType): PageElement {
  const base = { id: uuid(), type, style: {} };
  switch (type) {
    case 'heading': return { ...base, content: { text: 'New Heading', level: 1 }, style: { color: '#ffffff', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center' } };
    case 'text': return { ...base, content: { text: 'Your text here' }, style: { color: '#ffffffcc', fontSize: '1.1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' } };
    case 'image': return { ...base, content: { url: '', alt: 'Image' }, style: { width: '100%', maxWidth: '500px', borderRadius: '12px', margin: '0 auto' } };
    case 'button': return { ...base, content: { text: 'Click Me', url: '#', variant: 'solid' }, style: { backgroundColor: '#6366f1', color: '#fff', padding: '12px 32px', borderRadius: '9999px', fontSize: '1rem', fontWeight: '600' } };
    case 'divider': return { ...base, content: { style: 'line' }, style: { margin: '20px auto', width: '60px', opacity: 0.3 } };
    case 'embed': return { ...base, content: { url: '' }, style: {} };
    case 'form': return { ...base, content: { fields: ['name', 'email', 'message'], buttonText: 'Send' }, style: { maxWidth: '400px', margin: '0 auto' } };
    case 'countdown': return { ...base, content: { targetDate: '2026-12-31T00:00:00' }, style: { color: '#fff', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center' } };
    case 'social-links': return { ...base, content: { links: { twitter: '#', github: '#', linkedin: '#', instagram: '#' } }, style: { gap: '16px', fontSize: '1.5rem', color: '#fff' } };
    case 'icon': return { ...base, content: { name: 'star' }, style: { fontSize: '3rem', color: '#6366f1', textAlign: 'center' } };
    default: return { ...base, content: {} };
  }
}

export default function AddPanel({ onAdd }: { onAdd: (el: PageElement) => void }) {
  return <div>
    <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Add Element</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
      {elementDefs.map(d => (
        <button key={d.type} onClick={() => onAdd(createDefault(d.type))}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 4px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.borderColor = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = '#334155'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>{d.icon}</span>
          {d.label}
        </button>
      ))}
    </div>
    <div style={{ marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Add Section</h3>
      <button onClick={() => onAdd(createDefault('heading'))}
        style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
        data-add-section="true"
      >
        + New Section
      </button>
    </div>
  </div>;
}
