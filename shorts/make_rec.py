import base64, subprocess, os, sys
game, cfg = sys.argv[1], sys.argv[2]
root = f'/home/claude/{game}'
src = open(f'{root}/game.src.html', encoding='utf-8').read()
src = src.replace("const sleep = ms => new Promise(r => setTimeout(r, ms));", "const sleep = ms => new Promise(r => setTimeout(r, ms * (window.__endK || 1)));")
extra = open('core.js', encoding='utf-8').read() + open(cfg, encoding='utf-8').read()
chars = set(src) | set(extra) | set('0123456789만억조경해자양구간정재극항하사아승기나유타불가무량대수,.+%×÷=→▲▼#')
tmp = '/tmp/claude-0/_rc.txt'; open(tmp, 'w', encoding='utf-8').write(''.join(sorted(chars)))
css = ''
for fam in ('Galmuri14', 'Galmuri11'):
    out = f'/tmp/claude-0/_rc_{fam}.woff2'
    subprocess.run(['pyftsubset', f'/home/claude/sogwi/package/dist/{fam}.ttf', f'--text-file={tmp}', '--flavor=woff2', f'--output-file={out}'], check=True)
    css += f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{base64.b64encode(open(out,'rb').read()).decode()}) format('woff2');font-display:block}}\n"
html = src.replace('/*__FONTS__*/', css).replace('/*__SPRITES__*/null', open(f'{root}/tools/sprites.json', encoding='utf-8').read())
open(f'rec_{game}.html', 'w', encoding='utf-8').write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + html + '</body></html>')
print('rec ok', game)
