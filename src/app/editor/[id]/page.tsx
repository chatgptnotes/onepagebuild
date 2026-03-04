'use client';
import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import { SiteData, Section, PageElement } from '@/lib/types';
import { storage } from '@/lib/storage';
import { exportToHTML } from '@/lib/export-html';
import { templates } from '@/lib/templates';
import { HistoryManager } from '@/lib/history';
import { v4 as uuid } from 'uuid';
import ElementRenderer from '@/components/ElementRenderer';
import { ElementStylePanel, SectionStylePanel, PageSettingsPanel } from '@/components/StylePanel';
import AddPanel from '@/components/AddPanel';
import ErrorBoundary from '@/components/ErrorBoundary';
import { supabase } from '@/lib/supabase';

type Viewport = 'desktop' | 'tablet' | 'phone';
const viewportWidths: Record<Viewport, string> = { desktop: '100%', tablet: '768px', phone: '375px' };

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [site, setSite] = useState<SiteData | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportError, setExportError] = useState('');
  const [publishSlug, setPublishSlug] = useState('');
  const [publishStatus, setPublishStatus] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [saveIndicator, setSaveIndicator] = useState('');
  const historyRef = useRef(new HistoryManager<SiteData>());

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
      } else {
        // Blank page
        loaded = {
          id: uuid(), name: 'Untitled', title: 'Untitled',
          sections: [{ id: uuid(), elements: [], style: { padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0f172a' } }],
          settings: { title: 'Untitled', description: '', favicon: '', ogImage: '', backgroundColor: '#0a0a0a', customCSS: '', fontFamily: 'Inter' },
          createdAt: Date.now(), updatedAt: Date.now()
        };
        storage.saveSite(loaded);
      }
    }
    setSite(loaded);
    historyRef.current.push(loaded);
  }, [id]);

  // Auto-save
  useEffect(() => {
    if (!site) return;
    const timer = setTimeout(() => {
      storage.saveSite(site);
      setSaveIndicator('Saved');
      setTimeout(() => setSaveIndicator(''), 1500);
    }, 1500);
    return () => clearTimeout(timer);
  }, [site]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicateElement(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (site) { storage.saveSite(site); setSaveIndicator('Saved!'); setTimeout(() => setSaveIndicator(''), 1500); } }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedElement) { e.preventDefault(); deleteElement(); } }
      if (e.key === 'Escape') { setSelectedElement(null); setSelectedSection(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const updateSite = useCallback((fn: (s: SiteData) => SiteData) => {
    setSite(prev => {
      if (!prev) return prev;
      const next = fn(prev);
      historyRef.current.push(next);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.undo();
    if (prev) setSite(prev);
  }, []);

  const redo = useCallback(() => {
    const next = historyRef.current.redo();
    if (next) setSite(next);
  }, []);

  const addElement = useCallback((el: PageElement) => {
    updateSite(s => {
      if (selectedSection) {
        return { ...s, sections: s.sections.map(sec => sec.id === selectedSection ? { ...sec, elements: [...sec.elements, el] } : sec) };
      }
      if (s.sections.length === 0) {
        return { ...s, sections: [{ id: uuid(), elements: [el], style: { padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '60vh', backgroundColor: '#111' } }] };
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

  const duplicateElement = useCallback(() => {
    if (!selectedElement || !site) return;
    for (const sec of site.sections) {
      const idx = sec.elements.findIndex(e => e.id === selectedElement);
      if (idx >= 0) {
        const clone = { ...JSON.parse(JSON.stringify(sec.elements[idx])), id: uuid() };
        updateSite(s => ({
          ...s, sections: s.sections.map(sc => sc.id === sec.id ? { ...sc, elements: [...sc.elements.slice(0, idx + 1), clone, ...sc.elements.slice(idx + 1)] } : sc)
        }));
        setSelectedElement(clone.id);
        break;
      }
    }
  }, [selectedElement, site, updateSite]);

  const moveElement = useCallback((dir: -1 | 1) => {
    if (!selectedElement || !site) return;
    updateSite(s => ({
      ...s, sections: s.sections.map(sec => {
        const idx = sec.elements.findIndex(e => e.id === selectedElement);
        if (idx < 0) return sec;
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= sec.elements.length) return sec;
        const arr = [...sec.elements];
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        return { ...sec, elements: arr };
      })
    }));
  }, [selectedElement, site, updateSite]);

  const deleteSection = useCallback(() => {
    if (!selectedSection) return;
    updateSite(s => ({ ...s, sections: s.sections.filter(sec => sec.id !== selectedSection) }));
    setSelectedSection(null); setSelectedElement(null);
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

  const cloneSite = useCallback(() => {
    if (!site) return;
    const clone: SiteData = { ...JSON.parse(JSON.stringify(site)), id: uuid(), name: site.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() };
    storage.saveSite(clone);
    window.open(`/editor/${clone.id}`, '_blank');
  }, [site]);

  const doExport = () => {
    if (storage.isAuthenticated()) downloadHTML();
    else setShowExportModal(true);
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
    if (storage.authenticate(exportPassword)) { setExportError(''); downloadHTML(); }
    else setExportError('Wrong password');
  };

  const publishSite = async () => {
    if (!site || !publishSlug) return;
    setPublishStatus('Publishing...');
    try {
      const { error } = await supabase.from('sites').upsert({
        id: site.id, name: site.name, title: site.title || site.name,
        sections: site.sections, settings: site.settings,
        template_id: site.templateId, is_public: true, updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      const url = `${window.location.origin}/s/${publishSlug}`;
      setPublishedUrl(url);
      setPublishStatus('Published! ✅');
    } catch (err: any) {
      setPublishStatus(`Error: ${err.message}`);
    }
  };

  const getSelectedEl = (): PageElement | null => {
    if (!site || !selectedElement) return null;
    for (const sec of site.sections) { const el = sec.elements.find(e => e.id === selectedElement); if (el) return el; }
    return null;
  };
  const getSelectedSec = (): Section | null => {
    if (!site || !selectedSection) return null;
    return site.sections.find(s => s.id === selectedSection) || null;
  };

  if (!site) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#e2e8f0' }}>Loading...</div>;

  const selEl = getSelectedEl();
  const selSec = getSelectedSec();

  return <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
    {/* Top bar */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '52px', borderBottom: '1px solid #1e293b', background: '#0b1120', flexShrink: 0, gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>◆ PurePage.co</a>
        <input value={site.name} onChange={e => setSite({ ...site, name: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '4px', width: '150px' }} onFocus={e => e.currentTarget.style.background = '#1e293b'} onBlur={e => e.currentTarget.style.background = 'transparent'} />
        {saveIndicator && <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ {saveIndicator}</span>}
      </div>

      <div style={{ display: 'flex', gap: '2px', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
        {(['desktop','tablet','phone'] as Viewport[]).map(v => (
          <button key={v} onClick={() => setViewport(v)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: viewport === v ? '#6366f1' : 'transparent', color: viewport === v ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
            {v === 'desktop' ? '🖥' : v === 'tablet' ? '📱' : '📲'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={undo} disabled={!historyRef.current.canUndo()} style={{ padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: historyRef.current.canUndo() ? '#e2e8f0' : '#475569', cursor: 'pointer', fontSize: '0.8rem' }} title="Undo (Ctrl+Z)">↩</button>
        <button onClick={redo} disabled={!historyRef.current.canRedo()} style={{ padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: historyRef.current.canRedo() ? '#e2e8f0' : '#475569', cursor: 'pointer', fontSize: '0.8rem' }} title="Redo (Ctrl+Y)">↪</button>
        <div style={{ width: '1px', height: '24px', background: '#1e293b' }} />
        <button onClick={() => setShowSettingsPanel(!showSettingsPanel)} style={{ padding: '6px 12px', background: showSettingsPanel ? '#6366f1' : '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>⚙</button>
        <button onClick={cloneSite} style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }} title="Clone Site">📋</button>
        <a href={`/preview/${site.id}`} target="_blank" style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem' }}>Preview</a>
        <button onClick={doExport} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #6366f1', borderRadius: '6px', color: '#a5b4fc', cursor: 'pointer', fontSize: '0.85rem' }}>Export</button>
        <button onClick={() => setShowPublishModal(true)} style={{ padding: '6px 14px', background: '#6366f1', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Publish</button>
      </div>
    </div>

    {/* Main area */}
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ width: '200px', borderRight: '1px solid #1e293b', padding: '16px', overflowY: 'auto', flexShrink: 0, background: '#0b1120' }}>
        <AddPanel onAdd={addElement} />
        <div style={{ marginTop: '16px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
          <button onClick={addSection} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>+ New Section</button>
        </div>
        {/* Shortcuts help */}
        <div style={{ marginTop: '20px', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Shortcuts</p>
          <div style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.8 }}>
            <div>Ctrl+Z — Undo</div>
            <div>Ctrl+Y — Redo</div>
            <div>Ctrl+D — Duplicate</div>
            <div>Ctrl+S — Save</div>
            <div>Del — Delete element</div>
            <div>Esc — Deselect</div>
            <div>Double-click — Edit text</div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', background: '#080c14', padding: '24px' }}
        onClick={(e) => { if (e.target === e.currentTarget) { setSelectedElement(null); setSelectedSection(null); setShowSettingsPanel(false); } }}>
        <div style={{ width: viewportWidths[viewport], maxWidth: '100%', transition: 'width 0.3s ease', background: site.settings.backgroundGradient || site.settings.backgroundColor || '#0a0a0a', borderRadius: viewport !== 'desktop' ? '16px' : '0', overflow: 'hidden', boxShadow: viewport !== 'desktop' ? '0 0 40px rgba(0,0,0,0.5)' : 'none' }}>
          {site.sections.map((section) => {
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

            return <div key={section.id} style={sStyle} onClick={(e) => { e.stopPropagation(); setSelectedSection(section.id); setSelectedElement(null); setShowSettingsPanel(false); }}>
              {selectedSection === section.id && <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '3px', zIndex: 10 }}>
                <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, -1); }} style={{ padding: '4px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.7rem' }}>↑</button>
                <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 1); }} style={{ padding: '4px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.7rem' }}>↓</button>
                <button onClick={(e) => { e.stopPropagation(); deleteSection(); }} style={{ padding: '4px 8px', background: '#dc2626', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
              </div>}
              {section.elements.map(el => (
                <ElementRenderer key={el.id} element={el} selected={selectedElement === el.id}
                  onClick={() => { setSelectedElement(el.id); setSelectedSection(section.id); setShowSettingsPanel(false); }}
                  onContentChange={(content) => updateSite(s => ({
                    ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.map(e => e.id === el.id ? { ...e, content } : e) }))
                  }))}
                />
              ))}
              {section.elements.length === 0 && <div style={{ color: '#334155', fontSize: '0.9rem', padding: '40px', border: '2px dashed #1e293b', borderRadius: '12px' }}>Click elements from the left panel to add here</div>}
            </div>;
          })}
          <button onClick={addSection} style={{ width: '100%', padding: '40px', background: 'transparent', border: '2px dashed #1e293b', color: '#334155', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#334155'; }}>
            + Add Section
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '270px', borderLeft: '1px solid #1e293b', padding: '16px', overflowY: 'auto', flexShrink: 0, background: '#0b1120' }}>
        {showSettingsPanel ? <PageSettingsPanel settings={site.settings} onChange={(settings) => setSite({ ...site, settings })} />
        : selEl ? <>
          <ElementStylePanel element={selEl} 
            onChange={(style) => updateSite(s => ({ ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.map(e => e.id === selEl.id ? { ...e, style } : e) })) }))}
            onContentChange={(content) => updateSite(s => ({ ...s, sections: s.sections.map(sec => ({ ...sec, elements: sec.elements.map(e => e.id === selEl.id ? { ...e, content } : e) })) }))}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            <button onClick={() => moveElement(-1)} style={{ flex: 1, padding: '7px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>↑ Move Up</button>
            <button onClick={() => moveElement(1)} style={{ flex: 1, padding: '7px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>↓ Move Down</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button onClick={duplicateElement} style={{ flex: 1, padding: '7px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>📋 Duplicate</button>
            <button onClick={deleteElement} style={{ flex: 1, padding: '7px', background: '#1e293b', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}>🗑 Delete</button>
          </div>
        </> : selSec ? <SectionStylePanel section={selSec} onChange={(style) => updateSite(s => ({
          ...s, sections: s.sections.map(sec => sec.id === selSec.id ? { ...sec, style } : sec)
        }))} />
        : <div style={{ color: '#334155', fontSize: '0.85rem', textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>👆</p>
          <p>Click an element to edit its style</p>
          <p style={{ marginTop: '8px', fontSize: '0.75rem' }}>Or click ⚙ for page settings</p>
        </div>}
      </div>
    </div>

    {/* Export modal */}
    {showExportModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }} onClick={() => setShowExportModal(false)}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '380px', maxWidth: '90vw', border: '1px solid #334155' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>🔒 Export Protected</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Enter password to download HTML</p>
        <input type="password" value={exportPassword} onChange={e => { setExportPassword(e.target.value); setExportError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleExportAuth()} placeholder="Password" autoFocus
          style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem', marginBottom: '8px' }} />
        {exportError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>{exportError}</p>}
        <button onClick={handleExportAuth} style={{ width: '100%', padding: '12px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '8px' }}>Unlock & Download</button>
      </div>
    </div>}

    {/* Publish modal */}
    {showPublishModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }} onClick={() => setShowPublishModal(false)}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '420px', maxWidth: '90vw', border: '1px solid #334155' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>🚀 Publish Site</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Get a shareable link for your page</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>purepage.co/s/</span>
          <input value={publishSlug} onChange={e => setPublishSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="my-site" autoFocus
            style={{ flex: 1, padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }} />
        </div>
        {publishedUrl && <div style={{ padding: '12px', background: '#0f172a', borderRadius: '8px', marginBottom: '12px', wordBreak: 'break-all' }}>
          <a href={publishedUrl} target="_blank" style={{ color: '#6366f1', fontSize: '0.9rem' }}>{publishedUrl}</a>
        </div>}
        {publishStatus && <p style={{ color: publishStatus.includes('Error') ? '#ef4444' : '#22c55e', fontSize: '0.85rem', marginBottom: '8px' }}>{publishStatus}</p>}
        <button onClick={publishSite} style={{ width: '100%', padding: '12px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>
          {publishStatus === 'Publishing...' ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>}
  </div>;
}
