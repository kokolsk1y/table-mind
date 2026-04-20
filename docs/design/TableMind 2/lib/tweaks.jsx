// Tweaks panel — floating bottom-right
function TweaksPanel() {
  const t = useTweaks();
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e?.data?.type === '__activate_edit_mode') { setVisible(true); setOpen(true); }
      if (e?.data?.type === '__deactivate_edit_mode') { setVisible(false); setOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!visible) return null;

  const label = { fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(30,30,24,0.55)', marginBottom: 8 };
  const row = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  const chip = (active) => ({
    padding: '6px 10px', fontFamily: '"Inter Tight", sans-serif', fontSize: 11,
    background: active ? '#1E1E18' : 'transparent',
    color: active ? '#F3ECD8' : '#1E1E18',
    border: `1px solid ${active ? '#1E1E18' : 'rgba(30,30,24,0.2)'}`,
    borderRadius: 2, cursor: 'pointer',
  });

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: open ? 280 : 'auto',
      background: '#FAF6EB', border: '1px solid rgba(30,30,24,0.14)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 9999, padding: open ? 20 : 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 15, fontWeight: 500 }}>Tweaks</div>
        <div style={{ fontSize: 14 }}>{open ? '−' : '+'}</div>
      </div>

      {open && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={label}>Основной зелёный</div>
            <div style={row}>
              {Object.entries(GREENS).map(([k, v]) => (
                <button key={k} style={chip(t.greenChoice === k)} onClick={() => tweakStore.set({ greenChoice: k })}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, background: v.hex, marginRight: 6, verticalAlign: 'middle' }} />
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={label}>Акцент</div>
            <div style={row}>
              {Object.entries(ACCENTS).map(([k, v]) => (
                <button key={k} style={chip(t.accentChoice === k)} onClick={() => tweakStore.set({ accentChoice: k })}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, background: v.hex, marginRight: 6, verticalAlign: 'middle' }} />
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={label}>Serif заголовков</div>
            <div style={row}>
              {Object.entries(SERIFS).map(([k, v]) => (
                <button key={k} style={chip(t.serifChoice === k)} onClick={() => tweakStore.set({ serifChoice: k })}>
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={label}>Режим</div>
            <div style={row}>
              <button style={chip(!t.dark)} onClick={() => tweakStore.set({ dark: false })}>Light</button>
              <button style={chip(t.dark)} onClick={() => tweakStore.set({ dark: true })}>Dark</button>
            </div>
          </div>

          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: 'rgba(30,30,24,0.4)', lineHeight: 1.5, marginTop: 4 }}>
            Включите Tweaks в тулбаре — панель откроется здесь. Переключения синхронизируются сразу во всех трёх концепциях.
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TweaksPanel });
