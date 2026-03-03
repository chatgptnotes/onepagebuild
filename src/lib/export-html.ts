import { SiteData, Section, PageElement } from './types';

function renderElement(el: PageElement): string {
  const style = Object.entries(el.style || {})
    .filter(([,v]) => v !== undefined)
    .map(([k,v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
    .join('; ');

  switch (el.type) {
    case 'heading': {
      const level = (el.content.level as number) || 1;
      const text = (el.content.text as string) || '';
      return `<h${level} style="${style}">${text.replace(/\n/g, '<br>')}</h${level}>`;
    }
    case 'text':
      return `<p style="${style}">${((el.content.text as string) || '').replace(/\n/g, '<br>')}</p>`;
    case 'image':
      return `<img src="${el.content.url}" alt="${el.content.alt || ''}" style="${style}" />`;
    case 'button':
      return `<a href="${el.content.url || '#'}" style="display: inline-block; text-decoration: none; cursor: pointer; ${style}">${el.content.text}</a>`;
    case 'divider':
      return `<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.2); ${style}" />`;
    case 'social-links': {
      const links = (el.content.links as Record<string, string>) || {};
      const icons = Object.entries(links).map(([platform, url]) =>
        `<a href="${url}" style="color: inherit; text-decoration: none; margin: 0 8px; font-size: 1.2rem;" target="_blank">${platform}</a>`
      ).join('');
      return `<div style="display: flex; justify-content: center; ${style}">${icons}</div>`;
    }
    case 'countdown': {
      const target = el.content.targetDate as string;
      return `<div id="countdown-${el.id}" style="${style}" data-target="${target}">Loading...</div>
<script>
(function(){
  var el = document.getElementById('countdown-${el.id}');
  var target = new Date('${target}').getTime();
  setInterval(function(){
    var now = Date.now();
    var diff = target - now;
    if(diff<0){el.textContent='🎉 It\\'s here!';return;}
    var d=Math.floor(diff/86400000);
    var h=Math.floor((diff%86400000)/3600000);
    var m=Math.floor((diff%3600000)/60000);
    var s=Math.floor((diff%60000)/1000);
    el.textContent=d+'d '+h+'h '+m+'m '+s+'s';
  },1000);
})();
</script>`;
    }
    case 'form':
      return `<form style="display:flex;flex-direction:column;gap:12px;${style}" onsubmit="event.preventDefault();alert('Message sent!')">
  <input type="text" placeholder="Name" style="padding:12px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:1rem;" />
  <input type="email" placeholder="Email" style="padding:12px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:1rem;" />
  <textarea placeholder="Message" rows="4" style="padding:12px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:1rem;resize:vertical;"></textarea>
  <button type="submit" style="padding:12px 24px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">${el.content.buttonText || 'Send'}</button>
</form>`;
    case 'embed': {
      const url = el.content.url as string || '';
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || '';
      if (videoId) return `<iframe src="https://www.youtube.com/embed/${videoId}" style="width:100%;max-width:640px;aspect-ratio:16/9;border:none;border-radius:12px;${style}" allowfullscreen></iframe>`;
      return `<div style="${style}">Embed: ${url}</div>`;
    }
    default:
      return '';
  }
}

function renderSection(section: Section): string {
  const s = section.style || {};
  const bg = s.backgroundGradient 
    ? `background: ${s.backgroundGradient};`
    : s.backgroundImage 
      ? `background-image: url(${s.backgroundImage}); background-size: cover; background-position: center;`
      : s.backgroundColor ? `background-color: ${s.backgroundColor};` : '';
  
  const style = `${bg} padding: ${s.padding || '80px 24px'}; min-height: ${s.minHeight || 'auto'}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;`;
  
  return `<section style="${style}">\n${section.elements.map(renderElement).join('\n')}\n</section>`;
}

export function exportToHTML(site: SiteData): string {
  const s = site.settings;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.title || site.name}</title>
<meta name="description" content="${s.description || ''}">
${s.ogImage ? `<meta property="og:image" content="${s.ogImage}">` : ''}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: '${s.fontFamily || 'Inter'}', sans-serif; background: ${s.backgroundGradient || s.backgroundColor || '#0a0a0a'}; color: #fff; -webkit-font-smoothing: antialiased; }
img { max-width: 100%; height: auto; }
a { transition: opacity 0.2s; }
a:hover { opacity: 0.85; }
@media (max-width: 768px) {
  h1 { font-size: 2.5rem !important; }
  h2 { font-size: 1.5rem !important; }
  section { padding: 60px 16px !important; }
}
${s.customCSS || ''}
</style>
</head>
<body>
${site.sections.map(renderSection).join('\n')}
</body>
</html>`;
}
