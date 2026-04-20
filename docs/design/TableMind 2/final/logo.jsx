// Final logo system for Menu Card concept

// Primary mark — medallion with T, menu rules, dotted leader, ochre dot
function Mark({ size = 100, color, accent, showGuides = false, compact = false }) {
  const c = color || T.moss;
  const a = accent || T.ochre;
  if (compact) {
    // 1:1 tight — just medallion + T (for tiny uses, app icon)
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke={c} strokeWidth="2" />
        <rect x="28" y="38" width="44" height="3.5" fill={c} />
        <rect x="48.2" y="38" width="3.6" height="30" fill={c} />
        <circle cx="76" cy="50" r="3.2" fill={a} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 100 62" style={{ display: 'block' }}>
      {showGuides && (
        <g stroke="rgba(30,30,24,0.18)" strokeWidth="0.3" fill="none">
          <line x1="0" y1="18" x2="100" y2="18" strokeDasharray="2 2" />
          <line x1="0" y1="44" x2="100" y2="44" strokeDasharray="2 2" />
          <circle cx="30" cy="31" r="16" />
          <line x1="56" y1="31" x2="82" y2="31" strokeDasharray="1 1" />
          <line x1="30" y1="0" x2="30" y2="62" strokeDasharray="1 2" />
        </g>
      )}
      {/* two rules */}
      <line x1="2" y1="14" x2="98" y2="14" stroke={c} strokeWidth="2" />
      <line x1="2" y1="48" x2="98" y2="48" stroke={c} strokeWidth="2" />
      {/* medallion */}
      <circle cx="30" cy="31" r="16" fill="none" stroke={c} strokeWidth="1.6" />
      {/* T inside */}
      <rect x="20" y="23" width="20" height="2.6" fill={c} />
      <rect x="28.8" y="23" width="2.4" height="18" fill={c} />
      {/* dotted leader */}
      <line x1="56" y1="31" x2="82" y2="31" stroke={c} strokeWidth="1.3" strokeDasharray="1 3" strokeLinecap="round" />
      {/* ochre price dot */}
      <circle cx="86" cy="31" r="2.6" fill={a} />
    </svg>
  );
}

// 01 — Wordmark
function Wordmark({ size = 92, color }) {
  return (
    <div style={{ fontFamily: FH, fontWeight: 400, fontStyle: 'italic', fontSize: size, letterSpacing: -size*0.02, lineHeight: 0.9, color: color || T.ink }}>
      TableMind
    </div>
  );
}

// 03 — Lockup (horizontal)
function Lockup({ size = 32, color, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size*0.45 }}>
      <Mark size={size*2.2} color={color} accent={accent} />
      <div style={{ fontFamily: FH, fontWeight: 400, fontStyle: 'italic', fontSize: size, letterSpacing: -size*0.02, color: color || T.ink, lineHeight: 0.9 }}>
        TableMind
      </div>
    </div>
  );
}

// Stacked — for app icon, social
function Stacked({ size = 180, color, accent, bg }) {
  return (
    <div style={{
      width: size, height: size, background: bg || T.paper,
      border: `1.5px solid ${color || T.ink}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size*0.05,
      padding: size*0.08,
    }}>
      <Mark compact size={size*0.34} color={color} accent={accent} />
      <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: size*0.16, letterSpacing: -size*0.003, color: color || T.ink, lineHeight: 1 }}>
        TableMind
      </div>
      <div style={{ fontFamily: FM, fontSize: size*0.045, letterSpacing: 2, textTransform: 'uppercase', color: accent || T.ochre }}>
        N° 003
      </div>
    </div>
  );
}

Object.assign(window, { Mark, Wordmark, Lockup, Stacked });
