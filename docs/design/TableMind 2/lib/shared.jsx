// Shared utilities + tweak state + common small components

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "greenChoice": "moss",
  "accentChoice": "ochre",
  "serifChoice": "per-concept",
  "dark": false
}/*EDITMODE-END*/;

const GREENS = {
  moss:   { name: 'Deep moss',   hex: '#3B4A34', fg: '#F3ECD8', soft: '#5A6B52' },
  forest: { name: 'Forest',      hex: '#2A3A2A', fg: '#EFE7D0', soft: '#506A50' },
  olive:  { name: 'Olive',       hex: '#4B5231', fg: '#F0E8CF', soft: '#6B754A' },
};
const ACCENTS = {
  ochre:      { name: 'Ochre',      hex: '#C48A2A' },
  terracotta: { name: 'Terracotta', hex: '#B55B3C' },
  curry:      { name: 'Curry',      hex: '#A77A1C' },
};
const SERIFS = {
  'per-concept': { name: 'Per concept', css: null },
  'fraunces':    { name: 'Fraunces',    css: '"Fraunces", serif' },
  'playfair':    { name: 'Playfair',    css: '"Playfair Display", serif' },
  'cormorant':   { name: 'Cormorant',   css: '"Cormorant Garamond", serif' },
  'ebgaramond':  { name: 'EB Garamond', css: '"EB Garamond", serif' },
};

// Tweaks store with subscribers
const tweakStore = (() => {
  let state = { ...TWEAK_DEFAULTS };
  const subs = new Set();
  return {
    get: () => state,
    set: (patch) => {
      state = { ...state, ...patch };
      subs.forEach((fn) => fn(state));
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    },
    sub: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

function useTweaks() {
  const [s, setS] = React.useState(tweakStore.get());
  React.useEffect(() => tweakStore.sub(setS), []);
  return s;
}

// Shared palette tokens for PWA/site — neutrals stay consistent
const NEUTRALS = {
  cream:  '#F3ECD8',  // oat background
  paper:  '#EFE7D0',  // warmer cream
  ivory:  '#FAF6EB',
  bone:   '#E8DFC6',
  ink:    '#1E1E18',
  stone:  '#57544C',
  line:   '#D9D0B6',
};

// Placeholder box — striped, with label — instead of hand-drawing SVG
function Placeholder({ w, h, label, light = false, radius = 0, style = {} }) {
  const bg = light ? '#EFE7D0' : '#D9D0B6';
  const stripe = light ? 'rgba(75,95,75,0.08)' : 'rgba(75,95,75,0.14)';
  return (
    <div style={{
      width: w, height: h, background: bg,
      backgroundImage: `repeating-linear-gradient(135deg, transparent 0 8px, ${stripe} 8px 9px)`,
      borderRadius: radius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(30,30,24,0.55)',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
      textAlign: 'center', padding: 12,
      ...style,
    }}>{label}</div>
  );
}

// Generic swatch
function Swatch({ hex, name, token, light = false, w = 120, h = 88 }) {
  return (
    <div style={{ width: w }}>
      <div style={{
        width: w, height: h, background: hex,
        borderRadius: 2,
        border: light ? '1px solid rgba(0,0,0,0.08)' : 'none',
      }} />
      <div style={{ marginTop: 8, fontSize: 11, letterSpacing: 0.3, color: '#1E1E18', fontWeight: 500 }}>{name}</div>
      <div style={{ fontSize: 10, color: '#57544C', fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>{hex.toUpperCase()}</div>
      {token && <div style={{ fontSize: 9, color: '#8A8472', fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>{token}</div>}
    </div>
  );
}

// Labeled section inside an artboard (not canvas-level)
function Block({ title, children, style = {}, pad = 40 }) {
  return (
    <div style={{ padding: pad, ...style }}>
      {title && (
        <div style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(30,30,24,0.5)',
          fontFamily: '"IBM Plex Mono", monospace',
          marginBottom: 20,
        }}>{title}</div>
      )}
      {children}
    </div>
  );
}

// Tiny caption under a logo
function Caption({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
      color: 'rgba(30,30,24,0.45)',
      fontFamily: '"IBM Plex Mono", monospace',
      marginTop: 14,
    }}>{children}</div>
  );
}

Object.assign(window, {
  TWEAK_DEFAULTS, GREENS, ACCENTS, SERIFS,
  tweakStore, useTweaks, NEUTRALS,
  Placeholder, Swatch, Block, Caption,
});
