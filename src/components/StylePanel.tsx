'use client';
import React from 'react';
import { PageElement, Section, ElementStyle, SectionStyle } from '@/lib/types';
import { FONTS } from '@/lib/fonts';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.85rem' };

export function ElementStylePanel({ element, onChange }: { element: PageElement; onChange: (style: ElementStyle) => void }) {
  const s = element.style;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });

  return <div>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Element Style</h3>
    
    {(element.type === 'heading' || element.type === 'text' || element.type === 'button') && <>
      <Field label="Font">
        <select style={inputStyle} value={s.fontFamily || 'Inter'} onChange={e => set('fontFamily', e.target.value)}>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Size">
        <input style={inputStyle} value={s.fontSize || ''} onChange={e => set('fontSize', e.target.value)} placeholder="1rem" />
      </Field>
      <Field label="Weight">
        <select style={inputStyle} value={s.fontWeight || '400'} onChange={e => set('fontWeight', e.target.value)}>
          {['300','400','500','600','700'].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </Field>
      <Field label="Align">
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['left','center','right'] as const).map(a => 
            <button key={a} onClick={() => set('textAlign', a)} style={{ flex: 1, padding: '6px', background: s.textAlign === a ? '#6366f1' : '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>
              {a === 'left' ? '⬛◻◻' : a === 'center' ? '◻⬛◻' : '◻◻⬛'}
            </button>
          )}
        </div>
      </Field>
      <Field label="Letter Spacing">
        <input style={inputStyle} value={s.letterSpacing || ''} onChange={e => set('letterSpacing', e.target.value)} placeholder="0em" />
      </Field>
    </>}

    <Field label="Color">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={s.color || '#ffffff'} onChange={e => set('color', e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', background: 'none' }} />
        <input style={{ ...inputStyle, flex: 1 }} value={s.color || ''} onChange={e => set('color', e.target.value)} />
      </div>
    </Field>

    {(element.type === 'button') && <Field label="Background">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={s.backgroundColor || '#6366f1'} onChange={e => set('backgroundColor', e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', background: 'none' }} />
        <input style={{ ...inputStyle, flex: 1 }} value={s.backgroundColor || ''} onChange={e => set('backgroundColor', e.target.value)} />
      </div>
    </Field>}

    <Field label="Padding"><input style={inputStyle} value={s.padding || ''} onChange={e => set('padding', e.target.value)} placeholder="0px" /></Field>
    <Field label="Margin"><input style={inputStyle} value={s.margin || ''} onChange={e => set('margin', e.target.value)} placeholder="0px" /></Field>
    <Field label="Border Radius"><input style={inputStyle} value={s.borderRadius || ''} onChange={e => set('borderRadius', e.target.value)} placeholder="0px" /></Field>
    <Field label="Max Width"><input style={inputStyle} value={s.maxWidth || ''} onChange={e => set('maxWidth', e.target.value)} placeholder="none" /></Field>
    <Field label="Opacity">
      <input type="range" min="0" max="1" step="0.05" value={s.opacity ?? 1} onChange={e => set('opacity', parseFloat(e.target.value))} style={{ width: '100%' }} />
    </Field>
  </div>;
}

export function SectionStylePanel({ section, onChange }: { section: Section; onChange: (style: SectionStyle) => void }) {
  const s = section.style;
  const set = (key: string, val: string) => onChange({ ...s, [key]: val });

  return <div>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Section Style</h3>
    <Field label="Background Color">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={s.backgroundColor || '#0a0a0a'} onChange={e => set('backgroundColor', e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', background: 'none' }} />
        <input style={{ ...inputStyle, flex: 1 }} value={s.backgroundColor || ''} onChange={e => set('backgroundColor', e.target.value)} />
      </div>
    </Field>
    <Field label="Gradient"><input style={inputStyle} value={s.backgroundGradient || ''} onChange={e => set('backgroundGradient', e.target.value)} placeholder="linear-gradient(...)" /></Field>
    <Field label="Background Image URL"><input style={inputStyle} value={s.backgroundImage || ''} onChange={e => set('backgroundImage', e.target.value)} placeholder="https://..." /></Field>
    <Field label="Padding"><input style={inputStyle} value={s.padding || ''} onChange={e => set('padding', e.target.value)} placeholder="80px 24px" /></Field>
    <Field label="Min Height"><input style={inputStyle} value={s.minHeight || ''} onChange={e => set('minHeight', e.target.value)} placeholder="100vh" /></Field>
  </div>;
}
