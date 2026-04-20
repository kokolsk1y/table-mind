// Shared UI primitives for the final brand system

function Rule({ weight = 1.5, color, style = {} }) {
  return <div style={{ height: weight, background: color || 'rgba(30,30,24,0.22)', ...style }} />;
}

function DottedLeader({ color }) {
  return (
    <div style={{ flex: 1, margin: '0 10px', borderBottom: `1px dotted ${color || 'rgba(30,30,24,0.35)'}`, alignSelf: 'end', marginBottom: 6 }} />
  );
}

function SectionLabel({ n, children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
      <div style={{ ...TX.eyebrow, color: color || T.ochre }}>N° {n}</div>
      <div style={{ ...TX.masthead, color: color ? color : T.stone }}>{children}</div>
    </div>
  );
}

function Swatch({ hex, name, token, light = false, w = 120 }) {
  return (
    <div style={{ width: w }}>
      <div style={{ width: w, height: 88, background: hex, border: light ? '1px solid rgba(0,0,0,0.08)' : 'none' }} />
      <div style={{ marginTop: 10, fontFamily: FB, fontSize: 12, fontWeight: 500, color: T.ink }}>{name}</div>
      <div style={{ fontFamily: FM, fontSize: 10, color: T.stone, marginTop: 2 }}>{hex.toUpperCase()}</div>
      {token && <div style={{ fontFamily: FM, fontSize: 9, color: '#9A927E', marginTop: 1 }}>{token}</div>}
    </div>
  );
}

