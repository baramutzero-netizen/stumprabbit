// Renders every band player alone (offline, 4 bars) and reports its loudness, so quiet ones can be lifted.
// usage: node tools/measure_band.js  (needs playwright; reads ../index.html)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, '../index.html')); await p.waitForTimeout(400);
  const res = await p.evaluate(async () => {
    const out = {};
    for (let v = 0; v < VENUES.length; v++) for (let k = 1; k <= 5; k++) {
      if (!LAYER[v * 10 + k]) continue;
      const SR = 22050, off = new OfflineAudioContext(1, Math.ceil(SR * 4.8), SR);
      AC = off; music = off.createGain(); music.connect(off.destination); sfx = music;
      NOISE = off.createBuffer(1, SR, SR); const d = NOISE.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const only = [false, false, false, false, false, false]; only[k] = true;
      for (let i = 0; i < 32; i++) arrange(v, 0.05 + i * STEP8, i % 8, Math.floor(i / 8), false, only, false);
      const buf = await off.startRendering(), x = buf.getChannelData(0), W = 1024, pw = [];
      for (let i = 0; i + W < x.length; i += W) { let s = 0; for (let j = 0; j < W; j++) s += x[i + j] * x[i + j]; pw.push(s / W); }
      pw.sort((a, c) => c - a); const top = pw.slice(0, Math.max(4, Math.floor(pw.length * 0.25)));
      const L = 10 * Math.log10(top.reduce((a, c) => a + c, 0) / top.length + 1e-12);
      out[v * 10 + k] = { name: NODE[LAYER[v * 10 + k]].n, L: Math.round(L * 10) / 10 };
    }
    return out;
  });
  console.log(JSON.stringify(res));
  await b.close();
})();
