// Concept C — MONOGRAM TM
// Mood: most premium, reserved, editorial. Ligature monogram. Minimal decoration.
// Type: Cormorant Garamond (heading) + Work Sans (body). Tight, quiet, confident.

function MonogramConcept() {
  const t = useTweaks();
  const green = GREENS[t.greenChoice].hex;
  const greenFg = GREENS[t.greenChoice].fg;
  const accent = ACCENTS[t.accentChoice].hex;
  const heading = SERIFS[t.serifChoice].css || '"Cormorant Garamond", serif';
  const body = '"Work Sans", sans-serif';
  const bg = t.dark ? green : NEUTRALS.paper;
  const fg = t.dark ? greenFg : NEUTRALS.ink;
  const line = t.dark ? 'rgba(243,236,216,0.18)' : 'rgba(30,30,24,0.14)';

  return (
    <DCSection
      title="C — Monogram TM"
      subtitle="Лигатурная монограмма · самый premium · минимум декора · тишина"
      gap={56}
    >
      {/* ── LOGOS ────────────────────────────────────────── */}
      <DCArtboard label="Логотипы · wordmark / symbol / lockup" width={760} height={560}>
        <div style={{ background: bg, width: '100%', height: '100%', padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ paddingBottom: 36, borderBottom: `1px solid ${line}` }}>
            <div style={{
              fontFamily: heading, fontWeight: 400, fontSize: 82,
              letterSpacing: -1.2, lineHeight: 1, color: fg,
              fontFeatureSettings: '"liga" on, "dlig" on',
            }}>
              TableMind
            </div>
            <Caption>01 — Wordmark · Cormorant Garamond</Caption>
          </div>

          <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end', paddingTop: 24 }}>
            <div>
              <TMMark size={140} color={fg} accent={accent} />
              <Caption>02 — Monogram</Caption>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${line}`, paddingLeft: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <TMMark size={58} color={fg} accent={accent} />
                <div style={{ height: 44, width: 1, background: line }} />
                <div>
                  <div style={{ fontFamily: heading, fontSize: 30, letterSpacing: -0.5, color: fg, lineHeight: 1 }}>TableMind</div>
                  <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginTop: 6, fontWeight: 500 }}>
                    AI-официант · Est. 2026
                  </div>
                </div>
              </div>
              <Caption>03 — Formal lockup</Caption>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── MONOGRAM construction ────────────────────────── */}
      <DCArtboard label="Монограмма · конструкция" width={360} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace' }}>Построение</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TMMark size={220} color={green} accent={accent} showGuides />
          </div>
          <div style={{ fontFamily: heading, fontSize: 17, fontStyle: 'italic', color: '#2E2C25', lineHeight: 1.45 }}>
            Перекладина T становится горизонталью стола. M вырастает из неё как сервировка — три столпа. Знак работает от 16 px до фасада.
          </div>
        </div>
      </DCArtboard>

      {/* ── COLOR ────────────────────────────────────────── */}
      <DCArtboard label="Палитра" width={520} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40 }}>
          <Block title="Primary" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={green} name="Moss" token="--ink-green" />
              <Swatch hex="#1E1E18" name="Ink" token="--ink" />
              <Swatch hex={accent} name="Ochre" token="--accent" />
            </div>
          </Block>
          <Block title="Neutrals" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={NEUTRALS.paper} name="Paper" token="--bg" light />
              <Swatch hex={NEUTRALS.ivory} name="Ivory" token="--surface" light />
              <Swatch hex={NEUTRALS.bone} name="Bone" token="--bone" light />
              <Swatch hex={NEUTRALS.stone} name="Stone" token="--muted" />
            </div>
          </Block>
          <Block title="Secondary" pad={0}>
            <div style={{ display: 'flex', gap: 14 }}>
              <Swatch hex={GREENS[t.greenChoice].soft} name="Moss soft" token="--green-600" />
              <Swatch hex="#6B5B3E" name="Walnut" token="--walnut" />
            </div>
          </Block>
        </div>
      </DCArtboard>

      {/* ── TYPE ─────────────────────────────────────────── */}
      <DCArtboard label="Типографика" width={620} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace' }}>
            Heading · {heading.split(',')[0].replace(/"/g, '')}
          </div>
          <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 76, letterSpacing: -1.8, lineHeight: 0.95, color: NEUTRALS.ink, marginTop: 6 }}>
            Каре ягнёнка
          </div>
          <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: green, marginTop: 2 }}>
            с пюре из пастернака
          </div>

          <div style={{ height: 1, background: line, margin: '28px 0 20px' }} />

          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace' }}>
            Body · Work Sans
          </div>
          <div style={{ fontFamily: body, fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: '#2E2C25', marginTop: 10, maxWidth: 480 }}>
            Гость сканирует QR — получает собеседника, который знает шеф-повара, помнит сегодняшние 86-й и 187-й, и подбирает пару к сегодняшнему белому без уговоров.
          </div>

          <div style={{ display: 'flex', gap: 22, marginTop: 24, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: heading, fontSize: 38, fontWeight: 400 }}>Display / 56–96</div>
            <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 22 }}>Italic / 20–28</div>
            <div style={{ fontFamily: body, fontSize: 14, color: '#57544C' }}>Body / 14–17</div>
            <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: accent, fontWeight: 600 }}>Eyebrow / 10–12</div>
          </div>

          <div style={{ marginTop: 28, padding: 18, border: `1px solid ${line}`, background: NEUTRALS.cream }}>
            <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 4 }}>Правило</div>
            <div style={{ fontFamily: body, fontSize: 13, color: '#2E2C25', lineHeight: 1.5 }}>
              Никаких декоративных линий, рукописи или эмодзи. Только: serif, sans, моноширинная цифра. Тишина — главный элемент.
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── COMPONENTS ───────────────────────────────────── */}
      <DCArtboard label="Компоненты" width={520} height={720}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Primary button</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{ background: NEUTRALS.ink, color: NEUTRALS.cream, border: 'none', padding: '14px 24px', fontFamily: body, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, borderRadius: 0, cursor: 'pointer' }}>
                Записаться на пилот
              </button>
              <button style={{ background: 'transparent', color: NEUTRALS.ink, border: `1px solid ${NEUTRALS.ink}`, padding: '14px 24px', fontFamily: body, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, borderRadius: 0, cursor: 'pointer' }}>
                Как это работает
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Dish card</div>
            <div style={{ background: NEUTRALS.cream, padding: '22px 24px', borderTop: `1px solid ${NEUTRALS.ink}`, borderBottom: `1px solid ${NEUTRALS.ink}`, display: 'flex', gap: 16 }}>
              <div style={{ fontFamily: body, fontSize: 10, color: '#8A8472', fontFeatureSettings: '"tnum"', letterSpacing: 1, width: 28 }}>N° 07</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 22, letterSpacing: -0.4, color: NEUTRALS.ink }}>
                  Дорадо на гриле
                </div>
                <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: '#57544C', marginTop: 2 }}>
                  с брокколини и лимонным айоли
                </div>
              </div>
              <div style={{ fontFamily: heading, fontSize: 20, fontWeight: 400, color: NEUTRALS.ink, fontFeatureSettings: '"tnum"' }}>890</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Navigation</div>
            <div style={{ background: bg, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <TMMark size={22} color={fg} accent={accent} />
                <span style={{ fontFamily: heading, fontWeight: 400, fontSize: 20, color: fg, letterSpacing: -0.4 }}>TableMind</span>
              </div>
              <div style={{ display: 'flex', gap: 26, fontFamily: body, fontSize: 11, color: fg, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500 }}>
                <span>Метод</span><span>Тариф</span><span>Контакты</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Hero block</div>
            <div style={{ background: bg, padding: 28, borderTop: `3px solid ${accent}` }}>
              <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 8 }}>
                N° 01 — Introduction
              </div>
              <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 32, letterSpacing: -0.8, color: fg, lineHeight: 1.05 }}>
                AI-официант,<br/><span style={{ fontStyle: 'italic', fontWeight: 300 }}>который знает ваше меню.</span>
              </div>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── HERO MOCKUP ──────────────────────────────────── */}
      <DCArtboard label="Сайт · hero-секция" width={1200} height={720}>
        <MonoHero green={green} greenFg={greenFg} accent={accent} heading={heading} body={body} />
      </DCArtboard>

      {/* ── PWA ──────────────────────────────────────────── */}
      <DCArtboard label="PWA · экран меню (гость)" width={380} height={720}>
        <MonoPwa green={green} greenFg={greenFg} accent={accent} heading={heading} body={body} dark={t.dark} />
      </DCArtboard>

      <DCPostIt top={200} left={-210} rotate={2}>
        Монограмма: самая premium. Работает на ресторан fine-dining тоже. Тишина и интервалы — главный приём.
      </DCPostIt>
    </DCSection>
  );
}

// ─── TM ligature mark ──────────────────────────────────────
function TMMark({ size = 100, color = '#3B4A34', accent = '#C48A2A', showGuides = false }) {
  // T with horizontal serif that flows into M's outer stems
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {showGuides && (
        <g stroke="rgba(75,95,75,0.25)" strokeWidth="0.4" fill="none">
          <rect x="12" y="24" width="76" height="52" />
          <line x1="50" y1="24" x2="50" y2="76" />
          <line x1="12" y1="32" x2="88" y2="32" />
        </g>
      )}
      {/* T crossbar (also table line) */}
      <rect x="12" y="30" width="76" height="4" fill={color} />
      {/* T stem */}
      <rect x="48" y="30" width="4" height="42" fill={color} />
      {/* M — three verticals hanging from the crossbar like place settings */}
      <rect x="22" y="30" width="3" height="46" fill={color} />
      <rect x="50" y="30" width="3" height="46" fill={color} />
      <rect x="75" y="30" width="3" height="46" fill={color} />
      {/* M inner peaks */}
      <path d="M 22 30 L 36 60 L 50 30" fill="none" stroke={color} strokeWidth="3" />
      <path d="M 50 30 L 64 60 L 78 30" fill="none" stroke={color} strokeWidth="3" />
      {/* Accent — small ochre dot where threads meet */}
      <circle cx="36" cy="60" r="2.2" fill={accent} />
      <circle cx="64" cy="60" r="2.2" fill={accent} />
    </svg>
  );
}

function MonoHero({ green, greenFg, accent, heading, body }) {
  return (
    <div style={{ background: NEUTRALS.paper, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top meta bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 48px', borderBottom: `1px solid rgba(30,30,24,0.14)`, fontFamily: body, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#57544C' }}>
        <span>Калининград · самозанятый</span>
        <span>Est. 2026 — N° 003</span>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: `1px solid rgba(30,30,24,0.14)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TMMark size={26} color={green} accent={accent} />
          <span style={{ fontFamily: heading, fontWeight: 400, fontSize: 22, letterSpacing: -0.4, color: NEUTRALS.ink }}>TableMind</span>
        </div>
        <div style={{ display: 'flex', gap: 34, fontFamily: body, fontSize: 11, color: NEUTRALS.ink, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500 }}>
          <span>Метод</span><span>Верификатор</span><span>Тариф</span><span>Связь</span>
        </div>
        <div style={{ fontFamily: body, fontSize: 11, color: NEUTRALS.ink, border: `1px solid ${NEUTRALS.ink}`, padding: '10px 16px', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500 }}>
          Записаться
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, padding: '70px 48px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60 }}>
        <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 36 }}>
          <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 18 }}>
            N° 01 — Introduction
          </div>
          <h1 style={{ fontFamily: heading, fontWeight: 400, fontSize: 96, letterSpacing: -2.4, lineHeight: 0.94, color: NEUTRALS.ink, margin: 0 }}>
            AI-официант,<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: green }}>который знает</span><br/>
            ваше меню.
          </h1>
          <p style={{ fontFamily: body, fontSize: 16, lineHeight: 1.55, color: '#2E2C25', maxWidth: 440, marginTop: 32, fontWeight: 400 }}>
            Для ресторанов на 15–50 столов. Один самозанятый делает руками первые три внедрения. Без пресейла, без ООО, без красивых слов.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <button style={{ background: NEUTRALS.ink, color: NEUTRALS.cream, border: 'none', padding: '16px 28px', fontFamily: body, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
              Записаться на пилот
            </button>
            <button style={{ background: 'transparent', color: NEUTRALS.ink, border: `1px solid ${NEUTRALS.ink}`, padding: '16px 28px', fontFamily: body, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
              Смотреть метод
            </button>
          </div>
        </div>

        {/* Index — numbers that matter */}
        <div>
          <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#57544C', fontWeight: 500, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid rgba(30,30,24,0.14)` }}>
            Index — numbers that matter
          </div>
          {[
            ['I', '< 1.4 s', 'средний ответ AI'],
            ['II', '97 %', 'точность верификатора'],
            ['III', '12', 'языков ввода'],
            ['IV', '~ 3 ₽', 'себестоимость / диалог'],
            ['V', '0', 'клиентских кейсов — пока'],
          ].map(([n, v, l], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: `1px solid rgba(30,30,24,0.08)` }}>
              <div style={{ fontFamily: body, fontSize: 10, letterSpacing: 2, color: '#8A8472', width: 28 }}>{n}</div>
              <div style={{ fontFamily: heading, fontSize: 30, fontWeight: 400, letterSpacing: -0.8, color: NEUTRALS.ink, fontFeatureSettings: '"tnum"' }}>{v}</div>
              <div style={{ fontFamily: body, fontSize: 12, color: '#57544C', textAlign: 'right', flex: 1, paddingLeft: 16 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonoPwa({ green, greenFg, accent, heading, body, dark }) {
  const bg = dark ? '#1A1F17' : NEUTRALS.paper;
  const fg = dark ? '#EFE7D0' : NEUTRALS.ink;
  const muted = dark ? 'rgba(239,231,208,0.6)' : '#57544C';
  const line = dark ? 'rgba(239,231,208,0.16)' : 'rgba(30,30,24,0.14)';

  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden', fontFamily: body }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px 8px', fontSize: 12, fontWeight: 600, color: fg }}>
        <span>9:41</span><span>●●● ◾</span>
      </div>

      <div style={{ padding: '18px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TMMark size={22} color={fg} accent={accent} />
          <div style={{ fontFamily: heading, fontSize: 20, color: fg, letterSpacing: -0.4 }}>TableMind</div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: muted }}>Table · 07</div>
      </div>

      <div style={{ padding: '24px 22px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 10 }}>
          Carte du jour · 20/04
        </div>
        <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 34, letterSpacing: -0.8, lineHeight: 1, color: fg }}>
          Сегодняшнее<br/><span style={{ fontStyle: 'italic', fontWeight: 300 }}>меню</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 20, padding: '14px 22px 0', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, borderBottom: `1px solid ${line}` }}>
        <span style={{ color: fg, fontWeight: 600, borderBottom: `2px solid ${accent}`, paddingBottom: 10 }}>I · Entrées</span>
        <span style={{ paddingBottom: 10 }}>II · Plats</span>
        <span style={{ paddingBottom: 10 }}>III · Vins</span>
        <span style={{ paddingBottom: 10 }}>IV · Desserts</span>
      </div>

      {/* Dish list — roman numerals, tabular nums, italic subtitle */}
      <div style={{ padding: '6px 22px' }}>
        {[
          { n: 'I',   name: 'Сельдь по-балтийски', sub: 'печёная свёкла, хрен', price: '420' },
          { n: 'II',  name: 'Тартар из говядины',  sub: 'перепелиный желток, каперсы', price: '690' },
          { n: 'III', name: 'Крем из тыквы',       sub: 'тимьяновое масло, фундук', price: '480' },
          { n: 'IV',  name: 'Карпаччо из свёклы',  sub: 'козий сыр, грецкий орех', price: '520' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '16px 0', borderBottom: i < 3 ? `1px solid ${line}` : 'none', alignItems: 'baseline' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: muted, width: 26 }}>{d.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 17, color: fg, letterSpacing: -0.3 }}>{d.name}</div>
              <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 12, color: muted, marginTop: 1 }}>{d.sub}</div>
            </div>
            <div style={{ fontFamily: heading, fontSize: 16, color: fg, fontFeatureSettings: '"tnum"' }}>{d.price}</div>
          </div>
        ))}
      </div>

      {/* AI footer — single silent line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 22px', borderTop: `1px solid ${line}`, background: bg, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: `1px solid ${fg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TMMark size={16} color={fg} accent={accent} />
        </div>
        <div style={{ flex: 1, fontSize: 12, color: muted, letterSpacing: 0.3 }}>Спросить — напишите или говорите</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: muted, textTransform: 'uppercase' }}>RU</div>
      </div>
    </div>
  );
}

Object.assign(window, { MonogramConcept });
