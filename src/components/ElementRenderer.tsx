'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageElement } from '@/lib/types';
import { ANIMATIONS } from '@/lib/animations';

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

function getAnimProps(animId?: string) {
  if (!animId || animId === 'none') return {};
  const anim = ANIMATIONS.find(a => a.id === animId);
  if (!anim) return {};
  return { ...anim.config, viewport: { once: true, margin: '-50px' } };
}

export default function ElementRenderer({ element, selected, onClick, onContentChange, isPreview }: {
  element: PageElement;
  selected: boolean;
  onClick: () => void;
  onContentChange?: (content: Record<string, unknown>) => void;
  isPreview?: boolean;
}) {
  const animId = element.content?.animation as string;
  const animProps = getAnimProps(animId);
  const Wrapper = animId && animId !== 'none' ? motion.div : 'div';
  
  const style: React.CSSProperties = { 
    ...element.style as any, 
    cursor: isPreview ? 'default' : 'pointer', 
    outline: selected ? '2px solid #6366f1' : '2px solid transparent', 
    outlineOffset: '4px', 
    transition: 'outline 0.15s' 
  };

  const handleDoubleClick = (field: string) => {
    if (!onContentChange || isPreview) return;
    const current = element.content[field] as string || '';
    const val = prompt('Edit:', current);
    if (val !== null) onContentChange({ ...element.content, [field]: val });
  };

  const renderInner = () => {
    switch (element.type) {
      case 'heading': {
        const level = (element.content.level as number) || 1;
        const text = (element.content.text as string) || 'Heading';
        const Tag = (['h1','h2','h3','h4'] as const)[level - 1] || 'h1';
        return React.createElement(Tag, { style, onClick, onDoubleClick: () => handleDoubleClick('text') },
          text.split('\n').map((line: string, i: number) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)
        );
      }
      case 'text':
        return <p style={style} onClick={onClick} onDoubleClick={() => handleDoubleClick('text')}>{((element.content.text as string) || 'Text').split('\n').map((line: string, i: number) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</p>;
      case 'image':
        return <img src={element.content.url as string || 'https://placehold.co/600x400/1a1a2e/6366f1?text=Click+to+set+image'} alt={element.content.alt as string || ''} style={style} onClick={onClick} onDoubleClick={() => handleDoubleClick('url')} />;
      case 'button': {
        const href = element.content.url as string || '#';
        if (isPreview) return <a href={href} target="_blank" rel="noopener" style={{ ...style, display: 'inline-block', textDecoration: 'none' }}>{element.content.text as string || 'Button'}</a>;
        return <span style={{ ...style, display: 'inline-block', textDecoration: 'none' }} onClick={onClick} onDoubleClick={() => handleDoubleClick('text')}>{element.content.text as string || 'Button'}</span>;
      }
      case 'divider':
        return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', width: '60px', ...style }} onClick={onClick} />;
      case 'social-links': {
        const links = (element.content.links as Record<string, string>) || {};
        const iconMap: Record<string, string> = { twitter: '𝕏', github: '⊙', linkedin: 'in', instagram: '📷', youtube: '▶', tiktok: '♪', facebook: 'f', dribbble: '◎', behance: 'Bē', medium: 'M', email: '✉' };
        return <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', ...style }} onClick={onClick}>
          {Object.entries(links).map(([p, url]) => 
            isPreview ? <a key={p} href={url} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8, fontSize: '1.3rem' }}>{iconMap[p] || p}</a>
            : <span key={p} style={{ opacity: 0.8, fontSize: '1.3rem' }}>{iconMap[p] || p}</span>
          )}
        </div>;
      }
      case 'countdown':
        return <div onClick={onClick}><CountdownRenderer targetDate={element.content.targetDate as string || '2026-12-31'} style={style} /></div>;
      case 'form':
        return <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', ...style }} onClick={onClick}>
          {((element.content.fields as string[]) || ['name','email','message']).map((field: string) => 
            field === 'message' 
              ? <textarea key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} rows={3} style={{ padding: '14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', resize: 'none', backdropFilter: 'blur(4px)' }} readOnly />
              : <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} style={{ padding: '14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', backdropFilter: 'blur(4px)' }} readOnly />
          )}
          <button style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>{element.content.buttonText as string || 'Send'}</button>
        </div>;
      case 'embed': {
        const url = element.content.url as string || '';
        const vid = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        return vid 
          ? <iframe src={`https://www.youtube.com/embed/${vid}`} style={{ width: '100%', maxWidth: '640px', aspectRatio: '16/9', border: 'none', borderRadius: '12px', ...style as any }} onClick={onClick} allowFullScreen />
          : <div style={{ ...style, padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.15)' }} onClick={onClick} onDoubleClick={() => handleDoubleClick('url')}>📹 Double-click to set video URL</div>;
      }
      case 'icon':
        return <div style={style} onClick={onClick}>{element.content.emoji as string || '★'}</div>;
      default:
        return <div style={style} onClick={onClick}>Unknown element</div>;
    }
  };

  if (Wrapper === 'div') return renderInner();
  return <Wrapper {...animProps as any}>{renderInner()}</Wrapper>;
}
