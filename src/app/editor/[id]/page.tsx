'use client';
import React, { useState, useEffect, useCallback, use } from 'react';
import { SiteData, Section, PageElement } from '@/lib/types';
import { storage } from '@/lib/storage';
import { exportToHTML } from '@/lib/export-html';
import { templates } from '@/lib/templates';
import { v4 as uuid } from 'uuid';
import ElementRenderer from '@/components/ElementRenderer';
import { ElementStylePanel, SectionStylePanel } from '@/components/StylePanel';
import AddPanel from '@/components/AddPanel';

type Viewport = 'desktop' | 'tablet' | 'phone';
const viewportWidths: Record<Viewport, string> = { desktop: '100%', tablet: '768px', phone: '375px' };

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [site, setSite] = useState<SiteData | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    let loaded = storage.getSite(id);
    if (!loaded) {
      const tmpl = templates.find(t => t.id === id);
      if (tmpl) {
        loaded = {
          id: uuid(), name: tmpl.name, title: tmpl.name,
          sections: JSON.parse(JSON.stringify(tmpl.sections)),
          settings: { ...tmpl.settings },
          createdAt: Date.now(), updatedAt: Date.now(), templateId: tmpl.id
        };
        storage.saveSite(loaded);
      }
    }
    setSite(loaded);
  }, [id]);

  // Auto-save
  useEffect(() => {
    if (!site) return;
    const timer = setTimeout(() => storage.saveSite(site), 2000);
    return () => clearTimeout(timer);
  }, [site]);

  const updateSite = useCallback((fn: (s: SiteData) => SiteData) => {
    setSite(prev => prev ? fn(prev) : prev);
  }, []);

  const addElement = useCallback((el: PageElement) => {
    const isNewSection = (el as any).__addSection;
    updateSite(s => {
      if (selectedSection) {
        return { ...s, sections: s.sections.map(sec => sec.id === selectedSection ? { ...sec, elements: [...sec.elements, el] } : sec) };
      }
      if (s.sections.length === 0 || isNewSection) {
        return { ...s, sections: [...s.sections, { id: uuid(), elements: [el], style: { padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '60vh', backgroundColor: '#111' } }] };
      }
      const last = s.sections[s.sections.length - 1];
      return { ...s, sections: s.sections.map(sec => sec.id === last.id ? { ...sec, elements: [...sec.elements, el] } : sec) };
    });
  }, [selectedSection, updateSite]);

  const addSection = useCallback(() => {
    updateSite(s => ({
      ...s, sections: [...s.sections, { id: uuid(), elements: [], style: { padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '60vh', backgroundColor: '#111' } }]
    }));
  }, [updateSite]);

  const deleteElement = useCallback(() => {
    if (!selectedElement) return;
    updateSite(s => ({
      ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.filter(e => e.id !== selectedElement) }))
    }));
    setSelectedElement(null);
  }, [selectedElement, updateSite]);

  const deleteSection = useCallback(() => {
    if (!selectedSection) return;
    updateSite(s => ({ ...s, sections: s.sections.filter(sec => sec.id !== selectedSection) }));
    setSelectedSection(null);
    setSelectedElement(null);
  }, [selectedSection, updateSite]);

  const moveSection = useCallback((sectionId: string, dir: -1 | 1) => {
    updateSite(s => {
      const idx = s.sections.findIndex(sec => sec.id === sectionId);
      if (idx < 0) return s;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= s.sections.length) return s;
      const arr = [...s.sections];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...s, sections: arr };
    });
  }, [updateSite]);

  const doExport = () => {
    if (storage.isAuthenticated()) {
      downloadHTML();
    } else {
      setShowExportModal(true);
    }
  };

  const downloadHTML = () => {
    if (!site) return;
    const html = exportToHTML(site);
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${site.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    setShowExportModal(false);
  };

  const handleExportAuth = () => {
    if (storage.authenticate(exportPassword)) {
      setExportError('');
      downloadHTML();
    } else {
      setExportError('Wrong password');
    }
  };

  const getSelectedEl = (): PageElement | null => {
    if (!site || !selectedElement) return null;
    for (const sec of site.sections) {
      const el = sec.elements.find(e => e.id === selectedElement);
      if (el) return el;
    }
    return null;
  };

  const getSelectedSec = (): Section | null => {
    if (!site || !selectedSection) return null;
    return site.sections.find(s => s.id === selectedSection) || null;
  };

  if (!site) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#e2e8f0' }}>Loading...</div>;

  const selEl = getSelectedEl();
  const selSec = getSelectedSec();

  return <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
    {/* Top bar */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '52px', borderBottom: '1px solid #1e293b', background: '#0b1120', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>◆ PurePage.co</a>
        <span style={{ color: '#475569', fontSize: '0.85rem' }}>/ {site.name}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
        {(['desktop','tablet','phone'] as Viewport[]).map(v => (
          <button key={v} onClick={() => setViewport(v)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: viewport === v ? '#6366f1' : 'transparent', color: viewport === v ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
            {v === 'desktop' ? '🖥' : v === 'tablet' ? '📱' : '📲'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={`/preview/${site.id}`} target="_blank" style={{ padding: '7px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem' }}>Preview</a>
        <button onClick={doExport} style={{ padding: '7px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>Export HTML</button>
      </div>
    </div>

    {/* Main area */}
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ width: '200px', borderRight: '1px solid #1e293b', padding: '16px', overflowY: 'auto', flexShrink: 0, background: '#0b1120' }}>
        <AddPanel onAdd={(el) => {
          const btn = document.querySelector('[data-add-section]');
          if ((el as any).type === 'heading' && btn && (event?.target as any)?.dataset?.addSection) {
            addSection();
          } else {
            addElement(el);
          }
        }} />
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', background: '#080c14', padding: '24px' }}
        onClick={(e) => { if (e.target === e.currentTarget) { setSelectedElement(null); setSelectedSection(null); } }}>
        <div style={{ width: viewportWidths[viewport], maxWidth: '100%', transition: 'width 0.3s', background: site.settings.backgroundGradient || site.settings.backgroundColor || '#0a0a0a' }}>
          {site.sections.map((section, si) => {
            const sStyle: React.CSSProperties = {
              padding: section.style.padding || '80px 24px',
              minHeight: section.style.minHeight || '60vh',
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '20px',
              ...(section.style.backgroundGradient ? { background: section.style.backgroundGradient } : {}),
              ...(section.style.backgroundColor && !section.style.backgroundGradient ? { backgroundColor: section.style.backgroundColor } : {}),
              ...(section.style.backgroundImage ? { backgroundImage: `url(${section.style.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
              outline: selectedSection === section.id ? '2px dashed #6366f1' : '2px dashed transparent',
              outlineOffset: '-2px', cursor: 'pointer', position: 'relative' as const, transition: 'outline 0.15s',
            };

            return <div key={section.id} style={sStyle} onClick={(e) => { e.stopPropagation(); setSelectedSection(section.id); setSelectedElement(null); }}>
              {/* Section controls */}
              {selectedSection === section.id && <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
                <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, -1); }} style={{ padding: '4px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.7rem' }}>↑</button>
                <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 1); }} style={{ padding: '4px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.7rem' }}>↓</button>
                <button onClick={(e) => { e.stopPropagation(); deleteSection(); }} style={{ padding: '4px 8px', background: '#dc2626', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
              </div>}
              {section.elements.map(el => (
                <ElementRenderer key={el.id} element={el} selected={selectedElement === el.id}
                  onClick={() => { setSelectedElement(el.id); setSelectedSection(section.id); }}
                  onContentChange={(content) => updateSite(s => ({
                    ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.map(e => e.id === el.id ? { ...e, content } : e) }))
                  }))}
                />
              ))}
              {section.elements.length === 0 && <div style={{ color: '#475569', fontSize: '0.9rem' }}>Empty section — add elements from the left panel</div>}
            </div>;
          })}
          <button onClick={addSection} style={{ width: '100%', padding: '40px', background: 'transparent', border: '2px dashed #1e293b', color: '#475569', cursor: 'pointer', fontSize: '0.9rem', marginTop: '4px', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}>
            + Add Section
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '260px', borderLeft: '1px solid #1e293b', padding: '16px', overflowY: 'auto', flexShrink: 0, background: '#0b1120' }}>
        {selEl ? <>
          <ElementStylePanel element={selEl} onChange={(style) => updateSite(s => ({
            ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.map(e => e.id === selEl.id ? { ...e, style } : e) }))
          }))} />
          <button onClick={deleteElement} style={{ width: '100%', marginTop: '16px', padding: '8px', background: '#dc2626', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>Delete Element</button>
        </> : selSec ? <>
          <SectionStylePanel section={selSec} onChange={(style) => updateSite(s => ({
            ...s, sections: s.sections.map(sec => sec.id === selSec.id ? { ...sec, style } : sec)
          }))} />
        </> : <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
          Click an element or section to edit its style
        </div>}
      </div>
    </div>

    {/* Export password modal */}
    {showExportModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowExportModal(false)}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '360px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔒 Export Protected</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Enter password to download HTML</p>
        <input type="password" value={exportPassword} onChange={e => { setExportPassword(e.target.value); setExportError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleExportAuth()}
          placeholder="Password" autoFocus
          style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem', marginBottom: '8px' }} />
        {exportError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>{exportError}</p>}
        <button onClick={handleExportAuth} style={{ width: '100%', padding: '12px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, marginTop: '8px' }}>Unlock & Download</button>
      </div>
    </div>}
  </div>;
}