function Placeholder({ w, h, label, dark = false, style = {} }) {
  const stripe = dark ? 'rgba(236,226,196,0.1)' : 'rgba(30,30,24,0.1)';
  const bg = dark ? '#2A2E24' : T.bone;
  return (
    <div style={{
      width: w, height: h, background: bg,
      backgroundImage: `repeating-linear-gradient(135deg, transparent 0 8px, ${stripe} 8px 9px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: dark ? 'rgba(236,226,196,0.55)' : 'rgba(30,30,24,0.55)',
      fontFamily: FM, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
      textAlign: 'center', padding: 8, ...style,
    }}>{label}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// 01 — LOGOS
function LogosArtboard() {
  return (
    <DCArtboard label="01 · Logo system" width={1180} height={640}>
      <div style={{ background: T.paper, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Masthead */}
        <div style={{ padding: '16px 40px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', ...TX.masthead }}>
          <span>TableMind · Identity</span>
          <span>N° 01 — LOGO SYSTEM</span>
          <span>EST. 2026</span>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.3fr 1fr', borderBottom: `1.5px solid ${T.line}` }}>
          {/* Primary — wordmark */}
          <div style={{ padding: '48px 48px', borderRight: `1.5px solid ${T.line}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <SectionLabel n="01·a">Primary wordmark</SectionLabel>
            <Wordmark size={108} />
            <div style={{ marginTop: 18, ...TX.italic, fontSize: 16 }}>
              Italic Playfair Display · recommended display size ≥ 36 px
            </div>
          </div>

          {/* Symbol */}
          <div style={{ padding: '48px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <SectionLabel n="01·b">Symbol</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              <Mark size={200} />
              <div>
                <div style={{ ...TX.small, lineHeight: 1.5 }}>
                  Две линейки карты,<br/>
                  медальон с буквой T,<br/>
                  охровая точка — цена.
                </div>
                <Rule style={{ margin: '14px 0', width: 120 }} />
                <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, color: T.stone }}>
                  RATIO 100 × 62
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lockup + sizes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flex: 1 }}>
          <div style={{ padding: '36px 40px', borderRight: `1.5px solid ${T.line}` }}>
            <SectionLabel n="01·c">Horizontal lockup</SectionLabel>
            <Lockup size={40} />
            <div style={{ marginTop: 20 }}><Lockup size={24} /></div>
            <div style={{ marginTop: 18 }}><Lockup size={14} /></div>
          </div>
          <div style={{ padding: '36px 40px', borderRight: `1.5px solid ${T.line}`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <SectionLabel n="01·d">Stacked / app icon</SectionLabel>
            <Stacked size={160} />
          </div>
          <div style={{ padding: '36px 40px' }}>
            <SectionLabel n="01·e">Clear space</SectionLabel>
            <div style={{ position: 'relative', display: 'inline-block', padding: 16, border: `1px dashed ${T.line}` }}>
              <Lockup size={24} />
              <div style={{ position: 'absolute', top: 2, left: 2, fontFamily: FM, fontSize: 9, color: T.stone, letterSpacing: 1 }}>x</div>
            </div>
            <div style={{ ...TX.small, marginTop: 12, lineHeight: 1.5 }}>
              Минимум <span style={{ fontFamily: FM }}>x</span> = высота «T» с каждой стороны. Не урезать.
            </div>
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

// ─────────────────────────────────────────────────────────────
// 02 — COLOR
function ColorArtboard() {
  return (
    <DCArtboard label="02 · Palette" width={860} height={640}>
      <div style={{ background: T.ivory, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 40px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', ...TX.masthead }}>
          <span>TableMind · Identity</span>
          <span>N° 02 — PALETTE</span>
          <span>CMYK · RGB · HEX</span>
        </div>

        <div style={{ padding: '32px 40px', flex: 1 }}>
          <SectionLabel n="02·a">Core — ink & accent</SectionLabel>
          <div style={{ display: 'flex', gap: 18 }}>
            <Swatch hex={T.moss}  name="Moss (primary)"    token="--green-900" />
            <Swatch hex={T.ink}   name="Press ink"         token="--ink" />
            <Swatch hex={T.ochre} name="Ochre (accent)"    token="--accent" />
            <Swatch hex={T.terracotta} name="Terracotta"   token="--accent-2" />
          </div>

          <Rule style={{ margin: '26px 0 20px' }} color={T.line} />
          <SectionLabel n="02·b">Paper stock — neutrals</SectionLabel>
          <div style={{ display: 'flex', gap: 18 }}>
            <Swatch hex={T.paper} name="Oat paper (bg)"    token="--bg"       light />
            <Swatch hex={T.ivory} name="Ivory (surface)"   token="--surface"  light />
            <Swatch hex={T.bone}  name="Bone"              token="--bone"     light />
            <Swatch hex={T.line}  name="Rule"              token="--line"     light />
            <Swatch hex={T.stone} name="Stone (muted fg)"  token="--muted" />
          </div>

          <Rule style={{ margin: '26px 0 20px' }} color={T.line} />
          <SectionLabel n="02·c">Support</SectionLabel>
          <div style={{ display: 'flex', gap: 18 }}>
            <Swatch hex={T.mossSoft} name="Moss soft" token="--green-600" />
            <Swatch hex={T.mossDeep} name="Moss deep" token="--green-950" />
            <Swatch hex={T.walnut}   name="Walnut"    token="--walnut" />
          </div>

          <div style={{ marginTop: 22, padding: '12px 16px', background: T.paper, borderLeft: `3px solid ${T.ochre}`, ...TX.small }}>
            <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.ochre, marginRight: 8 }}>Rule</span>
            Один зелёный как основной, один акцент — не смешивать два акцента в одном блоке. Никогда не чистый белый.
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

// ─────────────────────────────────────────────────────────────
// 03 — TYPOGRAPHY
function TypeArtboard() {
  return (
    <DCArtboard label="03 · Typography" width={860} height={720}>
      <div style={{ background: T.ivory, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 40px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', ...TX.masthead }}>
          <span>TableMind · Identity</span>
          <span>N° 03 — TYPOGRAPHY</span>
          <span>PLAYFAIR · DM SANS · JETBRAINS</span>
        </div>

        <div style={{ padding: '32px 40px', flex: 1 }}>
          <SectionLabel n="03·a">Display — Playfair italic</SectionLabel>
          <div style={{ ...TX.display, fontStyle: 'italic', fontSize: 88 }}>Carte du jour</div>

          <Rule style={{ margin: '24px 0 18px' }} color={T.line} />

          <SectionLabel n="03·b">Scale</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px', rowGap: 8, columnGap: 20, alignItems: 'baseline' }}>
            {[
              ['Display',  92, FH, 400, -2.4, 'italic'],
              ['H1',       56, FH, 400, -1.4, 'normal'],
              ['H2',       36, FH, 400, -0.8, 'italic'],
              ['H3',       24, FH, 400, -0.4, 'normal'],
              ['Lead',     18, FB, 400, 0, 'normal'],
              ['Body',     15, FB, 400, 0, 'normal'],
              ['Small',    13, FB, 400, 0, 'normal'],
              ['Meta',     11, FM, 500, 1.6, 'normal'],
            ].map(([name, size, ff, w, ls, st], i) => (
              <React.Fragment key={i}>
                <div style={{ fontFamily: FM, fontSize: 10, color: T.stone, letterSpacing: 1.5 }}>{name} · {size}</div>
                <div style={{ fontFamily: ff, fontWeight: w, fontSize: size, fontStyle: st, letterSpacing: ls, color: T.ink, lineHeight: 1.05, textTransform: name === 'Meta' ? 'uppercase' : 'none' }}>
                  {name === 'Meta' ? 'N° 07 · Table Seven' : 'Каре ягнёнка'}
                </div>
                <div style={{ fontFamily: FM, fontSize: 10, color: T.stone, textAlign: 'right' }}>{ff.split(',')[0].replace(/"/g, '')}</div>
              </React.Fragment>
            ))}
          </div>

          <Rule style={{ margin: '24px 0 18px' }} color={T.line} />
          <SectionLabel n="03·c">Rules of set</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['01', 'Цены и номера — моноширинные, tabular nums. Всегда.'],
              ['02', 'Названия блюд — DM Sans 600. Описания — Playfair italic 13–14.'],
              ['03', 'Между ценой и названием — dotted leader, а не пробел.'],
              ['04', 'Заголовки страниц — Playfair italic. Разделы меню — прописью с межбуквенным 2.'],
            ].map(([n, txt]) => (
              <div key={n} style={{ padding: 14, background: T.paper, borderLeft: `2px solid ${T.ochre}`, ...TX.small }}>
                <div style={{ fontFamily: FM, fontSize: 10, color: T.ochre, letterSpacing: 1.5, marginBottom: 4 }}>Rule {n}</div>
                {txt}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

// ─────────────────────────────────────────────────────────────
// 04 — COMPONENTS
function ComponentsArtboard() {
  return (
    <DCArtboard label="04 · Components" width={860} height={960}>
      <div style={{ background: T.ivory, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 40px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', ...TX.masthead }}>
          <span>TableMind · Identity</span>
          <span>N° 04 — COMPONENTS</span>
          <span>6 ATOMS</span>
        </div>

        <div style={{ padding: '28px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Buttons */}
          <div>
            <SectionLabel n="04·a">Buttons</SectionLabel>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button style={{ background: T.moss, color: T.paper, border: 'none', padding: '14px 22px', fontFamily: FB, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: FM, fontSize: 11, opacity: 0.7 }}>N° →</span>
                <span>Primary action</span>
              </button>
              <button style={{ background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}`, padding: '14px 22px', fontFamily: FB, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Secondary
              </button>
              <button style={{ background: 'transparent', color: T.ink, border: 'none', padding: '14px 6px', fontFamily: FB, fontSize: 13, fontWeight: 500, cursor: 'pointer', borderBottom: `1.5px solid ${T.ink}` }}>
                Inline link →
              </button>
              <button style={{ background: T.ink, color: T.paper, border: 'none', padding: '10px 16px', fontFamily: FM, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}>
                N° — Записаться
              </button>
            </div>
          </div>

          {/* Menu card */}
          <div>
            <SectionLabel n="04·b">Menu card (dish row)</SectionLabel>
            <div style={{ background: T.paper, padding: '4px 20px', borderTop: `1.5px solid ${T.ink}`, borderBottom: `1.5px solid ${T.ink}` }}>
              {[
                ['07', 'Дорадо на гриле', 'брокколини, лимонный айоли', '890'],
                ['08', 'Каре ягнёнка', 'пюре из пастернака, соус демигляс', '1 640'],
              ].map(([n, name, sub, p], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '14px 0', borderBottom: i === 0 ? `1px dotted ${T.line}` : 'none' }}>
                  <div style={{ fontFamily: FM, fontSize: 11, color: T.ochre, width: 34, fontWeight: 500 }}>{n}</div>
                  <div>
                    <div style={{ fontFamily: FB, fontSize: 15, fontWeight: 600, color: T.ink }}>{name}</div>
                    <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 13, color: T.stone, marginTop: 2 }}>{sub}</div>
                  </div>
                  <DottedLeader />
                  <div style={{ fontFamily: FM, fontSize: 14, fontWeight: 500, color: T.ink }}>{p} ₽</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <SectionLabel n="04·c">Navigation · masthead</SectionLabel>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: `1.5px solid ${T.ink}`, ...TX.masthead }}>
                <span>CARTE — N° 003</span>
                <span>20 · IV · 2026</span>
                <span>КАЛИНИНГРАД</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1.5px solid ${T.ink}` }}>
                <Lockup size={22} />
                <div style={{ display: 'flex', gap: 26, fontFamily: FB, fontSize: 13, color: T.ink, fontWeight: 500 }}>
                  <span>Метод</span><span>Карта</span><span>Верификатор</span><span>Тариф</span><span>Связь</span>
                </div>
                <button style={{ background: 'transparent', border: `1.5px solid ${T.ink}`, padding: '8px 14px', fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.ink, cursor: 'pointer' }}>
                  N° → Записаться
                </button>
              </div>
            </div>
          </div>

          {/* Hero block */}
          <div>
            <SectionLabel n="04·d">Hero block (atom)</SectionLabel>
            <div style={{ background: T.moss, color: T.paper, padding: 28, borderTop: `2px solid ${T.ochre}` }}>
              <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, color: T.ochre, marginBottom: 8 }}>N° 01 — ENTRÉE</div>
              <div style={{ fontFamily: FH, fontWeight: 400, fontSize: 32, letterSpacing: -0.8, lineHeight: 1.05 }}>
                <span style={{ fontStyle: 'italic' }}>AI-официант,</span> который знает ваше меню.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Form field */}
            <div>
              <SectionLabel n="04·e">Form field</SectionLabel>
              <div>
                <label style={{ display: 'block', ...TX.masthead, marginBottom: 6 }}>Название заведения</label>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1.5px solid ${T.ink}`, paddingBottom: 8 }}>
                  <span style={{ fontFamily: FM, fontSize: 11, color: T.ochre, marginRight: 10 }}>N°</span>
                  <input placeholder="Kitchen on the Baltic" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: FB, fontSize: 15, color: T.ink }} defaultValue="Kitchen on the Baltic" />
                  <span style={{ fontFamily: FM, fontSize: 10, color: T.stone }}>22 / 80</span>
                </div>
              </div>
            </div>

            {/* Badges / chips */}
            <div>
              <SectionLabel n="04·f">Badges</SectionLabel>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  ['локально', T.moss],
                  ['vegan', T.mossSoft],
                  ['острое', T.terracotta],
                  ['без глютена', T.walnut],
                  ['шеф-рекомендация', T.ochre],
                ].map(([t, c]) => (
                  <span key={t} style={{ fontFamily: FM, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: c, border: `1px solid ${c}`, padding: '4px 10px', fontWeight: 500 }}>
                    · {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

Object.assign(window, { Rule, DottedLeader, SectionLabel, Swatch, Placeholder, LogosArtboard, ColorArtboard, TypeArtboard, ComponentsArtboard });
