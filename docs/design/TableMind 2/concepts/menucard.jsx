// Concept D — MENU CARD
// Mood: brand IS menu typography. Ruled lines, dish numbers, tabular figures,
// header with date and "table n°". Most editorial of the three — like a carte.
// Type: Playfair Display (heading) + DM Sans (body) + JetBrains Mono (numbers).

function MenuCardConcept() {
  const t = useTweaks();
  const green = GREENS[t.greenChoice].hex;
  const greenFg = GREENS[t.greenChoice].fg;
  const accent = ACCENTS[t.accentChoice].hex;
  const heading = SERIFS[t.serifChoice].css || '"Playfair Display", serif';
  const body = '"DM Sans", sans-serif';
  const mono = '"JetBrains Mono", monospace';
  const bg = t.dark ? green : NEUTRALS.cream;
  const fg = t.dark ? greenFg : NEUTRALS.ink;
  const line = t.dark ? 'rgba(243,236,216,0.2)' : 'rgba(30,30,24,0.2)';

  return (
    <DCSection
      title="D — Menu Card"
      subtitle="Бренд = типографика меню · линейки, номера блюд, шапка карты · самый редакционный"
      gap={56}
    >
      {/* ── LOGOS ────────────────────────────────────────── */}
      <DCArtboard label="Логотипы · wordmark / symbol / lockup" width={760} height={560}>
        <div style={{ background: bg, width: '100%', height: '100%', padding: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Masthead */}
          <div style={{ padding: '20px 48px 14px', borderBottom: `1.5px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10, color: t.dark ? 'rgba(243,236,216,0.7)' : '#57544C', letterSpacing: 1.5 }}>
            <span>CARTE — N° 003</span>
            <span>20 · IV · 2026</span>
            <span>TABLE — 07</span>
          </div>

          {/* Wordmark */}
          <div style={{ flex: 1, padding: '28px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 92, letterSpacing: -1.6, lineHeight: 0.9, color: fg, fontStyle: 'italic' }}>
              TableMind
            </div>
            <div style={{ height: 1, background: line, margin: '16px 0', width: '100%' }} />
            <div style={{ fontFamily: body, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: accent, fontWeight: 500 }}>
              — An AI-официант — Ressortissant of the Menu —
            </div>
          </div>

          {/* Bottom row: symbol + small lockup */}
          <div style={{ padding: '24px 48px', borderTop: `1.5px solid ${line}`, display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <CardMark size={64} color={fg} accent={accent} />
              <Caption>02 — Symbol</Caption>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CardMark size={32} color={fg} accent={accent} />
              <span style={{ fontFamily: heading, fontWeight: 400, fontStyle: 'italic', fontSize: 24, letterSpacing: -0.4, color: fg }}>TableMind</span>
              <Caption>03 — Lockup</Caption>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── MARK construction ────────────────────────────── */}
      <DCArtboard label="Знак · спецификация" width={360} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono }}>Specification</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardMark size={220} color={green} accent={accent} showGuides />
          </div>
          <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 17, color: '#2E2C25', lineHeight: 1.45 }}>
            Шапка меню: две линейки, T в медальоне как нумератор блюда. Знак читается как «строка из меню» — самая честная метафора продукта.
          </div>
        </div>
      </DCArtboard>

      {/* ── COLOR ────────────────────────────────────────── */}
      <DCArtboard label="Палитра" width={520} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40 }}>
          <Block title="Core" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={green} name="Moss" token="--ink" />
              <Swatch hex={accent} name="Ochre" token="--accent" />
              <Swatch hex="#1E1E18" name="Press black" token="--press" />
            </div>
          </Block>
          <Block title="Neutrals (paper stock)" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={NEUTRALS.cream} name="Oat" token="--bg" light />
              <Swatch hex={NEUTRALS.paper} name="Paper" token="--paper" light />
              <Swatch hex={NEUTRALS.bone} name="Bone" token="--bone" light />
              <Swatch hex={NEUTRALS.stone} name="Stone" token="--muted" />
            </div>
          </Block>
          <Block title="Secondary" pad={0}>
            <div style={{ display: 'flex', gap: 14 }}>
              <Swatch hex={GREENS[t.greenChoice].soft} name="Moss soft" />
              <Swatch hex="#A8442A" name="Terracotta" />
            </div>
          </Block>
        </div>
      </DCArtboard>

      {/* ── TYPE ─────────────────────────────────────────── */}
      <DCArtboard label="Типографика" width={620} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono }}>
            Heading · {heading.split(',')[0].replace(/"/g, '')} · italic display
          </div>
          <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 400, fontSize: 72, letterSpacing: -1.6, lineHeight: 0.95, color: NEUTRALS.ink, marginTop: 6 }}>
            Carte du jour
          </div>
          <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 22, color: green, marginTop: 4 }}>
            сегодняшнее предложение шефа
          </div>

          <div style={{ height: 1.5, background: 'rgba(30,30,24,0.22)', margin: '24px 0 16px' }} />

          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono }}>Body · DM Sans</div>
          <div style={{ fontFamily: body, fontSize: 15, lineHeight: 1.55, color: '#2E2C25', marginTop: 10, maxWidth: 480 }}>
            Система набора, как в печатной карте ресторана. Strong/regular для названий блюд; italic serif — для описаний и подзаголовков; моноширинная — для цен и номеров.
          </div>

          <div style={{ height: 1.5, background: 'rgba(30,30,24,0.22)', margin: '16px 0' }} />

          <div style={{ display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 40 }}>Display / 56–92</div>
            <div style={{ fontFamily: heading, fontSize: 22 }}>H2 / 22–28</div>
            <div style={{ fontFamily: body, fontSize: 14 }}>Body / 14–16</div>
            <div style={{ fontFamily: mono, fontSize: 12 }}>N° 07  ·  890 ₽</div>
          </div>

          <div style={{ marginTop: 24, padding: 18, background: NEUTRALS.cream, borderLeft: `3px solid ${accent}` }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 4 }}>Rule N° 01</div>
            <div style={{ fontFamily: body, fontSize: 13, color: '#2E2C25' }}>
              Цены и номера — моноширинной. Всегда. Никакой пропорциональной цифры в таблицах.
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── COMPONENTS ───────────────────────────────────── */}
      <DCArtboard label="Компоненты" width={520} height={720}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono, marginBottom: 12 }}>Primary button</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{ background: green, color: greenFg, border: 'none', padding: '14px 22px', fontFamily: body, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 11, opacity: 0.7 }}>N°</span>
                <span>Записаться на пилот</span>
              </button>
              <button style={{ background: 'transparent', color: green, border: `1.5px solid ${green}`, padding: '14px 22px', fontFamily: body, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Смотреть карту
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono, marginBottom: 12 }}>Menu row (card)</div>
            <div style={{ background: NEUTRALS.cream, padding: '18px 20px', borderTop: `1.5px solid ${NEUTRALS.ink}`, borderBottom: `1.5px solid ${NEUTRALS.ink}`, display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: accent, fontWeight: 500, width: 28 }}>07</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: body, fontWeight: 600, fontSize: 16, color: NEUTRALS.ink }}>Дорадо на гриле</div>
                <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 13, color: '#57544C', marginTop: 1 }}>
                  с брокколини и лимонным айоли
                </div>
              </div>
              <div style={{ flex: 1, borderBottom: `1px dotted rgba(30,30,24,0.3)`, alignSelf: 'center', margin: '0 12px' }} />
              <div style={{ fontFamily: mono, fontSize: 14, color: NEUTRALS.ink, fontWeight: 500 }}>890 ₽</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono, marginBottom: 12 }}>Navigation (masthead)</div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10, color: '#57544C', letterSpacing: 1.5, paddingBottom: 8, borderBottom: `1.5px solid ${NEUTRALS.ink}` }}>
                <span>CARTE — N° 003</span><span>20 · IV · 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1.5px solid ${NEUTRALS.ink}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CardMark size={22} color={NEUTRALS.ink} accent={accent} />
                  <span style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 22, letterSpacing: -0.3, color: NEUTRALS.ink }}>TableMind</span>
                </div>
                <div style={{ display: 'flex', gap: 20, fontFamily: body, fontSize: 12, color: NEUTRALS.ink, fontWeight: 500 }}>
                  <span>Метод</span><span>Карта</span><span>Тариф</span><span>Связь</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: mono, marginBottom: 12 }}>Hero block</div>
            <div style={{ background: bg, padding: 24, borderTop: `2px solid ${fg}`, borderBottom: `2px solid ${fg}` }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 2, color: accent, marginBottom: 8 }}>N° 01 — ENTRÉE</div>
              <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 400, fontSize: 32, letterSpacing: -0.8, color: fg, lineHeight: 1.05 }}>
                AI-официант,<br/>который знает ваше меню.
              </div>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── HERO ─────────────────────────────────────────── */}
      <DCArtboard label="Сайт · hero-секция" width={1200} height={720}>
        <CardHero green={green} greenFg={greenFg} accent={accent} heading={heading} body={body} mono={mono} />
      </DCArtboard>

      {/* ── PWA ──────────────────────────────────────────── */}
      <DCArtboard label="PWA · экран меню (гость)" width={380} height={720}>
        <CardPwa green={green} greenFg={greenFg} accent={accent} heading={heading} body={body} mono={mono} dark={t.dark} />
      </DCArtboard>

      <DCPostIt top={200} left={-210} rotate={-2}>
        Menu Card: бренд живёт прямо внутри меню. Самый редакционный — и самый лёгкий для PWA: чистая типографика, 0 графики.
      </DCPostIt>
    </DCSection>
  );
}

// ─── Card mark: nameplate + T inside ornamental dot ──────
function CardMark({ size = 100, color = '#3B4A34', accent = '#C48A2A', showGuides = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {showGuides && (
        <g stroke="rgba(75,95,75,0.25)" strokeWidth="0.4" fill="none">
          <line x1="8" y1="30" x2="92" y2="30" />
          <line x1="8" y1="70" x2="92" y2="70" />
          <circle cx="50" cy="50" r="22" />
        </g>
      )}
      {/* two rules — top & bottom of a menu row */}
      <line x1="8" y1="28" x2="92" y2="28" stroke={color} strokeWidth="2" />
      <line x1="8" y1="72" x2="92" y2="72" stroke={color} strokeWidth="2" />
      {/* dotted leader between name and price */}
      <line x1="56" y1="50" x2="82" y2="50" stroke={color} strokeWidth="1.2" strokeDasharray="1 3" />
      {/* ornamental medallion with T */}
      <circle cx="30" cy="50" r="16" fill="none" stroke={color} strokeWidth="1.5" />
      {/* T inside medallion */}
      <rect x="20" y="42" width="20" height="2.5" fill={color} />
      <rect x="28.8" y="42" width="2.4" height="18" fill={color} />
      {/* ochre accent dot — the "price dot" */}
      <circle cx="86" cy="50" r="2.4" fill={accent} />
    </svg>
  );
}

function CardHero({ green, greenFg, accent, heading, body, mono }) {
  return (
    <div style={{ background: NEUTRALS.cream, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Masthead meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 48px', fontFamily: mono, fontSize: 10, color: '#57544C', letterSpacing: 1.5, borderBottom: `1.5px solid rgba(30,30,24,0.2)` }}>
        <span>CARTE — N° 003 — TABLEMIND</span>
        <span>ИЗДАНИЕ 20 · IV · 2026</span>
        <span>КАЛИНИНГРАД — РФ</span>
      </div>

      {/* Title row */}
      <div style={{ padding: '20px 48px 16px', borderBottom: `1.5px solid rgba(30,30,24,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <CardMark size={30} color={NEUTRALS.ink} accent={accent} />
          <span style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 28, letterSpacing: -0.4, color: NEUTRALS.ink }}>TableMind</span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontFamily: body, fontSize: 13, color: NEUTRALS.ink, fontWeight: 500 }}>
          <span>Метод</span><span>Карта цен</span><span>Верификатор</span><span>Связаться</span>
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, color: NEUTRALS.ink, border: `1.5px solid ${NEUTRALS.ink}`, padding: '8px 16px' }}>
          N° → ЗАПИСАТЬСЯ
        </div>
      </div>

      {/* Body — carte layout */}
      <div style={{ flex: 1, padding: '44px 48px 32px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56 }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 2, color: accent, marginBottom: 18 }}>
            N° 01 · ENTRÉE
          </div>
          <h1 style={{ fontFamily: heading, fontWeight: 400, fontSize: 92, letterSpacing: -2.4, lineHeight: 0.92, color: NEUTRALS.ink, margin: 0 }}>
            <span style={{ fontStyle: 'italic' }}>AI-официант,</span><br/>
            который<br/>
            <span style={{ color: green }}>знает ваше меню.</span>
          </h1>
          <div style={{ height: 1.5, background: 'rgba(30,30,24,0.2)', margin: '28px 0 20px', width: '80%' }} />
          <p style={{ fontFamily: body, fontSize: 15, lineHeight: 1.6, color: '#2E2C25', maxWidth: 440, margin: 0 }}>
            Гость сканирует QR со стола — и получает собеседника, который рассказывает о блюдах голосом и текстом, подбирает комплексы, зовёт живого официанта в Telegram, если нужно.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button style={{ background: green, color: greenFg, border: 'none', padding: '16px 26px', fontFamily: body, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: mono, fontSize: 11, opacity: 0.7 }}>N° →</span>
              <span>Записаться на пилот</span>
            </button>
            <button style={{ background: 'transparent', color: NEUTRALS.ink, border: `1.5px solid ${NEUTRALS.ink}`, padding: '16px 26px', fontFamily: body, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Смотреть метод
            </button>
          </div>
        </div>

        {/* Menu-style metric list */}
        <div>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#57544C', marginBottom: 14, paddingBottom: 10, borderBottom: `1.5px solid rgba(30,30,24,0.2)`, display: 'flex', justifyContent: 'space-between' }}>
            <span>Numbers that matter</span>
            <span>N° — VAL</span>
          </div>
          {[
            ['01', 'Средний ответ AI',         '< 1.4 s'],
            ['02', 'Точность верификатора',    '97 %'],
            ['03', 'Языков ввода',             '12'],
            ['04', 'Себестоимость / диалог',   '~ 3 ₽'],
            ['05', 'Клиентских кейсов',        '0 · пока'],
          ].map(([n, l, v], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '12px 0', borderBottom: `1px dotted rgba(30,30,24,0.25)` }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: accent, width: 22 }}>{n}</div>
              <div style={{ fontFamily: body, fontSize: 14, color: NEUTRALS.ink, fontWeight: 500 }}>{l}</div>
              <div style={{ flex: 1 }} />
              <div style={{ fontFamily: mono, fontSize: 14, color: NEUTRALS.ink, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
          <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 13, color: '#57544C', marginTop: 16, lineHeight: 1.5 }}>
            Первые три ресторана — лично, руками. Без пресейла, без ООО, без красивых слов.
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPwa({ green, greenFg, accent, heading, body, mono, dark }) {
  const bg = dark ? '#1A1F17' : NEUTRALS.cream;
  const fg = dark ? '#EFE7D0' : NEUTRALS.ink;
  const muted = dark ? 'rgba(239,231,208,0.6)' : '#57544C';
  const line = dark ? 'rgba(239,231,208,0.24)' : 'rgba(30,30,24,0.22)';

  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden', fontFamily: body }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px 8px', fontSize: 12, fontWeight: 600, color: fg }}>
        <span>9:41</span><span>●●● ◾</span>
      </div>

      {/* Masthead */}
      <div style={{ padding: '14px 18px 10px', borderTop: `1.5px solid ${line}`, borderBottom: `1.5px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 9, color: muted, letterSpacing: 1.5 }}>
        <span>CARTE — N° 003</span>
        <span>20 · IV · 26</span>
        <span>TABLE · 07</span>
      </div>

      {/* Title */}
      <div style={{ padding: '20px 18px 10px', borderBottom: `1.5px solid ${line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CardMark size={24} color={fg} accent={accent} />
          <span style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 24, letterSpacing: -0.3, color: fg }}>TableMind</span>
        </div>
        <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 400, fontSize: 30, letterSpacing: -0.6, color: fg, marginTop: 10, lineHeight: 1 }}>
          Carte du jour
        </div>
        <div style={{ fontFamily: body, fontSize: 12, color: muted, marginTop: 2 }}>сегодняшнее предложение шефа</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '10px 18px 0', gap: 0, borderBottom: `1.5px solid ${line}` }}>
        {['I · Entrée', 'II · Plat', 'III · Vin', 'IV · Dessert'].map((tb, i) => (
          <div key={i} style={{
            padding: '8px 10px 10px',
            fontFamily: mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
            color: i === 0 ? fg : muted, fontWeight: i === 0 ? 600 : 400,
            borderBottom: i === 0 ? `2px solid ${accent}` : 'none',
            marginBottom: -1.5,
          }}>{tb}</div>
        ))}
      </div>

      {/* Dish rows — with dotted leaders */}
      <div style={{ padding: '4px 18px' }}>
        {[
          { n: '01', name: 'Сельдь по-балтийски', sub: 'печёная свёкла, хрен',        price: '420' },
          { n: '02', name: 'Тартар из говядины',  sub: 'перепелиный желток, каперсы', price: '690' },
          { n: '03', name: 'Крем из тыквы',       sub: 'тимьяновое масло, фундук',    price: '480' },
          { n: '04', name: 'Карпаччо из свёклы',  sub: 'козий сыр, грецкий орех',     price: '520' },
          { n: '05', name: 'Салат из печёных овощей', sub: 'тахинный соус, дукка',    price: '560' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline', padding: '12px 0', borderBottom: i < 4 ? `1px dotted ${line}` : 'none' }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: accent, fontWeight: 500, width: 22 }}>{d.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: body, fontWeight: 600, fontSize: 14, color: fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
              <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 11.5, color: muted, marginTop: 1 }}>{d.sub}</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 12, color: fg, fontWeight: 500 }}>{d.price}</div>
          </div>
        ))}
      </div>

      {/* Bottom ask bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px', borderTop: `1.5px solid ${line}`, background: bg, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: accent, letterSpacing: 1.5 }}>N° →</div>
        <div style={{ flex: 1, fontFamily: body, fontSize: 13, color: muted }}>Спросить шефа·AI</div>
        <div style={{ fontFamily: mono, fontSize: 9, color: muted, letterSpacing: 1.5 }}>RU · VOICE</div>
      </div>
    </div>
  );
}

Object.assign(window, { MenuCardConcept });
