// Concept A — BOTANICA
// Mood: farm-to-table, warm service, hand-drawn botanical mark.
// Type: Fraunces (heading, soft+wonk) + Inter Tight (body) + Caveat (handwritten accent)

function BotanicaConcept() {
  const t = useTweaks();
  const green = GREENS[t.greenChoice].hex;
  const greenFg = GREENS[t.greenChoice].fg;
  const accent = ACCENTS[t.accentChoice].hex;
  const heading = SERIFS[t.serifChoice].css || '"Fraunces", serif';
  const bg = t.dark ? green : NEUTRALS.cream;
  const fg = t.dark ? greenFg : NEUTRALS.ink;
  const line = t.dark ? 'rgba(243,236,216,0.18)' : NEUTRALS.line;

  return (
    <DCSection
      title="A — Botanica"
      subtitle="Ботанический знак · editorial serif · рукописный акцент · тёплый editorial для PWA"
      gap={56}
    >
      {/* ── LOGOS ────────────────────────────────────────── */}
      <DCArtboard label="Логотипы · wordmark / symbol / lockup" width={760} height={560}>
        <div style={{ background: bg, width: '100%', height: '100%', padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Wordmark */}
          <div style={{ borderBottom: `1px solid ${line}`, paddingBottom: 40 }}>
            <div style={{
              fontFamily: heading, fontWeight: 400,
              fontVariationSettings: '"SOFT" 60, "opsz" 96',
              fontSize: 76, color: fg, letterSpacing: -2,
              lineHeight: 1,
            }}>
              TableMind<span style={{ color: accent, fontStyle: 'italic', fontWeight: 300 }}>.</span>
            </div>
            <Caption>01 — Wordmark</Caption>
          </div>

          {/* Symbol + lockup row */}
          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', paddingTop: 24 }}>
            <div>
              <BotanicaMark size={140} color={fg} accent={accent} />
              <Caption>02 — Symbol</Caption>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${line}`, paddingLeft: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <BotanicaMark size={64} color={fg} accent={accent} />
                <div style={{
                  fontFamily: heading, fontWeight: 400,
                  fontVariationSettings: '"SOFT" 60, "opsz" 96',
                  fontSize: 42, color: fg, letterSpacing: -1, lineHeight: 1,
                }}>TableMind</div>
              </div>
              <Caption>03 — Lockup (horizontal)</Caption>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── LOGO CLOSE-UP / construction ──────────────────── */}
      <DCArtboard label="Знак · конструкция" width={360} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace',
          }}>Конструкция</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <BotanicaMark size={220} color={green} accent={accent} showGuides />
          </div>
          <div style={{
            fontFamily: heading, fontSize: 15, fontStyle: 'italic', fontWeight: 400,
            color: '#57544C', lineHeight: 1.5,
          }}>
            Лист мяты — пластина ветви стола. «Mind» прорастает из «Table»: сервировка + живой лист.
          </div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 22, color: accent,
            marginTop: 14, transform: 'rotate(-2deg)',
          }}>~ а не чип и не мозг</div>
        </div>
      </DCArtboard>

      {/* ── COLOR ────────────────────────────────────────── */}
      <DCArtboard label="Палитра" width={520} height={560}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40 }}>
          <Block title="Core" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={green} name="Moss" token="--green-900" />
              <Swatch hex={GREENS[t.greenChoice].soft} name="Moss soft" token="--green-600" />
              <Swatch hex={accent} name="Ochre" token="--accent" />
            </div>
          </Block>
          <Block title="Neutrals" pad={0}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <Swatch hex={NEUTRALS.cream} name="Oat" token="--bg" light />
              <Swatch hex={NEUTRALS.paper} name="Paper" token="--paper" light />
              <Swatch hex={NEUTRALS.ink} name="Ink" token="--fg" />
            </div>
          </Block>
          <Block title="Secondary" pad={0}>
            <div style={{ display: 'flex', gap: 14 }}>
              <Swatch hex="#8A9A5B" name="Sage" token="--sage" />
              <Swatch hex="#6B3E26" name="Bark" token="--bark" />
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
          <div style={{ fontFamily: heading, fontWeight: 300, fontSize: 68, letterSpacing: -1.8, lineHeight: 0.95, color: NEUTRALS.ink, marginTop: 6, fontVariationSettings: '"SOFT" 60, "opsz" 96' }}>
            Курица из Зеленоградска
          </div>
          <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: green, marginTop: 4 }}>
            с томлёной капустой и лимонной цедрой
          </div>

          <div style={{ height: 1, background: NEUTRALS.line, margin: '28px 0 20px' }} />

          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace' }}>
            Body · Inter Tight
          </div>
          <div style={{ fontFamily: '"Inter Tight", sans-serif', fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: '#2E2C25', marginTop: 10, maxWidth: 480 }}>
            AI-официант рассказывает о блюдах голосом и текстом, помнит ваши предпочтения и мягко подсказывает, что подойдёт к бокалу рислинга с соседнего стола.
          </div>

          <div style={{ display: 'flex', gap: 18, marginTop: 24, alignItems: 'baseline' }}>
            <div style={{ fontFamily: heading, fontSize: 38, fontWeight: 400 }}>H1 / 56–76</div>
            <div style={{ fontFamily: heading, fontStyle: 'italic', fontSize: 22 }}>H2 / 28–34</div>
            <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 14, color: '#57544C' }}>Body / 15–17</div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#8A8472' }}>mono / 11–12</div>
          </div>

          <div style={{ marginTop: 20, fontFamily: '"Caveat", cursive', fontSize: 28, color: accent }}>
            а это — рукописный акцент
          </div>
        </div>
      </DCArtboard>

      {/* ── COMPONENTS ───────────────────────────────────── */}
      <DCArtboard label="Компоненты" width={520} height={720}>
        <div style={{ background: NEUTRALS.ivory, width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Buttons */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Primary button</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{ background: green, color: greenFg, border: 'none', padding: '14px 22px', fontFamily: '"Inter Tight", sans-serif', fontSize: 14, letterSpacing: 0.2, fontWeight: 500, borderRadius: 2, cursor: 'pointer' }}>
                Посмотреть меню →
              </button>
              <button style={{ background: 'transparent', color: green, border: `1px solid ${green}`, padding: '14px 22px', fontFamily: '"Inter Tight", sans-serif', fontSize: 14, letterSpacing: 0.2, fontWeight: 500, borderRadius: 2, cursor: 'pointer' }}>
                Подобрать комплекс
              </button>
            </div>
          </div>

          {/* Card */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Dish card</div>
            <div style={{ background: NEUTRALS.paper, padding: 20, display: 'flex', gap: 16, borderRadius: 2 }}>
              <Placeholder w={84} h={84} label="фото" radius={2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 400, fontSize: 19, letterSpacing: -0.3, fontVariationSettings: '"SOFT" 60' }}>
                  Дорадо на гриле
                </div>
                <div style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 13, color: '#57544C', marginTop: 2 }}>
                  с брокколини и лимонным айоли
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#8A8472' }}>~ 18 мин</div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 17, fontWeight: 500 }}>890 ₽</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Navigation</div>
            <div style={{ background: bg, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, border: `1px solid ${line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BotanicaMark size={22} color={fg} accent={accent} />
                <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 400, fontSize: 18, color: fg, letterSpacing: -0.3 }}>TableMind</span>
              </div>
              <div style={{ display: 'flex', gap: 22, fontFamily: '"Inter Tight", sans-serif', fontSize: 13, color: fg }}>
                <span>Как работает</span><span>Тариф</span><span>Связь</span>
              </div>
            </div>
          </div>

          {/* Hero block */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.5)', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 12 }}>Hero block (атом)</div>
            <div style={{ background: bg, padding: 24, borderRadius: 2 }}>
              <div style={{ fontFamily: '"Caveat", cursive', fontSize: 20, color: accent, marginBottom: 4 }}>для рестораторов</div>
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 28, letterSpacing: -0.8, color: fg, lineHeight: 1.1, fontVariationSettings: '"SOFT" 60, "opsz" 96' }}>
                AI-официант, который<br/>
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>знает ваше меню</span>.
              </div>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* ── HERO MOCKUP (site) ───────────────────────────── */}
      <DCArtboard label="Сайт · hero-секция (для рестораторов)" width={1200} height={720}>
        <BotanicaHero green={green} greenFg={greenFg} accent={accent} heading={heading} />
      </DCArtboard>

      {/* ── PWA MENU SCREEN ──────────────────────────────── */}
      <DCArtboard label="PWA · экран меню (гость)" width={380} height={720}>
        <BotanicaPwa green={green} greenFg={greenFg} accent={accent} heading={heading} dark={t.dark} />
      </DCArtboard>

      <DCPostIt top={200} left={-210} rotate={-3}>
        Ботаническая: самая тёплая из трёх. Для заведений, которые хотят звучать «наш шеф, наш огород».
      </DCPostIt>
    </DCSection>
  );
}

