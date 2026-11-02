"""Build: subset the pixel fonts to the characters used, embed sprites, write the standalone game."""
import base64, subprocess, os, json
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, '..')
src = open(os.path.join(root, 'game.src.html'), encoding='utf-8').read()
sprites = open(os.path.join(here, 'sprites.json'), encoding='utf-8').read()
chars = set(src) | set('0123456789만억조경해자양구간정재극항하사아승기나유타불가무량대수,.+%×÷=→▲▼#ACRNTFJOSAMEVIP★')
tmp = os.path.join(here, '_chars.txt'); open(tmp, 'w', encoding='utf-8').write(''.join(sorted(chars)))
FONTDIR = os.environ.get('GALMURI', '/home/claude/sogwi/package/dist')
css = ''
for fam in ('Galmuri14', 'Galmuri11'):
    out = os.path.join(here, f'_{fam}.woff2')
    subprocess.run(['pyftsubset', f'{FONTDIR}/{fam}.ttf', f'--text-file={tmp}', '--flavor=woff2', f'--output-file={out}'], check=True)
    b = base64.b64encode(open(out, 'rb').read()).decode(); os.remove(out)
    css += f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b}) format('woff2');font-display:block}}\n"
os.remove(tmp)
html = src.replace('/*__FONTS__*/', css).replace('/*__SPRITES__*/null', sprites)
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
open(os.path.join(root, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(html)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0}</style>\n</head>\n<body>\n' + html + '\n</body>\n</html>\n')
print('built', len(html) // 1024, 'KB')
