// PWA — finalized guest experience. Light + dark variants side by side.

function PwaScreen({ dark = false, screen = 'menu' }) {
  const bg    = dark ? T.inkDark  : T.paper;
  const surf  = dark ? T.paperDark: T.ivory;
  const fg    = dark ? T.fgDark   : T.ink;
  const muted = dark ? 'rgba(236,226,196,0.6)' : T.stone;
  const line  = dark ? T.lineDark : 'rgba(30,30,24,0.22)';
  const lineSoft = dark ? 'rgba(236,226,196,0.12)' : T.line;

  const items = [
    { n: '01', name: 'Сельдь по-балтийски',  sub: 'печёная свёкла, хрен',        price: '420', tag: 'локально' },
    { n: '02', name: 'Тартар из говядины',   sub: 'перепелиный желток, каперсы', price: '690' },
    { n: '03', name: 'Крем из тыквы',        sub: 'тимьяновое масло, фундук',    price: '480', tag: 'vegan' },
    { n: '04', name: 'Карпаччо из свёклы',   sub: 'козий сыр, грецкий орех',     price: '520' },
    { n: '05', name: 'Салат из печёных овощей', sub: 'тахинный соус, дукка',     price: '560' },
    { n: '06', name: 'Бриошь с костным мозгом', sub: 'малдонская соль, лук-шалот',price: '640', tag: 'шеф' },
  ];

  return (
    <div style={{ width: 390, height: 844, background: bg, position: 'relative', overflow: 'hidden', fontFamily: FB, borderRadius: 40, border: `8px solid ${dark ? '#0A0C08' : '#1E1E18'}` }}>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 28px 6px', fontSize: 13, fontWeight: 600, color: fg }}>
        <span>9:41</span><span>●●● ◾</span>
      </div>

      {/* Masthead */}
      <div style={{ padding: '12px 20px', borderTop: `1.5px solid ${line}`, borderBottom: `1.5px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: FM, fontSize: 9, color: muted, letterSpacing: 1.5 }}>
        <span>CARTE — N° 003</span>
        <span>20 · IV · 26</span>
        <span>TABLE · 07</span>
      </div>

      {/* Title */}
      <div style={{ padding: '18px 20px 12px', borderBottom: `1.5px solid ${line}` }}>
        <Lockup size={20} color={fg} accent={T.ochre} />
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontWeight: 400, fontSize: 34, letterSpacing: -0.8, color: fg, marginTop: 12, lineHeight: 1 }}>
          Carte du jour
        </div>
        <div style={{ fontFamily: FB, fontSize: 13, color: muted, marginTop: 4 }}>сегодняшнее предложение шефа</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px', borderBottom: `1.5px solid ${line}` }}>
        {['I · Entrée', 'II · Plat', 'III · Vin', 'IV · Dessert'].map((tb, i) => (
          <div key={i} style={{
            padding: '12px 10px 12px 0', marginRight: 16,
            fontFamily: FM, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
            color: i === 0 ? fg : muted, fontWeight: i === 0 ? 600 : 400,
            borderBottom: i === 0 ? `2px solid ${T.ochre}` : 'none',
            marginBottom: -1.5,
          }}>{tb}</div>
        ))}
      </div>

      {/* Dish rows */}
      <div style={{ padding: '4px 20px', maxHeight: 520, overflow: 'hidden' }}>
        {items.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '14px 0', borderBottom: i < items.length - 1 ? `1px dotted ${lineSoft}` : 'none' }}>
            <div style={{ fontFamily: FM, fontSize: 10, color: T.ochre, fontWeight: 500, width: 22 }}>{d.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FB, fontWeight: 600, fontSize: 15, color: fg }}>{d.name}</div>
              <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 12, color: muted, marginTop: 2 }}>{d.sub}</div>
              {d.tag && (
                <span style={{ fontFamily: FM, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: T.ochre, border: `1px solid ${T.ochre}`, padding: '2px 6px', marginTop: 6, display: 'inline-block' }}>
                  · {d.tag}
                </span>
              )}
            </div>
            <div style={{ fontFamily: FM, fontSize: 13, color: fg, fontWeight: 500 }}>{d.price}</div>
          </div>
        ))}
      </div>

      {/* Ask bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 22px', borderTop: `1.5px solid ${line}`, background: surf }}>
        <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: 2, color: muted, marginBottom: 6 }}>N° → AI-ОФИЦИАНТ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontFamily: FH, fontStyle: 'italic', fontSize: 16, color: fg }}>
            спросите шефа…
          </div>
          <div style={{ width: 38, height: 38, background: T.moss, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="8" rx="2" fill={T.paper}/><path d="M2 7v1a5 5 0 0 0 10 0V7" stroke={T.paper} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function PwaArtboard() {
  return (
    <DCArtboard label="06 · PWA · экран меню (light + dark)" width={920} height={960}>
      <div style={{ background: T.ivory, width: '100%', height: '100%', padding: '28px 40px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1.5px solid ${T.line}`, ...TX.masthead }}>
          <span>TableMind · PWA</span>
          <span>N° 06 — GUEST EXPERIENCE</span>
          <span>390 × 844 · iOS / Android</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <PwaScreen dark={false} />
            <div style={{ ...TX.masthead }}>LIGHT · дневной режим</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <PwaScreen dark={true} />
            <div style={{ ...TX.masthead }}>DARK · вечер · свечи на столе</div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: '14px 18px', background: T.paper, borderLeft: `3px solid ${T.ochre}` }}>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, color: T.ochre, marginBottom: 4 }}>PWA — КРИТЕРИИ</div>
          <div style={{ ...TX.small }}>
            0 фото на первом экране · только CSS/SVG · шрифты subset (cyrillic + latin) — &lt;2 сек на 4G. Dark mode реально читаемый: moss как фон, oat как текст, охра как акцент. Без чёрного на чёрном.
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

Object.assign(window, { PwaArtboard, PwaScreen });
