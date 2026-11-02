const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const game = process.argv[2];
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => localStorage.clear());
  await p.goto(`file:///home/claude/shorts2/rec_${game}.html`); await p.waitForTimeout(800);
  await p.mouse.click(5, 5);
  const fn = fs.readFileSync('core.js', 'utf8').replace('/*__CFG__*/', fs.readFileSync(`cfg_${game}.js`, 'utf8'));
  const r = await p.evaluate(`(${fn})()`);
  fs.writeFileSync(`raw_${game}.webm`, Buffer.from(r.b64, 'base64'));
  console.log(game, r.mime, r.secs.toFixed(1), 'end card at', r.endAt.toFixed(1), errs); await b.close();
})();
