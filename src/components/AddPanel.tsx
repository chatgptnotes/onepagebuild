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
  { type: 'countdown', icon: '⏱', label: 'Timer' },
  { type: 'social-links', icon: '🔗', label: 'Social' },
  { type: 'icon', icon: '★', label: 'Icon' },
];

function createDefault(type: ElementType): PageElement {
  const base = { id: uuid(), type, style: {} as any };
  switch (type) {
    case 'heading': return { ...base, content: { text: 'New Heading', level: 1, animation: 'fadeIn' }, style: { color: '#ffffff', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center' } };
    case 'text': return { ...base, content: { text: 'Your text here', animation: 'fadeIn' }, style: { color: '#ffffffcc', fontSize: '1.1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' } };
    case 'image': return { ...base, content: { url: '', alt: 'Image', animation: 'scaleUp' }, style: { width: '100%', maxWidth: '500px', borderRadius: '12px', margin: '0 auto' } };
    case 'button': return { ...base, content: { text: 'Click Me', url: '#', variant: 'solid', animation: 'slideUp' }, style: { backgroundColor: '#6366f1', color: '#fff', padding: '14px 32px', borderRadius: '9999px', fontSize: '1rem', fontWeight: '600' } };
    case 'divider': return { ...base, content: { style: 'line' }, style: { margin: '20px auto', width: '60px', opacity: 0.3 } };
    case 'embed': return { ...base, content: { url: '', animation: 'fadeIn' }, style: {} };
    case 'form': return { ...base, content: { fields: ['name', 'email', 'message'], buttonText: 'Send', animation: 'slideUp' }, style: { maxWidth: '400px', margin: '0 auto', width: '100%' } };
    case 'countdown': return { ...base, content: { targetDate: '2026-12-31T00:00:00', animation: 'fadeIn' }, style: { color: '#fff', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center' } };
    case 'social-links': return { ...base, content: { links: { twitter: '#', github: '#', linkedin: '#', instagram: '#' } }, style: { gap: '16px', fontSize: '1.5rem', color: '#fff' } };
    case 'icon': return { ...base, content: { emoji: '★' }, style: { fontSize: '3rem', color: '#6366f1', textAlign: 'center' } };
    default: return { ...base, content: {} };
  }
}

export default function AddPanel({ onAdd }: { onAdd: (el: PageElement) => void }) {
  return <div>
    <h3 style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Add Element</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
      {elementDefs.map(d => (
        <button key={d.type} onClick={() => onAdd(createDefault(d.type))}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 4px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#e2e8f0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <span style={{ fontSize: '1.1rem' }}>{d.icon}</span>
          {d.label}
        </button>
      ))}
    </div>
  </div>;
}
