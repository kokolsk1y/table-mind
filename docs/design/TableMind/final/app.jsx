// Entry — final brand system canvas

function Intro() {
  return (
    <DCSection
      title="TableMind · Brand System — D / Menu Card (final)"
      subtitle="Финализированная концепция: бренд как типографика меню. Прокрутите вправо."
    >
      <DCArtboard label="Философия" width={720} height={560}>
        <div style={{ background: T.paper, width: '100%', height: '100%', padding: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...TX.masthead, paddingBottom: 10, borderBottom: `1.5px solid ${T.ink}` }}>
            <span>TABLEMIND · N° 003</span>
            <span>EDITION · 20·IV·2026</span>
          </div>
          <div style={{ fontFamily: FH, fontWeight: 400, fontStyle: 'italic', fontSize: 52, letterSpacing: -1.4, lineHeight: 0.95, color: T.ink }}>
            Бренд, который<br/>живёт внутри <span style={{ color: T.moss }}>меню.</span>
          </div>
          <Rule color={T.line} />
          <div style={{ ...TX.body }}>
            TableMind говорит языком карты: шапка с номером издания, линейки, dotted leaders, tabular figures, ochre-акцент как «точка цены». Интерфейс и сайт — один и тот же набор приёмов.
          </div>
          <Rule color={T.line} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...TX.small }}>
            <div><b style={{ color: T.ink }}>Primary</b> — Moss {T.moss}</div>
            <div><b style={{ color: T.ink }}>Accent</b> — Ochre {T.ochre}</div>
            <div><b style={{ color: T.ink }}>Paper</b> — Oat {T.paper}</div>
            <div><b style={{ color: T.ink }}>Ink</b> — Press {T.ink}</div>
            <div><b style={{ color: T.ink }}>Heading</b> — Playfair italic</div>
            <div><b style={{ color: T.ink }}>Body</b> — DM Sans</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ ...TX.italic, fontSize: 16 }}>
            ~ шесть артбордов: лого, палитра, типографика, компоненты, сайт, PWA
          </div>
        </div>
      </DCArtboard>
    </DCSection>
  );
}

function Final() {
  return (
    <DesignCanvas>
      <Intro />
      <DCSection title="Identity" subtitle="Логотип, палитра, типографика, компоненты" gap={56}>
        <LogosArtboard />
        <ColorArtboard />
        <TypeArtboard />
        <ComponentsArtboard />
      </DCSection>
      <DCSection title="Applications" subtitle="Маркетинговый сайт (B2B) и гостевой PWA" gap={56}>
        <SiteMock />
        <PwaArtboard />
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Final />);
