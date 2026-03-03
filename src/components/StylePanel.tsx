'use client';
import React from 'react';
import { PageElement, Section, ElementStyle, SectionStyle } from '@/lib/types';
import { FONTS } from '@/lib/fonts';
import { ANIMATIONS, THEME_PRESETS, GRADIENT_PRESETS } from '@/lib/animations';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{label}</label>
    {children}
  </div>;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.85rem', transition: 'border-color 0.15s' };

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Field label={label}>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', background: 'none', borderRadius: '6px' }} />
      <input style={{ ...inputStyle, flex: 1 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#000000" />
    </div>
  </Field>;
}

export function ElementStylePanel({ element, onChange, onContentChange }: { 
  element: PageElement; 
  onChange: (style: ElementStyle) => void;
  onContentChange?: (content: Record<string, unknown>) => void;
}) {
  const s = element.style;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const setContent = (key: string, val: unknown) => onContentChange?.({ ...element.content, [key]: val });
  const isText = ['heading', 'text', 'button'].includes(element.type);

  return <div>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
      {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Properties
    </h3>
    
    {/* Content editing */}
    {element.type === 'heading' && <Field label="Heading Level">
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1,2,3,4].map(l => <button key={l} onClick={() => setContent('level', l)} style={{ flex: 1, padding: '6px', background: element.content.level === l ? '#6366f1' : '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem', fontWeight: element.content.level === l ? 600 : 400 }}>H{l}</button>)}
      </div>
    </Field>}

    {element.type === 'button' && <>
      <Field label="Button URL"><input style={inputStyle} value={element.content.url as string || ''} onChange={e => setContent('url', e.target.value)} placeholder="https://..." /></Field>
    </>}

    {element.type === 'social-links' && <Field label="Edit Links">
      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>Double-click the element to edit links</p>
    </Field>}

    {element.type === 'countdown' && <Field label="Target Date">
      <input type="datetime-local" style={inputStyle} value={(element.content.targetDate as string || '').slice(0, 16)} onChange={e => setContent('targetDate', e.target.value + ':00')} />
    </Field>}

    {/* Animation */}
    <Field label="Animation">
      <select style={inputStyle} value={element.content?.animation as string || 'none'} onChange={e => setContent('animation', e.target.value)}>
        {ANIMATIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
      </select>
    </Field>

    {isText && <>
      <Field label="Font">
        <select style={inputStyle} value={s.fontFamily || 'Inter'} onChange={e => set('fontFamily', e.target.value)}>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Size"><input style={inputStyle} value={s.fontSize || ''} onChange={e => set('fontSize', e.target.value)} placeholder="1rem" /></Field>
      <Field label="Weight">
        <select style={inputStyle} value={s.fontWeight || '400'} onChange={e => set('fontWeight', e.target.value)}>
          {['300','400','500','600','700','800','900'].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </Field>
      <Field label="Align">
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['left','center','right'] as const).map(a => 
            <button key={a} onClick={() => set('textAlign', a)} style={{ flex: 1, padding: '7px', background: s.textAlign === a ? '#6366f1' : '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          )}
        </div>
      </Field>
      <Field label="Line Height"><input style={inputStyle} value={s.lineHeight || ''} onChange={e => set('lineHeight', e.target.value)} placeholder="1.6" /></Field>
      <Field label="Letter Spacing"><input style={inputStyle} value={s.letterSpacing || ''} onChange={e => set('letterSpacing', e.target.value)} placeholder="0em" /></Field>
    </>}

    <ColorField label="Color" value={s.color || '#ffffff'} onChange={v => set('color', v)} />
    
    {['button', 'form'].includes(element.type) && <ColorField label="Background" value={s.backgroundColor || '#6366f1'} onChange={v => set('backgroundColor', v)} />}

    <Field label="Padding"><input style={inputStyle} value={s.padding || ''} onChange={e => set('padding', e.target.value)} placeholder="0px" /></Field>
    <Field label="Margin"><input style={inputStyle} value={s.margin || ''} onChange={e => set('margin', e.target.value)} placeholder="0px" /></Field>
    <Field label="Border Radius"><input style={inputStyle} value={s.borderRadius || ''} onChange={e => set('borderRadius', e.target.value)} placeholder="0px" /></Field>
    <Field label="Max Width"><input style={inputStyle} value={s.maxWidth || ''} onChange={e => set('maxWidth', e.target.value)} placeholder="none" /></Field>
    <Field label="Opacity">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="range" min="0" max="1" step="0.05" value={s.opacity ?? 1} onChange={e => set('opacity', parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', minWidth: '30px' }}>{Math.round((s.opacity ?? 1) * 100)}%</span>
      </div>
    </Field>
  </div>;
}

export function SectionStylePanel({ section, onChange }: { section: Section; onChange: (style: SectionStyle) => void }) {
  const s = section.style;
  const set = (key: string, val: string) => onChange({ ...s, [key]: val });

  return <div>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>Section Style</h3>
    
    <ColorField label="Background Color" value={s.backgroundColor || '#0a0a0a'} onChange={v => set('backgroundColor', v)} />
    
    <Field label="Gradient">
      <input style={inputStyle} value={s.backgroundGradient || ''} onChange={e => set('backgroundGradient', e.target.value)} placeholder="linear-gradient(...)" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '8px' }}>
        {GRADIENT_PRESETS.map((g, i) => (
          <button key={i} onClick={() => set('backgroundGradient', g)} style={{ width: '100%', height: '24px', background: g, border: s.backgroundGradient === g ? '2px solid #fff' : '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }} title={g} />
        ))}
      </div>
    </Field>

    <Field label="Background Image URL"><input style={inputStyle} value={s.backgroundImage || ''} onChange={e => set('backgroundImage', e.target.value)} placeholder="https://..." /></Field>
    <Field label="Padding"><input style={inputStyle} value={s.padding || ''} onChange={e => set('padding', e.target.value)} placeholder="80px 24px" /></Field>
    <Field label="Min Height"><input style={inputStyle} value={s.minHeight || ''} onChange={e => set('minHeight', e.target.value)} placeholder="100vh" /></Field>

    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginTop: '20px', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>Theme Presets</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
      {THEME_PRESETS.map(t => (
        <button key={t.id} onClick={() => onChange({ ...s, backgroundColor: t.bg })} style={{ padding: '8px', background: t.bg, border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ display: 'block', color: t.text, fontSize: '0.75rem', fontWeight: 600 }}>{t.name}</span>
          <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.accent }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.text }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.secondary }} />
          </div>
        </button>
      ))}
    </div>
  </div>;
}

export function PageSettingsPanel({ settings, onChange }: { settings: any; onChange: (s: any) => void }) {
  const set = (key: string, val: string) => onChange({ ...settings, [key]: val });
  return <div>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>Page Settings</h3>
    <Field label="Page Title"><input style={inputStyle} value={settings.title || ''} onChange={e => set('title', e.target.value)} placeholder="My Page" /></Field>
    <Field label="Meta Description"><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={settings.description || ''} onChange={e => set('description', e.target.value)} placeholder="Page description for SEO" /></Field>
    <Field label="OG Image URL"><input style={inputStyle} value={settings.ogImage || ''} onChange={e => set('ogImage', e.target.value)} placeholder="https://..." /></Field>
    <Field label="Favicon (emoji or URL)"><input style={inputStyle} value={settings.favicon || ''} onChange={e => set('favicon', e.target.value)} placeholder="🚀 or https://..." /></Field>
    <Field label="Font">
      <select style={inputStyle} value={settings.fontFamily || 'Inter'} onChange={e => set('fontFamily', e.target.value)}>
        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
    </Field>
    <ColorField label="Page Background" value={settings.backgroundColor || '#0a0a0a'} onChange={v => set('backgroundColor', v)} />
    <Field label="Page Gradient"><input style={inputStyle} value={settings.backgroundGradient || ''} onChange={e => set('backgroundGradient', e.target.value)} placeholder="linear-gradient(...)" /></Field>
    <Field label="Custom CSS"><textarea style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }} rows={4} value={settings.customCSS || ''} onChange={e => set('customCSS', e.target.value)} placeholder="body { ... }" /></Field>
  </div>;
}
