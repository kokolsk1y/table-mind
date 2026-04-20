// Site hero + key sections for the finalized brand system

function SiteMock() {
  return (
    <DCArtboard label="05 · Сайт (для рестораторов) — длинная страница" width={1440} height={2400}>
      <div style={{ background: T.paper, width: '100%', height: '100%', overflow: 'hidden' }}>

        {/* Top meta strip */}
        <div style={{ padding: '12px 56px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', ...TX.masthead }}>
          <span>TableMind · AI-официант</span>
          <span>ВЫПУСК №003 — 20·IV·2026</span>
          <span>КАЛИНИНГРАД · САМОЗАНЯТЫЙ</span>
        </div>

        {/* Nav */}
        <div style={{ padding: '20px 56px', borderBottom: `1.5px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Lockup size={26} />
          <div style={{ display: 'flex', gap: 30, fontFamily: FB, fontSize: 13, color: T.ink, fontWeight: 500 }}>
            <span>Метод</span><span>Карта цен</span><span>Верификатор</span><span>Связаться</span>
          </div>
          <button style={{ background: T.ink, color: T.paper, border: 'none', padding: '10px 18px', fontFamily: FM, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}>
            № → Записаться на пилот
          </button>
        </div>

        {/* Hero */}
        <div style={{ padding: '64px 56px 44px', display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 64, borderBottom: `1.5px solid ${T.line}` }}>
          <div>
            <div style={{ ...TX.eyebrow, marginBottom: 20 }}>№ 01 · Закуска</div>
            <h1 style={{ fontFamily: FH, fontWeight: 400, fontSize: 108, letterSpacing: -2.8, lineHeight: 0.92, color: T.ink, margin: 0 }}>
              <span style={{ fontStyle: 'italic' }}>AI-официант,</span><br/>
              который<br/>
              <span style={{ color: T.moss }}>знает ваше меню.</span>
            </h1>
            <Rule style={{ margin: '32px 0 24px', width: '70%' }} color={T.line} />
            <p style={{ ...TX.lead, maxWidth: 520 }}>
              Гость сканирует QR со стола — и получает собеседника, который рассказывает о блюдах голосом и текстом, подбирает комплексы, зовёт живого официанта в Telegram, если нужно.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button style={{ background: T.moss, color: T.paper, border: 'none', padding: '16px 26px', fontFamily: FB, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: FM, fontSize: 11, opacity: 0.8 }}>№ →</span>
                <span>Записаться на пилот</span>
              </button>
              <button style={{ background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}`, padding: '16px 26px', fontFamily: FB, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Смотреть метод
              </button>
            </div>
          </div>

          {/* Numbers that matter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1.5px solid ${T.line}`, ...TX.masthead }}>
              <span>Важные цифры</span>
              <span>№ — ЗНАЧ</span>
            </div>
            {[
              ['01', 'Средний ответ AI',          '< 1.4 s'],
              ['02', 'Точность верификатора',     '97 %'],
              ['03', 'Языков ввода',              '12'],
              ['04', 'Себестоимость / диалог',    '~ 3 ₽'],
              ['05', 'Клиентских кейсов',         '0 · пока'],
              ['06', 'Первые пилоты',             '3 места'],
            ].map(([n, l, v], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '16px 0', borderBottom: `1px dotted ${T.line}` }}>
                <div style={{ fontFamily: FM, fontSize: 11, color: T.ochre, width: 28 }}>{n}</div>

                <div style={{ fontFamily: FB, fontSize: 15, color: T.ink, fontWeight: 500 }}>{l}</div>
                <DottedLeader />
                <div style={{ fontFamily: FM, fontSize: 15, color: T.ink, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
            <div style={{ ...TX.italic, fontSize: 14, marginTop: 18, lineHeight: 1.55 }}>
              Первые три ресторана — лично, руками. Без пресейла, без ООО, без красивых слов.
            </div>
          </div>
        </div>

        {/* Method section */}
        <div style={{ padding: '56px 56px', borderBottom: `1.5px solid ${T.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1.5px solid ${T.ink}`, ...TX.masthead }}>
            <span>№ 02 — ОСНОВНОЕ · МЕТОД</span>
            <span>ЧЕТЫРЕ ХОДА</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 32 }}>
            {[
              ['I',   'QR на столе',   'Гость открывает PWA за <2 сек. Никаких установок, никаких аккаунтов.'],
              ['II',  'Разговор',      'Голосом или текстом, на русском или своём. AI знает меню шефа наизусть.'],
              ['III', 'Верификатор',   'Прежде чем ответить — сверяется с картой. Не придумает того, чего нет.'],
              ['IV',  'Живой официант','Если нужно — зовёт человека в ваш Telegram со столом и контекстом.'],
            ].map(([n, t, d], i) => (
              <div key={n} style={{ padding: '24px 24px 0', borderRight: i < 3 ? `1.5px solid ${T.line}` : 'none' }}>
                <div style={{ fontFamily: FM, fontSize: 11, color: T.ochre, letterSpacing: 2 }}>№ {n}</div>
                <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 28, color: T.ink, margin: '10px 0 14px', lineHeight: 1.05 }}>{t}</div>
                <div style={{ ...TX.small, color: '#2E2C25' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice sample / dialogue */}
        <div style={{ padding: '56px 56px', borderBottom: `1.5px solid ${T.line}`, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48 }}>
          <div>
            <div style={{ ...TX.eyebrow, marginBottom: 14 }}>№ 03 · ГЛАВНОЕ</div>
            <div style={{ ...TX.h1, fontStyle: 'italic' }}>Голос,<br/>который <span style={{ color: T.moss }}>не врёт</span>.</div>
            <p style={{ ...TX.body, marginTop: 20, maxWidth: 440 }}>
              Каждый ответ проходит через отдельную модель-верификатор, которая сверяет сказанное с картой шефа. Если блюда нет в меню — гостю мягко предложат альтернативу, а не фантазию.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 18, ...TX.small }}>
              <span><b style={{ color: T.ink }}>97 %</b> точность</span>
              <span><b style={{ color: T.ink }}>0</b> галлюцинаций в логах</span>
              <span><b style={{ color: T.ink }}>&lt; 1.4 s</b> ответ</span>
            </div>
          </div>

          {/* Dialogue mockup */}
          <div style={{ background: T.ivory, border: `1.5px solid ${T.line}`, padding: '8px 0' }}>
            <div style={{ padding: '10px 20px', borderBottom: `1px dotted ${T.line}`, ...TX.masthead, display: 'flex', justifyContent: 'space-between' }}>
              <span>СТОЛ · 07</span><span>ДИАЛОГ №014</span><span>20:41</span>
            </div>
            {[
              ['guest', 'Что-нибудь лёгкое к рислингу, без рыбы?'],
              ['ai',    'Есть карпаччо из свёклы с козьим сыром — № 04, 520 ₽. Также мог бы порекомендовать крем из тыквы с тимьяновым маслом (№ 03).'],
              ['guest', 'А аллергенов?'],
              ['ai',    'В карпаччо — орехи и молочное. В крем-супе — орехи. Предупрежу кухню, если решите.'],
              ['guest', 'Позови официанта'],
              ['ai',    '→ Отправил Илье в Telegram. Он подойдёт через 1–2 минуты.'],
            ].map(([who, msg], i) => (
              <div key={i} style={{ padding: '14px 20px', borderBottom: i < 5 ? `1px dotted ${T.line}` : 'none', display: 'flex', gap: 14 }}>
                <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: 1.5, color: who === 'ai' ? T.moss : T.ochre, width: 40, paddingTop: 3, fontWeight: 600 }}>
                  {who === 'ai' ? 'AI · TM' : 'ГОСТЬ'}
                </div>
                <div style={{ ...TX.small, color: T.ink, flex: 1 }}>{msg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing / honest */}
        <div style={{ padding: '56px 56px', borderBottom: `1.5px solid ${T.line}`, background: T.ivory }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1.5px solid ${T.ink}`, ...TX.masthead }}>
            <span>№ 04 — ТАРИФ · ЧЕСТНЫЙ СЧЁТ</span>
            <span>₽ / МЕСЯЦ</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 28 }}>
            {[
              { n: 'I',   name: 'Пилот',   price: '0',    sub: 'первые 3 ресторана · полное сопровождение руками', bullets: ['Моё меню, моя настройка', 'До 30 столов', 'Telegram-бот в подарок', 'Честная себестоимость OpenRouter'] },
              { n: 'II',  name: 'Кафе',    price: '9 900',sub: 'После пилота — техфи за работу сервиса, не за поддержку руками', bullets: ['Хостинг, AI-токены OpenRouter, домен и SSL', 'Обновление меню 1 раз в 2 месяца', 'Мониторинг аптайма и быстрые фиксы багов', 'Email-поддержка, ответ до 24 ч'], featured: true },
              { n: 'III', name: 'Сеть',    price: '—',    sub: 'поговорим', bullets: ['От 3 точек', 'API и интеграции', 'Белая метка', 'SLA и отчётность'] },
            ].map((p, i) => (
              <div key={p.n} style={{
                padding: '28px 28px 28px',
                borderRight: i < 2 ? `1.5px solid ${T.line}` : 'none',
                background: p.featured ? T.paper : 'transparent',
                position: 'relative',
              }}>
                {p.featured && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: T.ochre }} />}
                <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, color: T.ochre }}>№ {p.n}</div>
                <div style={{ fontFamily: FH, fontStyle: 'italic', fontSize: 32, color: T.ink, marginTop: 8 }}>{p.name}</div>
                <div style={{ ...TX.italic, fontSize: 13, marginTop: 4, maxWidth: 260 }}>{p.sub}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 20 }}>
                  <div style={{ fontFamily: FM, fontSize: 40, fontWeight: 500, color: T.ink }}>{p.price}</div>
                  {p.price !== '—' && p.price !== '0' && <div style={{ fontFamily: FB, fontSize: 13, color: T.stone }}>₽ / мес</div>}
                </div>
                <div style={{ borderTop: `1px dotted ${T.line}`, margin: '18px 0' }} />
                {p.bullets.map((b, bi) => (
                  <div key={bi} style={{ ...TX.small, padding: '6px 0', display: 'flex', gap: 10 }}>
                    <span style={{ fontFamily: FM, color: T.ochre, fontSize: 10 }}>·</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: `1px dotted ${T.line}`, fontFamily: FH, fontStyle: 'italic', fontSize: 14, color: T.stone, lineHeight: 1.55, maxWidth: 720 }}>
            Я разработчик-одиночка. 9 900 ₽/мес — честная плата за то, чтобы продукт жил и работал. Это не агентство, не менеджер аккаунта, не круглосуточная поддержка.
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '36px 56px 24px', background: T.moss, color: T.paper }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <Lockup size={24} color={T.paper} accent={T.ochre} />
              <div style={{ ...TX.small, color: 'rgba(242,234,218,0.7)', marginTop: 14, maxWidth: 420 }}>
                Самозанятый · Калининград · 2026. Делаю руками для первых трёх ресторанов. Без ООО, без пресейла, без маркетинговых агентств.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 40px', fontFamily: FM, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(242,234,218,0.85)' }}>
              <span>Telegram</span><span>@tablemind</span>
              <span>Почта</span><span>hi@tablemind.ru</span>
              <span>Метод</span><span>/method</span>
              <span>Карта цен</span><span>/tarif</span>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 14, borderTop: `1px solid rgba(242,234,218,0.2)`, display: 'flex', justifyContent: 'space-between', fontFamily: FM, fontSize: 10, letterSpacing: 1.5, color: 'rgba(242,234,218,0.55)' }}>
            <span>© 2026 · TABLEMIND</span><span>№ 003 — ВЫПУСК · АПРЕЛЬ</span><span>СДЕЛАНО В КАЛИНИНГРАДЕ</span>
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

Object.assign(window, { SiteMock });
