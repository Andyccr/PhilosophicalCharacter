#!/usr/bin/env python3
"""Build the self-hosted font kit for the NOEMA report + share cards.

Latin: copies @fontsource woff2 files (Source Serif 4, Source Sans 3, IBM Plex Mono; OFL-1.1)
       for the latin + latin-ext subsets.
CJK:   subsets Noto Serif CJK SC / Noto Sans CJK SC (OFL-1.1, = Source Han Serif/Sans) to every
       Han/CJK-punctuation character that occurs in the repo's src/ text (+ extra strings).
       Because every report string comes from repo data, a corpus subset is complete; re-run
       whenever the zh data changes.
Usage: python3 scripts/build-fonts.py <repo_root> <fontsource_node_modules> <out_dir> <cjk_font_dir>

This script is optional. `npm run build` does not call it. Workers Builds and GitHub
Actions do not install fonttools or the Noto CJK source TTCs.
"""
import re, sys, pathlib, shutil

if len(sys.argv) < 5:
    sys.stderr.write(
        "Usage: python3 scripts/build-fonts.py <repo_root> <fontsource_node_modules> <out_dir> <cjk_font_dir>\n"
        "Example: npm run fonts\n"
        "Requires Python fonttools and Noto Serif/Sans CJK SC .ttc files in <cjk_font_dir>.\n"
        "This step is optional and is not part of the default site build.\n"
    )
    raise SystemExit(2)

repo, nm, out, cjkdir = map(pathlib.Path, sys.argv[1:5])
if not cjkdir.is_dir():
    sys.stderr.write(
        f"CJK font directory not found: {cjkdir}\n"
        "Place NotoSerifCJK-Regular.ttc, NotoSerifCJK-Bold.ttc, NotoSansCJK-Regular.ttc,\n"
        "and NotoSansCJK-Bold.ttc there, then re-run `npm run fonts` after Chinese copy changes.\n"
        "This step is optional and is not part of the default site build.\n"
    )
    raise SystemExit(2)

try:
    from fontTools import subset
    from fontTools.ttLib import TTCollection, newTable
    from fontTools.pens.cu2quPen import Cu2QuPen
    from fontTools.pens.ttGlyphPen import TTGlyphPen
except ImportError:
    sys.stderr.write(
        "Python fonttools is not installed. Install fonttools in a local venv,\n"
        "then re-run `npm run fonts`. Do not add this to the Cloudflare build.\n"
    )
    raise SystemExit(2)


def cff_to_glyf(font, max_err=1.0):
    """Convert CFF outlines to TrueType (quadratic) so Chromium/Skia embeds the font as a real
    CID TrueType font instead of Type 3 bitmaps-of-paths (sharper, smaller, selectable PDFs)."""
    if 'CFF ' not in font: return
    gs = font.getGlyphSet(); glyf = newTable('glyf'); glyf.glyphOrder = font.getGlyphOrder(); glyf.glyphs = {}
    for name in font.getGlyphOrder():
        pen = TTGlyphPen(gs); gs[name].draw(Cu2QuPen(pen, max_err, reverse_direction=True)); glyf[name] = pen.glyph()
    font['glyf'] = glyf; font['loca'] = newTable('loca')
    font['maxp'].tableVersion = 0x00010000
    for attr in ('maxZones','maxTwilightPoints','maxStorage','maxFunctionDefs','maxInstructionDefs','maxStackElements','maxSizeOfInstructions','maxComponentElements'):
        setattr(font['maxp'], attr, 0)
    font['maxp'].maxZones = 1
    font['head'].indexToLocFormat = 0; font['head'].glyphDataFormat = 0
    font['post'].formatType = 3.0; font['post'].extraNames = []; font['post'].mapping = {}
    del font['CFF ']
    if 'VORG' in font: del font['VORG']
    font.sfntVersion = '\x00\x01\x00\x00'


out.mkdir(parents=True, exist_ok=True)

css = []
LATIN = [
  ('source-serif-4', 'Source Serif 4', [(400,'normal'),(600,'normal'),(400,'italic')]),
  ('source-sans-3', 'Source Sans 3', [(400,'normal'),(600,'normal')]),
  ('ibm-plex-mono', 'IBM Plex Mono', [(400,'normal')]),
]
for pkg, fam, variants in LATIN:
    for w, st in variants:
        cssfile = nm/'@fontsource'/pkg/(f'{w}.css' if st=='normal' else f'{w}-italic.css')
        text = cssfile.read_text()
        for block in re.findall(r'/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}', text, re.S):
            name, body = block
            if not re.search(r'-(latin|latin-ext)-\d+-(normal|italic)$', name): continue
            fn = f'{name}.woff2'
            shutil.copy(nm/'@fontsource'/pkg/'files'/fn, out/fn)
            ur = re.search(r'unicode-range:\s*([^;]+);', body).group(1)
            css.append(f"@font-face{{font-family:'{fam}';font-style:{st};font-weight:{w};font-display:block;"
                       f"src:url(./{fn}) format('woff2');unicode-range:{ur};}}")

chars = set()
for p in list((repo/'src').rglob('*.ts')) + list((repo/'src').rglob('*.tsx')) + list((repo/'src').rglob('*.astro')):
    chars |= set(p.read_text(encoding='utf-8'))
extra = pathlib.Path(__file__).with_name('extra-cjk.txt')
if extra.exists(): chars |= set(extra.read_text(encoding='utf-8'))
def is_cjk(c):
    o = ord(c)
    return (0x2E80 <= o <= 0x9FFF) or (0xF900 <= o <= 0xFAFF) or (0xFF00 <= o <= 0xFFEF) or (0x3000 <= o <= 0x303F) \
        or o in (0x2014, 0x2026, 0x201C, 0x201D, 0x2018, 0x2019, 0x00B7)
cjk = sorted(c for c in chars if is_cjk(c))
print('CJK glyphs in corpus:', len(cjk))
unicodes = [ord(c) for c in cjk]
CJK = [
  ('NotoSerifCJK-Regular.ttc', 'Noto Serif SC', 400, 'noto-serif-sc-400.woff2'),
  ('NotoSerifCJK-Bold.ttc',    'Noto Serif SC', 700, 'noto-serif-sc-700.woff2'),
  ('NotoSansCJK-Regular.ttc',  'Noto Sans SC', 400, 'noto-sans-sc-400.woff2'),
  ('NotoSansCJK-Bold.ttc',     'Noto Sans SC', 700, 'noto-sans-sc-700.woff2'),
]
for src, fam, w, fn in CJK:
    coll = TTCollection(str(cjkdir/src))
    font = next(f for f in coll.fonts if f['name'].getDebugName(1).endswith('CJK SC'))
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern','liga','locl','palt','vert']; opts.hinting = False; opts.desubroutinize = True
    s = subset.Subsetter(opts); s.populate(unicodes=unicodes); s.subset(font)
    cff_to_glyf(font)
    font.flavor = 'woff2'; font.save(str(out/fn))
    wr = '500 900' if w == 700 else '100 499'
    css.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{wr};font-display:block;src:url(./{fn}) format('woff2');}}")
(out/'fonts.css').write_text('\n'.join(css)+'\n')
for f in sorted(out.iterdir()): print(f'{f.stat().st_size/1024:8.1f} KB  {f.name}')
