'use client';
import React, { useState, useEffect } from 'react';
import { PageElement } from '@/lib/types';

function CountdownRenderer({ targetDate, style }: { targetDate: string; style: React.CSSProperties }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff < 0) { setTime('🎉 It\'s here!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [targetDate]);
  return <div style={style}>{time}</div>;
}

export default function ElementRenderer({ element, selected, onClick, onContentChange }: {
  element: PageElement;
  selected: boolean;
  onClick: () => void;
  onContentChange?: (content: Record<string, unknown>) => void;
}) {
  const style: React.CSSProperties = { ...element.style as any, cursor: 'pointer', outline: selected ? '2px solid #6366f1' : '2px solid transparent', outlineOffset: '4px', transition: 'outline 0.15s' };

  const handleDoubleClick = (field: string) => {
    if (!onContentChange) return;
    const current = element.content[field] as string || '';
    const val = prompt('Edit:', current);
    if (val !== null) onContentChange({ ...element.content, [field]: val });
  };

  switch (element.type) {
    case 'heading': {
      const Tag = `h${element.content.level || 1}` as any;
      return <Tag style={style} onClick={onClick} onDoubleClick={() => handleDoubleClick('text')}>{((element.content.text as string) || 'Heading').split('\n').map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</Tag>;
    }
    case 'text':
      return <p style={style} onClick={onClick} onDoubleClick={() => handleDoubleClick('text')}>{((element.content.text as string) || 'Text').split('\n').map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</p>;
    case 'image':
      return <img src={element.content.url as string || 'https://placehold.co/600x400/1a1a2e/6366f1?text=Image'} alt={element.content.alt as string || ''} style={style} onClick={onClick} onDoubleClick={() => handleDoubleClick('url')} />;
    case 'button':
      return <span style={{ ...style, display: 'inline-block', textDecoration: 'none' }} onClick={onClick} onDoubleClick={() => handleDoubleClick('text')}>{element.content.text as string || 'Button'}</span>;
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', ...style }} onClick={onClick} />;
    case 'social-links': {
      const links = (element.content.links as Record<string, string>) || {};
      return <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', ...style }} onClick={onClick}>
        {Object.keys(links).map(p => <span key={p} style={{ opacity: 0.8 }}>{p === 'twitter' ? '𝕏' : p === 'github' ? '⊙' : p === 'linkedin' ? 'in' : p === 'instagram' ? '📷' : p}</span>)}
      </div>;
    }
    case 'countdown':
      return <div onClick={onClick}><CountdownRenderer targetDate={element.content.targetDate as string || '2026-12-31'} style={style} /></div>;
    case 'form':
      return <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...style }} onClick={onClick}>
        <input placeholder="Name" style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} readOnly />
        <input placeholder="Email" style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} readOnly />
        <textarea placeholder="Message" rows={3} style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', resize: 'none' }} readOnly />
        <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'default' }}>{element.content.buttonText as string || 'Send'}</button>
      </div>;
    case 'embed': {
      const url = element.content.url as string || '';
      const vid = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return vid ? <iframe src={`https://www.youtube.com/embed/${vid}`} style={{ width: '100%', maxWidth: '640px', aspectRatio: '16/9', border: 'none', borderRadius: '12px', ...style }} onClick={onClick} /> : <div style={{ ...style, padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }} onClick={onClick}>📹 Double-click to set video URL</div>;
    }
    default:
      return <div style={style} onClick={onClick}>Unknown element</div>;
  }
}
