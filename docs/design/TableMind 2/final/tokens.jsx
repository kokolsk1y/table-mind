// Brand tokens — finalised for Menu Card

const T = {
  // Core
  ink:       '#1C1D17',   // near-black press ink
  paper:     '#F2EADA',   // warm oat paper
  ivory:     '#FAF6EB',
  bone:      '#E6DCC2',
  stone:     '#6B665A',
  line:      '#CDC3A6',
  lineSoft:  '#DED3B3',

  // Greens
  moss:      '#3B4A34',
  mossSoft:  '#5D6E52',
  mossDeep:  '#28331F',

  // Accents
  ochre:     '#B8812A',
  terracotta:'#A8442A',
  walnut:    '#6B4B2E',

  // Dark mode surfaces
  inkDark:   '#141812',
  paperDark: '#1E231B',
  fgDark:    '#ECE2C4',
  lineDark:  'rgba(236,226,196,0.18)',
};

// Font stacks
const FH = '"Playfair Display", "Times New Roman", serif';     // heading italic display
const FB = '"DM Sans", system-ui, sans-serif';                  // body
const FM = '"JetBrains Mono", "Menlo", monospace';              // numbers / meta

// Text styles
const TX = {
  masthead: { fontFamily: FM, fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.stone },
  eyebrow:  { fontFamily: FM, fontSize: 10, letterSpacing: 2,   textTransform: 'uppercase', color: T.ochre, fontWeight: 500 },
  display:  { fontFamily: FH, fontWeight: 400, fontSize: 92,  letterSpacing: -2.4, lineHeight: 0.94, color: T.ink },
  h1:       { fontFamily: FH, fontWeight: 400, fontSize: 56,  letterSpacing: -1.4, lineHeight: 1.0,  color: T.ink },
  h2:       { fontFamily: FH, fontWeight: 400, fontSize: 36,  letterSpacing: -0.8, lineHeight: 1.05, color: T.ink },
  h3:       { fontFamily: FH, fontWeight: 400, fontSize: 24,  letterSpacing: -0.4, lineHeight: 1.15, color: T.ink },
  lead:     { fontFamily: FB, fontSize: 18,    lineHeight: 1.55, color: '#2E2C25', fontWeight: 400 },
  body:     { fontFamily: FB, fontSize: 15,    lineHeight: 1.6,  color: '#2E2C25', fontWeight: 400 },
  small:    { fontFamily: FB, fontSize: 13,    lineHeight: 1.5,  color: T.stone },
  numeric:  { fontFamily: FM, fontSize: 14,    fontWeight: 500,  color: T.ink, fontFeatureSettings: '"tnum"' },
  italic:   { fontFamily: FH, fontStyle: 'italic', fontWeight: 400, color: T.stone },
};

Object.assign(window, { T, FH, FB, FM, TX });