// ─── Botanical mark ────────────────────────────────────────
function BotanicaMark({ size = 100, color = '#3B4A34', accent = '#C48A2A', showGuides = false }) {
  // Stylised mint/olive leaf on a horizontal line (table)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {showGuides && (
        <g stroke="rgba(75,95,75,0.25)" strokeWidth="0.4" fill="none">
          <circle cx="50" cy="50" r="42" />
          <line x1="8" y1="50" x2="92" y2="50" />
          <line x1="50" y1="8" x2="50" y2="92" />
        </g>
      )}
      {/* Table line */}
      <line x1="14" y1="78" x2="86" y2="78" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      {/* Leaf body */}
      <path
        d="M50 78 C 28 70, 20 48, 34 26 C 46 16, 60 20, 66 34 C 72 50, 66 68, 50 78 Z"
        fill={color}
      />
      {/* Leaf vein */}
      <path d="M50 78 C 44 60, 42 44, 44 28" stroke={accent} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M47 60 L 38 54" stroke={accent} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M46 50 L 37 42" stroke={accent} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M45 40 L 38 32" stroke={accent} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Accent dot — berry */}
      <circle cx="66" cy="26" r="2.4" fill={accent} />
    </svg>
  );
}

function BotanicaHero({ green, greenFg, accent, heading }) {
  return (
    <div style={{ background: NEUTRALS.cream, width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: `1px solid ${NEUTRALS.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BotanicaMark size={26} color={green} accent={accent} />
          <span style={{ fontFamily: heading, fontWeight: 400, fontSize: 20, letterSpacing: -0.4, fontVariationSettings: '"SOFT" 60, "opsz" 96' }}>TableMind</span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontFamily: '"Inter Tight", sans-serif', fontSize: 13, color: NEUTRALS.ink }}>
          <span>Как работает</span><span>Верификатор</span><span>Тариф</span><span>Связаться</span>
        </div>
        <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 12, color: green, border: `1px solid ${green}`, padding: '8px 14px', borderRadius: 999 }}>
          Записаться на пилот
        </div>
      </div>

      {/* Hero body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', padding: '64px 48px 0', gap: 48 }}>
        <div>
          <div style={{ fontFamily: '"Caveat", cursive', fontSize: 26, color: accent, marginBottom: 12 }}>
            для ресторанов на 15–50 столов
          </div>
          <h1 style={{
            fontFamily: heading, fontWeight: 300,
            fontVariationSettings: '"SOFT" 60, "opsz" 144',
            fontSize: 76, letterSpacing: -2.2, lineHeight: 0.96, color: NEUTRALS.ink, margin: 0,
          }}>
            AI-официант,<br/>
            который <span style={{ fontStyle: 'italic', fontWeight: 400, color: green }}>знает</span><br/>
            ваше меню.
          </h1>
          <p style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 17, lineHeight: 1.55, color: '#3A372E', maxWidth: 460, marginTop: 28 }}>
            Гость сканирует QR со стола — и получает внимательного собеседника, который расскажет о блюдах, подберёт комплекс и позовёт живого официанта в Telegram, если нужен.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
            <button style={{ background: green, color: greenFg, border: 'none', padding: '16px 26px', fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: 0.3, borderRadius: 2, cursor: 'pointer' }}>
              Попробовать на своём меню →
            </button>
            <button style={{ background: 'transparent', color: NEUTRALS.ink, border: `1px solid ${NEUTRALS.ink}`, padding: '16px 26px', fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: 0.3, borderRadius: 2, cursor: 'pointer' }}>
              Как это работает
            </button>
          </div>
        </div>

        {/* Right column — numbers that matter (honest metrics) */}
        <div style={{ borderLeft: `1px solid ${NEUTRALS.line}`, paddingLeft: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#8A8472', fontFamily: '"IBM Plex Mono", monospace', marginBottom: 18 }}>
              Цифры, которые имеют значение
            </div>
            <Metric heading={heading} num="< 1.4" unit="сек" label="Средний ответ AI — быстрее, чем гость успевает поднять глаза" accent={accent} />
            <Metric heading={heading} num="97%" unit="" label="Точность верификатора: не придумывает блюд, которых нет в меню" accent={accent} />
            <Metric heading={heading} num="12" unit="языков" label="Гость пишет на своём — ответ на русском для кухни" accent={accent} />
            <Metric heading={heading} num="~3₽" unit="/ диалог" label="Честная себестоимость на OpenRouter. Показываем счётчик." accent={accent} last />
          </div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 22, color: '#57544C',
            borderTop: `1px dashed ${NEUTRALS.line}`, paddingTop: 16, marginTop: 20,
          }}>
            ~ первые три ресторана — лично, руками, без пресейла
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ heading, num, unit, label, accent, last }) {
  return (
    <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: last ? 'none' : `1px solid ${NEUTRALS.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontFamily: heading, fontSize: 38, fontWeight: 400, letterSpacing: -1, fontVariationSettings: '"SOFT" 60, "opsz" 96', color: NEUTRALS.ink }}>{num}</div>
        <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 13, color: accent, fontWeight: 500 }}>{unit}</div>
      </div>
      <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 13, color: '#57544C', lineHeight: 1.4, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function BotanicaPwa({ green, greenFg, accent, heading, dark }) {
  const bg = dark ? '#1A1F17' : NEUTRALS.cream;
  const card = dark ? '#242B20' : NEUTRALS.ivory;
  const fg = dark ? '#EFE7D0' : NEUTRALS.ink;
  const muted = dark ? 'rgba(239,231,208,0.6)' : '#57544C';
  const line = dark ? 'rgba(239,231,208,0.14)' : NEUTRALS.line;

  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden', fontFamily: '"Inter Tight", sans-serif' }}>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px 8px', fontSize: 12, fontWeight: 600, color: fg, fontFamily: 'system-ui' }}>
        <span>9:41</span><span>●●● ◾</span>
      </div>

      {/* Header */}
      <div style={{ padding: '18px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BotanicaMark size={22} color={fg} accent={accent} />
          <div style={{ fontFamily: heading, fontSize: 18, color: fg, letterSpacing: -0.3, fontVariationSettings: '"SOFT" 60' }}>TableMind</div>
        </div>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: muted, letterSpacing: 1 }}>СТОЛ 7</div>
      </div>

      {/* Greeting */}
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ fontFamily: '"Caveat", cursive', fontSize: 18, color: accent }}>добрый вечер —</div>
        <div style={{ fontFamily: heading, fontWeight: 300, fontSize: 30, letterSpacing: -0.8, lineHeight: 1.05, color: fg, marginTop: 2, fontVariationSettings: '"SOFT" 60, "opsz" 96' }}>
          что сегодня<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>хочется?</span>
        </div>
      </div>

      {/* AI prompt chips */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['Что-нибудь лёгкое к вину', 'Без глютена и не острое', 'Комплекс на двоих до 3 500 ₽'].map((p, i) => (
          <div key={i} style={{
            border: `1px solid ${line}`, borderRadius: 999,
            padding: '10px 16px', fontSize: 13, color: fg,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{p}</span>
            <span style={{ color: accent, fontSize: 14 }}>→</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ padding: '22px 24px 10px', display: 'flex', gap: 18, borderBottom: `1px solid ${line}`, fontSize: 12, color: muted }}>
        <span style={{ color: fg, fontWeight: 500, borderBottom: `2px solid ${accent}`, paddingBottom: 8 }}>Стартеры</span>
        <span style={{ paddingBottom: 8 }}>Основное</span>
        <span style={{ paddingBottom: 8 }}>Бокалы</span>
        <span style={{ paddingBottom: 8 }}>Десерт</span>
      </div>

      {/* Dish list */}
      <div style={{ padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { name: 'Балтийская сельдь', sub: 'с печёной свёклой и хреном', price: '420 ₽', tag: 'локально' },
          { name: 'Тартар из говядины', sub: 'перепелиный желток, каперсы', price: '690 ₽' },
          { name: 'Тыквенный крем-суп', sub: 'с тимьяновым маслом и фундуком', price: '480 ₽', tag: 'vegan' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, borderBottom: i < 2 ? `1px solid ${line}` : 'none' }}>
            <Placeholder w={56} h={56} label="" radius={2} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 16, color: fg, letterSpacing: -0.3, fontVariationSettings: '"SOFT" 60' }}>{d.name}</div>
              <div style={{ fontFamily: heading, fontStyle: 'italic', fontWeight: 400, fontSize: 12, color: muted, marginTop: 1 }}>{d.sub}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                {d.tag
                  ? <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: accent, letterSpacing: 1, textTransform: 'uppercase' }}>· {d.tag}</span>
                  : <span />}
                <div style={{ fontFamily: heading, fontSize: 14, fontWeight: 500, color: fg }}>{d.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI footer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: card, borderTop: `1px solid ${line}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BotanicaMark size={18} color={greenFg} accent={accent} />
        </div>
        <div style={{ flex: 1, fontSize: 13, color: muted }}>Спросить у TableMind…</div>
        <div style={{ fontSize: 11, fontFamily: '"IBM Plex Mono", monospace', color: muted }}>RU</div>
      </div>
    </div>
  );
}

Object.assign(window, { BotanicaConcept });
