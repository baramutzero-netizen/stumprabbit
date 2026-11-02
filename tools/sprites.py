"""Pixel sprites for 수주대토 (그루터기 지키며 토끼 기다리기) — single source of truth.
Writes sprites.json (embedded into the game) and exports .aseprite + .png into ../assets/."""
import json, os
from PIL import Image
from aseprite import write_aseprite
here = os.path.dirname(os.path.abspath(__file__))
PAL = {
    'k': '#2a1a12', 'h': '#3a2a24', 'f': '#efc49a', 'F': '#d8a87a', 'e': '#1b1418', 'm': '#8b2b2b', 's': '#4c6b8a',
    'p': '#3a3a48', 'y': '#f3c34f', 'R': '#d9443a', 'w': '#f1ece0', 'g': '#9aa3ad', 'b': '#7a5232', 'c': '#f1ece0',
    'B': '#c89a62', 'D': '#5a3a20', 'n': '#f0a0b0', 'G': '#6a9a4a', 'Y': '#d89a4a', 'o': '#a86a2a',
}
SPR = {
    'actor': ['..kkkkk...', '.khhhhhk..', '.khffffk..', '.kfeffek..', '.kffmffk..', '..kffffk..', '.kssssssk.', 'ksssssssk.',
              'kfssssssfk', 'kfssssssfk', '.kssssssk.', '.kppppppk.', '.kppkkppk.', '.kpk..kpk.', '.kpk..kpk.', '.kpk..kpk.', 'kkkk..kkkk'],
    # sitting, facing right, chin in hand
    'sit': ['..kkkkk.....', '.khhhhhk....', '.khffffk....', '.kffefek....', '.kfffmfk....', '..kffffk....', '.ksssssk....', 'kssssssfk...',
            'ksssssfffk..', 'kssssssk....', 'kpppppppppk.', 'kpppppppppk.', '.kkkkkk.kpk.', '........kpk.', '.......kkkk.'],
    'person': ['..kkkk..', '.khhhhk.', '.kfefek.', '.kfmmfk.', '..kffk..', '.kssssk.', 'kfssssfk', 'kfssssfk',
               '.kssssk.', '.kppppk.', '.kpkkpk.', '.kk..kk.'],
    'rabbit': ['..k.k.....', '.knknk....', '.knknk....', '.kwkwk....', 'kwwwwwkkk.', 'kewwwwwwwk', 'kwwwwwwwwk', '.kwwwwwwwk', '..kk...kk.'],
    'stump': ['...kkkkkkkkkk...', '..kBBBDBBBDBBk..', '..kBBDBBBBBDBk..', '..kbBBBBBBBBbk..', '..kbbbbbbbbbbk..', '..kbDbbbDbbbbk..',
              '..kbbbbDbbbDbk..', '.kbbDbbbbbbbbbk.', 'kbbbbbbDbbbbbbbk', 'kkkkkkkkkkkkkkkk'],
    'hoe': ['.........k', '........kb', '.......kb.', '......kb..', '.....kb...', '....kb....', 'kkkkb.....', 'kggk......', 'kggk......', 'kkkk......'],
    'clock': ['..kkkk..', '.kwwwwk.', 'kwwkwwwk', 'kwwkwwwk', 'kwwkkkwk', 'kwwwwwwk', '.kwwwwk.', '..kkkk..'],
    'sprout': ['..G.G...', '.GG.GG..', '..GGG...', '...G....', '...G....'],
    'carrot': ['.G.G', '..G.', '.RR.', '.RR.', '..R.'],
    'dog': ['........k..k', '.......kokok', 'k......kYYYk', 'Yk....kYYeYk', '.k....kYYYYk', '.kkkkkYYYkkk', 'kYYYYYYYYk..', 'kYYYYYYYYk..', '.kYk..kYk...', '.kk...kk....'],
    'drum': ['.kkkkkk.', 'kcccccck', 'kggggggk', 'kRRyyRRk', 'kRRRRRRk', 'kRyRRyRk', 'kRRRRRRk', '.kkkkkk.'],
    'flag': ['kkkkkkk.', 'kyyyyyyk', 'kyyyyyyk', 'kkkkkkk.', 'k.......', 'k.......', 'k.......', 'k.......', 'k.......', 'k.......'],
}
def img(name):
    rows = SPR[name]; im = Image.new('RGBA', (len(rows[0]), len(rows)))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch == '.': continue
            h = PAL[ch]; im.putpixel((x, y), tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,))
    return im
if __name__ == '__main__':
    for n, rows in SPR.items(): assert len(set(map(len, rows))) == 1, (n, [len(r) for r in rows])
    json.dump({'pal': PAL, 'cpal': {}, 'spr': SPR}, open(os.path.join(here, 'sprites.json'), 'w'), ensure_ascii=False)
    out = os.path.join(here, '..', 'assets'); os.makedirs(out + '/aseprite', exist_ok=True); os.makedirs(out + '/png', exist_ok=True)
    pal = [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,) for h in PAL.values()]
    for n in SPR:
        im = img(n); write_aseprite(f'{out}/aseprite/{n}.aseprite', [im], palette=pal)
        im.resize((im.width * 4, im.height * 4), Image.NEAREST).save(f'{out}/png/{n}_x4.png')
    print('sprites ok', len(SPR))
