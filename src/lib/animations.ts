export const ANIMATIONS = [
  { id: 'none', label: 'None', config: {} },
  { id: 'fadeIn', label: 'Fade In', config: { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.6 } } },
  { id: 'slideUp', label: 'Slide Up', config: { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 } } },
  { id: 'slideDown', label: 'Slide Down', config: { initial: { opacity: 0, y: -40 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 } } },
  { id: 'slideLeft', label: 'Slide Left', config: { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 } } },
  { id: 'slideRight', label: 'Slide Right', config: { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 } } },
  { id: 'scaleUp', label: 'Scale Up', config: { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } } },
  { id: 'bounce', label: 'Bounce', config: { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, transition: { type: 'spring', bounce: 0.5, duration: 0.8 } } },
  { id: 'rotate', label: 'Rotate In', config: { initial: { opacity: 0, rotate: -10 }, whileInView: { opacity: 1, rotate: 0 }, transition: { duration: 0.5 } } },
  { id: 'blur', label: 'Blur In', config: { initial: { opacity: 0, filter: 'blur(10px)' }, whileInView: { opacity: 1, filter: 'blur(0px)' }, transition: { duration: 0.6 } } },
];

export const THEME_PRESETS = [
  { id: 'midnight', name: 'Midnight', bg: '#0f172a', accent: '#6366f1', text: '#e2e8f0', secondary: '#94a3b8' },
  { id: 'sunset', name: 'Sunset', bg: '#1a0a0a', accent: '#f97316', text: '#fef3c7', secondary: '#fdba74' },
  { id: 'ocean', name: 'Ocean', bg: '#042f2e', accent: '#14b8a6', text: '#ccfbf1', secondary: '#5eead4' },
  { id: 'royal', name: 'Royal', bg: '#1e1b4b', accent: '#a78bfa', text: '#ede9fe', secondary: '#c4b5fd' },
  { id: 'rose', name: 'Rosé', bg: '#1c0a14', accent: '#f472b6', text: '#fce7f3', secondary: '#f9a8d4' },
  { id: 'forest', name: 'Forest', bg: '#052e16', accent: '#22c55e', text: '#dcfce7', secondary: '#86efac' },
  { id: 'arctic', name: 'Arctic', bg: '#f0f9ff', accent: '#0284c7', text: '#0c4a6e', secondary: '#0369a1' },
  { id: 'mono', name: 'Mono', bg: '#0a0a0a', accent: '#ffffff', text: '#fafafa', secondary: '#a3a3a3' },
  { id: 'gold', name: 'Gold', bg: '#1a0f0a', accent: '#d4a574', text: '#fef3c7', secondary: '#c9a96e' },
  { id: 'neon', name: 'Neon', bg: '#0a0a0a', accent: '#22d3ee', text: '#ecfeff', secondary: '#06b6d4' },
];

export const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0c0c0c 100%)',
  'linear-gradient(180deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
  'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
  'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
];
