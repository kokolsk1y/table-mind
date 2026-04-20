// Entrypoint — canvas with intro artboard + three concepts + tweaks panel

function IntroArtboard() {
  return (
    <DCSection
      title="TableMind · три альтернативные концепции"
      subtitle="Внутри каждой — логотип (3 варианта), палитра, типографика, компоненты, hero сайта, экран PWA. Прокручивайте вправо и вниз."
    >
      <DCArtboard label="Система и гипотезы" width={720} height={560}>
        <div style={{ padding: 48, background: '#FAF6EB', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 300, fontSize: 44, letterSpacing: -1.4, lineHeight: 1, fontVariationSettings: '"SOFT" 60, "opsz" 144' }}>
            Три способа<br/><span style={{ fontStyle: 'italic' }}>рассказать о TableMind.</span>
          </div>
          <div style={{ height: 1, background: 'rgba(30,30,24,0.14)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, fontFamily: '"Inter Tight", sans-serif', fontSize: 13, lineHeight: 1.5, color: '#2E2C25' }}>
            <div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, marginBottom: 8 }}>A — Botanica</div>
              <div>Ботанический знак (лист мяты + линия стола), serif Fraunces + Caveat. Самая тёплая. Для «шеф-повар, наш огород».</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, marginBottom: 8 }}>C — Monogram TM</div>
              <div>Лигатура: Т как стол, M как три сервировки. Cormorant + Work Sans. Самый premium. Тишина — главный приём.</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 22, marginBottom: 8 }}>D — Menu Card</div>
              <div>Бренд = типографика меню. Playfair italic + DM Sans + JetBrains Mono. Самый редакционный. Лёгкий для PWA.</div>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(30,30,24,0.14)' }} />
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: '#57544C', letterSpacing: 0.5, lineHeight: 1.6 }}>
            · Палитра общая: moss / forest / olive + oat / paper + ochre / terracotta / curry.<br/>
            · Лого — латиница · Интерфейсы — русский.<br/>
            · Никаких AI-клише: ни чипов, ни волн, ни звёздочек, ни нейро-форм.<br/>
            · PWA: CSS/SVG только, без фотографий — &lt; 2 сек на 4G.<br/>
            · Tweaks (панель справа снизу): переключатели зелёного, акцента, serif и dark.
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: '"Caveat", cursive', fontSize: 22, color: '#C48A2A' }}>
            ~ ждём вашего выбора, чтобы финализировать одну
          </div>
        </div>
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <React.Fragment>
      <DesignCanvas>
        <IntroArtboard />
        <BotanicaConcept />
        <MonogramConcept />
        <MenuCardConcept />
      </DesignCanvas>
      <TweaksPanel />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
