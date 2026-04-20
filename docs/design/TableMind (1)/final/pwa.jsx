// PWA — guest experience. 3 screens (menu, chat, waiter) × light + dark.

const Phone = ({ children, dark }) => (
  <div style={{ width: 390, height: 844, background: dark ? T.inkDark : T.paper, position: 'relative', overflow: 'hidden', fontFamily: FB, borderRadius: 40, border: `8px solid ${dark ? '#0A0C08' : '#1E1E18'}` }}>
    {children}
  </div>
);

const StatusBar = ({ fg }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 28px 6px', fontSize: 13, fontWeight: 600, color: fg }}>
    <span>9:41</span><span>●●● ◾</span>
  </div>
);

const Masthead = ({ muted, line, center = '20 · IV · 26' }) => (
  <div style={{ padding: '12px 20px', borderTop: `1.5px solid ${line}`, borderBottom: `1.5px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: FM, fontSize: 9, color: muted, letterSpacing: 1.5 }}>
    <span>CARTE — N° 003</span><span>{center}</span><span>TABLE · 07</span>
  </div>
);

const palette = (dark) => ({
  bg:   dark ? T.inkDark   : T.paper,
  surf: dark ? T.paperDark : T.ivory,
  fg:   dark ? T.fgDark    : T.ink,
  muted:dark ? 'rgba(236,226,196,0.62)' : T.stone,
  line: dark ? T.lineDark  : 'rgba(30,30,24,0.22)',
  lineSoft: dark ? 'rgba(236,226,196,0.12)' : T.line,
});

// ─── SCREEN 01 — MENU ─────────────────────────────────────
function MenuScreen({ dark = false }) {
  const p = palette(dark);
  const items = [
    { n: '01', name: 'Сельдь по-балтийски',  sub: 'печёная свёкла, хрен',        price: '420', tag: 'локально' },
    { n: '02', name: 'Тартар из говядины',   sub: 'перепелиный желток, каперсы', price: '690' },
    { n: '03', name: 'Крем из тыквы',        sub: 'тимьяновое масло, фундук',    price: '480', tag: 'vegan' },
    { n: '04', name: 'Карпаччо из свёклы',   sub: 'козий сыр, грецкий орех',     price: '520' },
    { n: '05', name: 'Салат из печёных овощей', sub: 'тахинный соус, дукка',     price: '560' },
    { n: '06', name: 'Бриошь с костным мозгом', sub: 'малдонская соль, лук-шалот',price: '640', tag: 'шеф' },
  ];
  return (
    <Phone dark={dark}>
      <StatusBar fg={p.fg} />
      <Masthead muted={p.muted} line={p.line} />
      <div style={{ padding: '18px 20px 12px', borderBottom: `1.5px solid ${p.line}` }}>
        <Lockup size={20} color={p.fg} accent={T.ochre} />
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 34, letterSpacing: -0.8, color: p.fg, marginTop: 12, lineHeight: 1 }}>Carte du jour</div>
        <div style={{ fontFamily: FB, fontSize: 13, color: p.muted, marginTop: 4 }}>сегодняшнее предложение шефа</div>
      </div>
      <div style={{ display: 'flex', padding: '0 20px', borderBottom: `1.5px solid ${p.line}` }}>
        {['I · Entrée', 'II · Plat', 'III · Vin', 'IV · Dessert'].map((tb, i) => (
          <div key={i} style={{
            padding: '12px 10px 12px 0', marginRight: 16,
            fontFamily: FM, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
            color: i === 0 ? p.fg : p.muted, fontWeight: i === 0 ? 600 : 400,
            borderBottom: i === 0 ? `2px solid ${T.ochre}` : 'none',
            marginBottom: -1.5,
          }}>{tb}</div>
        ))}
      </div>
      <div style={{ padding: '4px 20px', maxHeight: 520, overflow: 'hidden' }}>
        {items.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '14px 0', borderBottom: i < items.length - 1 ? `1px dotted ${p.lineSoft}` : 'none' }}>
            <div style={{ fontFamily: FM, fontSize: 10, color: T.ochre, fontWeight: 500, width: 22 }}>{d.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FB, fontWeight: 600, fontSize: 15, color: p.fg }}>{d.name}</div>
              <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 12, color: p.muted, marginTop: 2 }}>{d.sub}</div>
              {d.tag && (
                <span style={{ fontFamily: FM, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: T.ochre, border: `1px solid ${T.ochre}`, padding: '2px 6px', marginTop: 6, display: 'inline-block' }}>· {d.tag}</span>
              )}
            </div>
            <div style={{ fontFamily: FM, fontSize: 13, color: p.fg, fontWeight: 500 }}>{d.price}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 22px', borderTop: `1.5px solid ${p.line}`, background: p.surf }}>
        <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: 2, color: p.muted, marginBottom: 6 }}>N° → AI-ОФИЦИАНТ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontFamily: FH, fontStyle: 'italic', fontSize: 16, color: p.fg }}>спросите шефа…</div>
          <div style={{ width: 38, height: 38, background: T.moss, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="8" rx="2" fill={T.paper}/><path d="M2 7v1a5 5 0 0 0 10 0V7" stroke={T.paper} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── SCREEN 02 — CHAT ─────────────────────────────────────
function InlineDish({ d, dark }) {
  const p = palette(dark);
  return (
    <div style={{ margin: '10px 0 2px', padding: '10px 12px', background: dark ? 'rgba(236,226,196,0.05)' : T.ivory, border: `1px solid ${p.lineSoft}`, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{ fontFamily: FM, fontSize: 10, color: T.ochre, fontWeight: 500, width: 20 }}>{d.n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: p.fg }}>{d.name}</div>
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 11, color: p.muted, marginTop: 1 }}>{d.sub}</div>
      </div>
      {d.tag && <span style={{ fontFamily: FM, fontSize: 7.5, letterSpacing: 1.3, textTransform: 'uppercase', color: T.ochre, border: `1px solid ${T.ochre}`, padding: '1px 5px' }}>· {d.tag}</span>}
      <div style={{ fontFamily: FM, fontSize: 12, color: p.fg, fontWeight: 500 }}>{d.price} ₽</div>
    </div>
  );
}

function ChatScreen({ dark = false }) {
  const p = palette(dark);
  const turns = [
    { who: 'guest', label: 'ГОСТЬ · 01', text: 'Что-нибудь лёгкое к рислингу, без рыбы?' },
    { who: 'ai', label: 'AI · TM', text: 'Предлагаю два варианта:', dishes: [
      { n: '03', name: 'Крем из тыквы',     sub: 'тимьяновое масло, фундук',  price: '480', tag: 'vegan' },
      { n: '04', name: 'Карпаччо из свёклы',sub: 'козий сыр, грецкий орех',    price: '520' },
    ] },
    { who: 'guest', label: 'ГОСТЬ · 02', text: 'А аллергены?' },
    { who: 'ai', label: 'AI · TM', text: 'В крем-супе — орехи. В карпаччо — орехи и молочное.' },
    { who: 'guest', label: 'ГОСТЬ · 03', text: 'Первое ок, возьму' },
  ];
  return (
    <Phone dark={dark}>
      <StatusBar fg={p.fg} />
      <Masthead muted={p.muted} line={p.line} />
      {/* Chat header */}
      <div style={{ padding: '12px 18px', borderBottom: `1.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, color: p.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, color: p.fg, lineHeight: 1 }}>×</span>
          <span>К МЕНЮ</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 17, color: p.fg, lineHeight: 1 }}>AI · TM</div>
          <div style={{ fontFamily: FM, fontSize: 8.5, letterSpacing: 1.5, color: p.muted, marginTop: 3 }}>СОБЕСЕДНИК</div>
        </div>
        <div style={{ width: 28, height: 28, border: `1px solid ${p.fg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="8" rx="2" fill={p.fg}/><path d="M2 7v1a5 5 0 0 0 10 0V7" stroke={p.fg} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: '14px 18px 140px', overflow: 'hidden', maxHeight: 600 }}>
        {turns.map((t, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: 1.6, color: t.who === 'ai' ? T.moss : p.muted, fontWeight: 600, marginBottom: 4 }}>
              {t.who === 'ai' && !dark ? <span style={{ color: T.moss }}>{t.label}</span> : <span style={{ color: t.who === 'ai' ? (dark ? T.mossSoft : T.moss) : p.muted }}>{t.label}</span>}
            </div>
            <div style={{ fontFamily: FB, fontSize: 14, color: p.fg, lineHeight: 1.45 }}>{t.text}</div>
            {t.dishes && t.dishes.map((d, di) => <InlineDish key={di} d={d} dark={dark} />)}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: p.surf, borderTop: `1.5px solid ${p.line}` }}>
        <div style={{ padding: '8px 18px 6px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px dotted ${p.lineSoft}` }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: T.moss }} />
          <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: 1.5, color: p.muted, textTransform: 'uppercase' }}>✓ проверено верификатором</span>
        </div>
        <div style={{ padding: '10px 16px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, fontFamily: FH, fontStyle: 'italic', fontSize: 14, color: p.muted, padding: '8px 4px' }}>спросите или выберите…</div>
          <div style={{ width: 36, height: 36, border: `1px solid ${p.fg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="8" rx="2" fill={p.fg}/><path d="M2 7v1a5 5 0 0 0 10 0V7" stroke={p.fg} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <button style={{ background: T.moss, color: T.paper, border: 'none', padding: '10px 12px', fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>
            → Официант
          </button>
        </div>
      </div>
    </Phone>
  );
}

// ─── SCREEN 03 — CALL WAITER ──────────────────────────────
function WaiterScreen({ dark = false }) {
  const p = palette(dark);
  return (
    <Phone dark={dark}>
      <StatusBar fg={p.fg} />
      <Masthead muted={p.muted} line={p.line} />

      {/* Hero */}
      <div style={{ padding: '36px 24px 24px', borderBottom: `1.5px solid ${p.line}`, textAlign: 'center' }}>
        <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, color: T.ochre, marginBottom: 14 }}>N° → ЗОВЁМ ОФИЦИАНТА</div>
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 38, letterSpacing: -0.8, color: p.fg, lineHeight: 1 }}>Сообщение<br/>отправлено</div>
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 15, color: p.muted, marginTop: 10 }}>
          — Илье, через Telegram
        </div>
      </div>

      {/* Receipt */}
      <div style={{ padding: '18px 24px', borderBottom: `1.5px solid ${p.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FM, fontSize: 9, letterSpacing: 1.5, color: p.muted, paddingBottom: 8 }}>
          <span>N°</span><span>РЕЗЮМЕ ЗАКАЗА</span><span>₽</span>
        </div>
        {[
          ['TABLE', '07'],
          ['ВЫБОР', 'Сельдь по-балтийски × 1'],
          ['', 'Крем из тыквы × 1'],
          ['СЧЁТ',  '900 ₽'],
          ['ВРЕМЯ', '20:41'],
        ].map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '8px 0', borderBottom: i < 4 ? `1px dotted ${p.lineSoft}` : 'none' }}>
            <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.8, color: k === '' ? 'transparent' : T.ochre, width: 62, fontWeight: 500 }}>{k || '—'}</div>
            <div style={{ flex: 1, borderBottom: `1px dotted ${p.lineSoft}`, margin: '0 8px', alignSelf: 'end', marginBottom: 5 }} />
            <div style={{ fontFamily: FB, fontSize: 13, color: p.fg, fontWeight: 500, textAlign: 'right' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ padding: '22px 24px', borderBottom: `1.5px solid ${p.line}` }}>
        <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: 2, color: p.muted, marginBottom: 14, textTransform: 'uppercase' }}>Статус</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: 10 }}>
          {[true, true, false].map((active, i) => (
            <React.Fragment key={i}>
              <div style={{
                width: 16, height: 16, borderRadius: 999,
                background: active ? T.moss : 'transparent',
                border: `1.5px solid ${active ? T.moss : p.line}`,
                flexShrink: 0, zIndex: 1,
              }} />
              {i < 2 && <div style={{ flex: 1, height: 1, borderTop: `1px dotted ${p.lineSoft}`, margin: '0 4px' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FM, fontSize: 9, letterSpacing: 1.5, color: p.muted, textTransform: 'uppercase' }}>
          <span style={{ color: T.moss }}>Получено</span>
          <span style={{ color: T.moss }}>Принято</span>
          <span>В пути</span>
        </div>
        <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 14, color: p.muted, marginTop: 16, textAlign: 'center' }}>
          подойдёт через 1–2 минуты
        </div>
      </div>

      {/* Actions */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px 28px', background: p.surf, borderTop: `1.5px solid ${p.line}` }}>
        <button style={{ width: '100%', background: 'transparent', color: p.fg, border: `1.5px solid ${p.fg}`, padding: '14px 0', fontFamily: FB, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Отменить вызов
        </button>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span style={{ fontFamily: FB, fontSize: 13, color: p.fg, fontWeight: 500, borderBottom: `1.5px solid ${p.fg}`, paddingBottom: 2, cursor: 'pointer' }}>
            Изменить заказ →
          </span>
        </div>
      </div>
    </Phone>
  );
}

// ─── ARTBOARDS ────────────────────────────────────────────
function PwaMenuArtboard() {
  return (
    <DCArtboard label="06·a · PWA · экран меню" width={920} height={960}>
      <PairFrame title="GUEST EXPERIENCE · MENU" light={<MenuScreen />} dark={<MenuScreen dark />} />
    </DCArtboard>
  );
}

function PwaChatArtboard() {
  return (
    <DCArtboard label="06·b · PWA · чат с AI-официантом" width={920} height={960}>
      <PairFrame title="GUEST EXPERIENCE · CHAT" light={<ChatScreen />} dark={<ChatScreen dark />} />
    </DCArtboard>
  );
}

function PwaWaiterArtboard() {
  return (
    <DCArtboard label="06·c · PWA · позвать официанта" width={920} height={960}>
      <PairFrame title="GUEST EXPERIENCE · CALL WAITER" light={<WaiterScreen />} dark={<WaiterScreen dark />} />
    </DCArtboard>
  );
}

function PairFrame({ title, light, dark }) {
  return (
    <div style={{ background: T.ivory, width: '100%', height: '100%', padding: '28px 40px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1.5px solid ${T.line}`, ...TX.masthead }}>
        <span>TableMind · PWA</span>
        <span>N° 06 — {title}</span>
        <span>390 × 844</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {light}
          <div style={{ ...TX.masthead }}>LIGHT · дневной</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {dark}
          <div style={{ ...TX.masthead }}>DARK · вечер</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PwaMenuArtboard, PwaChatArtboard, PwaWaiterArtboard });
