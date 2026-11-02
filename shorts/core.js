// Shared Shorts recorder. Runs inside a game rec.html; the CFG placeholder below is replaced with the game script.
async () => {
  /*__CFG__*/
  const J = window[CFG.api], sleep = ms => new Promise(r => setTimeout(r, ms));
  await document.fonts.ready;
  J.initAudio(); window.__noBlip = 1;
  for (let i = 0; i < 60 && !J.ctx(); i++) await sleep(50);
  await sleep(600);
  const AC = J.ctx(), dest = AC.createMediaStreamDestination(); J.out().connect(dest);
  const W = 1080, H = 1920, out = document.createElement('canvas'); out.width = W; out.height = H;
  const x = out.getContext('2d'); x.imageSmoothingEnabled = false;
  const C = CFG.colors, $ = id => document.getElementById(id);
  let caption = ['', ''], capAt = 0, endCard = 0, pressT = -9;
  function text(t, cx, y, size, color, font = 'Galmuri14', align = 'center', shadow = true, maxW = 1000) {
    x.font = `${size}px ${font}, sans-serif`; while (size > 20 && x.measureText(t).width > maxW) { size -= 2; x.font = `${size}px ${font}, sans-serif`; }
    x.textAlign = align; x.textBaseline = 'top'; if (shadow) { x.fillStyle = '#000'; x.fillText(t, cx + 4, y + 4); } x.fillStyle = color; x.fillText(t, cx, y);
  }
  const icon = spr(CFG.icon[0], CFG.icon[1] || null);
  const t0 = performance.now();
  function frame() {
    const now = (performance.now() - t0) / 1000;
    x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
    x.fillStyle = C.band; x.fillRect(0, 0, W, 290); x.fillStyle = '#000'; x.fillRect(0, 290, W, 6);
    text(CFG.title, W / 2, 70, CFG.titleSize || 112, C.accent);
    text(CFG.sub, W / 2, 206, 40, C.dim, 'Galmuri11', 'center', false);
    const ca = Math.min(1, (now - capAt) / 0.25); x.globalAlpha = ca;
    text(caption[0], W / 2, 336 - (1 - ca) * 20, 62, C.cream);
    if (caption[1]) text(caption[1], W / 2, 418 - (1 - ca) * 20, 44, C.leaf, 'Galmuri11', 'center', false);
    x.globalAlpha = 1;
    x.fillStyle = C.panel; x.fillRect(60, 500, 960, 210); x.strokeStyle = C.line; x.lineWidth = 6; x.strokeRect(63, 503, 954, 204);
    text($('hlLabel').textContent, W / 2, 520, 34, C.dim, 'Galmuri11', 'center', false);
    text($('headline').textContent, W / 2, 572, 72, C.cream, 'Galmuri14', 'center', true, 900);
    text($('fine').textContent, W / 2, 660, 32, C.faint, 'Galmuri11', 'center', false);
    x.fillStyle = '#000'; x.fillRect(52, 742, 976, 556); x.drawImage(J.cv, 0, 0, 320, 180, 60, 750, 960, 540);
    const lines = [...document.querySelectorAll('#ending .ln')];
    lines.forEach((l, i) => { const big = l.classList.contains('big'); x.font = `${big ? 64 : 44}px Galmuri14`; const w = Math.min(980, x.measureText(l.textContent).width + 40); x.fillStyle = 'rgba(10,8,6,.85)'; x.fillRect(W / 2 - w / 2, 772 + i * 76, w, big ? 76 : 62); text(l.textContent, W / 2, 780 + i * 76, big ? 64 : 44, big ? C.red : C.cream, 'Galmuri14', 'center', true, 950); });
    text($('cheer').textContent + ' ' + CFG.unit, 1020, 1330, 66, C.gold, 'Galmuri14', 'right', false);
    text('장소 · ' + VENUES[J.D().venue], 60, 1336, 42, C.dim, 'Galmuri11', 'left', false, 520);
    text(CFG.stat(), 60, 1406, 40, C.leaf, 'Galmuri11', 'left', false, 960);
    const pd = now - pressT < 0.09 ? 8 : 0;
    x.fillStyle = '#000'; x.fillRect(196, 1500 + pd, 688, 200); x.fillStyle = C.accent; x.fillRect(200, 1504 + pd, 680, 186); x.fillStyle = C.btnShade; x.fillRect(200, 1678 + pd, 680, 12);
    const k = Math.min(100 / icon.width, 110 / icon.height); x.drawImage(icon, 0, 0, icon.width, icon.height, 320 - icon.width * k / 2, 1597 + pd - icon.height * k / 2, icon.width * k, icon.height * k);
    text(CFG.tapLabel, 620, 1556 + pd, 64, C.ink, 'Galmuri14', 'center', false);
    if (endCard) {
      const a = Math.min(1, (now - endCard) / 0.6); x.fillStyle = `rgba(14,12,10,${0.9 * a})`; x.fillRect(0, 0, W, H); x.globalAlpha = a;
      CFG.endCard.forEach(([s, y, size, col, font]) => text(s, W / 2, y, size, C[col] || col, font || 'Galmuri14', 'center', true, 1000));
      x.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const stream = out.captureStream(30); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12e6, audioBitsPerSecond: 192e3 });
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data); rec.start(500);
  const h = {
    sleep, cap: (a, b = '', instant = false) => { caption = [a, b]; capAt = instant ? -1 : (performance.now() - t0) / 1000; },
    tap: () => { CFG.tap(J); pressT = (performance.now() - t0) / 1000; },
    async tapFor(ms, ps = 5) { const end = performance.now() + ms; while (performance.now() < end) { h.tap(); await sleep(1000 / ps); } },
    buy: id => { const n = J.NODE[id]; if (!n || J.S().owned[n.id]) return; J.S().cheer += n.cost; J.buy(n); },
    async buyAll(v, gap) { for (const n of J.NODES.filter(n => n.v === v && n.type !== 'venue' && n.type !== 'end')) { h.buy(n.id); if (gap) await sleep(gap); } },
    async venue(v, gap, hold) { h.buy('v' + v); await h.buyAll(v, gap); if (hold) await sleep(hold); },
    J,
  };
  await CFG.play(h);
  for (let i = 0; i < 600 && !document.querySelector('#resultBox .result'); i++) await sleep(50);
  endCard = (performance.now() - t0) / 1000;
  await sleep(3000);
  rec.stop(); await new Promise(r => rec.onstop = r);
  const buf = new Uint8Array(await new Blob(chunks, { type: mime }).arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return { mime, b64: btoa(s), secs: (performance.now() - t0) / 1000, endAt: endCard };
}
