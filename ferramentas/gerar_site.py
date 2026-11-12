import json, base64, struct, collections, html, math, os, shutil, sys
# Uso: python3 ferramentas/gerar_site.py <pasta-do-fig-descompactado>
#   (antes: node ferramentas/decodificar_fig.js <pasta>/canvas.fig ferramentas/.tmp/doc.json)
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
FIG = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(AQUI, '.tmp', 'fig')
IMAGENS = os.path.join(FIG, 'images')
os.chdir(os.path.join(AQUI, '.tmp'))

d = json.load(open('doc.json')); N = d['nodeChanges']
B = json.load(open('blobs.json'))
K = lambda g: f"{g['sessionID']}:{g['localID']}"
byid = {K(n['guid']): n for n in N}
kids = collections.defaultdict(list)
parent = {}
for n in N:
    p = n.get('parentIndex')
    if p:
        kids[K(p['guid'])].append((p.get('position', ''), n)); parent[K(n['guid'])] = K(p['guid'])
for k in kids: kids[k].sort(key=lambda x: x[0])
ch = lambda n: [c for _, c in kids[K(n['guid'])]]

# ---------- blobs -> svg path ----------
_pc = {}
def path(i):
    if i in _pc: return _pc[i]
    b = base64.b64decode(B[i]); o = 0; out = []
    while o < len(b):
        c = b[o]; o += 1
        n = {0: 0, 1: 2, 2: 2, 3: 4, 4: 6}.get(c)
        if n is None: break
        v = struct.unpack_from('<%df' % n, b, o); o += 4 * n
        out.append('ZMLQC'[c] + ' '.join(f'{x:.2f}'.rstrip('0').rstrip('.') for x in v))
    s = ''.join(out)
    while s.startswith('Z'): s = s[1:]
    _pc[i] = s; return s

# ---------- colors / paints ----------
def rgba(c, op=1):
    a = c.get('a', 1) * op
    return f"rgba({round(c['r']*255)},{round(c['g']*255)},{round(c['b']*255)},{a:.3g})"

def vis_paints(ps): return [p for p in (ps or []) if p.get('visible', True) and p.get('opacity', 1) > 0]

def inv(t):
    a, b, c = t['m00'], t['m01'], t['m02']
    d_, e, f = t['m10'], t['m11'], t['m12']
    det = a * e - b * d_
    if abs(det) < 1e-12: det = 1e-12
    ia, ib, id_, ie = e / det, -b / det, -d_ / det, a / det
    return lambda x, y: (ia * (x - c) + ib * (y - f), id_ * (x - c) + ie * (y - f))

def grad_pts(p, w, h):
    f = inv(p['transform'])
    x1, y1 = f(0, 0.5); x2, y2 = f(1, 0.5)
    return x1 * w, y1 * h, x2 * w, y2 * h

def css_grad(p, w, h):
    op = p.get('opacity', 1)
    x1, y1, x2, y2 = grad_pts(p, w, h)
    dx, dy = x2 - x1, y2 - y1
    if p['type'] == 'GRADIENT_RADIAL':
        stops = ','.join(f"{rgba(s['color'], op)} {s['position']*100:.1f}%" for s in p['stops'])
        return f"radial-gradient(farthest-side at {x1/w*100 if w else 50:.1f}% {y1/h*100 if h else 50:.1f}%,{stops})"
    ang = math.atan2(dx, -dy)  # css angle: 0 = to top, clockwise
    ux, uy = math.sin(ang), -math.cos(ang)
    L = abs(w * ux) + abs(h * uy) or 1
    cx, cy = w / 2, h / 2
    t = lambda x, y: 0.5 + ((x - cx) * ux + (y - cy) * uy) / L
    t1, t2 = t(x1, y1), t(x2, y2)
    stops = ','.join(f"{rgba(s['color'], op)} {(t1 + s['position']*(t2-t1))*100:.2f}%" for s in p['stops'])
    return f"linear-gradient({math.degrees(ang):.2f}deg,{stops})"

IMG = {}
def img_url(p):
    h = p['image']['hash'].replace('hex:', '')
    if h not in IMG:
        from PIL import Image; import io
        im = Image.open(os.path.join(IMAGENS, h)).convert('RGB')
        if im.width > 1200: im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
        bio = io.BytesIO(); im.save(bio, 'JPEG', quality=86)
        IMG[h] = bio.getvalue()
    return 'img/imagem-' + str(list(IMG).index(h) + 1) + '.jpg'

EXT = {}
for f in os.listdir(IMAGENS):
    head = open(os.path.join(IMAGENS, f), 'rb').read(4)
    EXT[f] = '.png' if head.startswith(b'\x89PNG') else '.jpg' if head[:2] == b'\xff\xd8' else ''

def css_bg(paints, w, h):
    layers = []
    for p in reversed(vis_paints(paints)):
        t = p['type']
        if t == 'SOLID': c = rgba(p['color'], p.get('opacity', 1)); layers.append(f"linear-gradient({c},{c})")
        elif t.startswith('GRADIENT'): layers.append(css_grad(p, w, h))
        elif t == 'IMAGE':
            mode = p.get('imageScaleMode', 'FILL')
            sz = {'FILL': 'cover', 'FIT': 'contain', 'STRETCH': '100% 100%'}.get(mode, 'auto')
            rep = 'repeat' if mode == 'TILE' else 'no-repeat'
            layers.append(f"url({img_url(p)}) center/{sz} {rep}")
    return ','.join(layers)

# ---------- svg defs (gradients) ----------
GID = [0]
def svg_fill(p, w, h, defs):
    t = p['type']; op = p.get('opacity', 1)
    if t == 'SOLID': return rgba(p['color'], op)
    if t.startswith('GRADIENT'):
        GID[0] += 1; gid = f"g{GID[0]}"
        x1, y1, x2, y2 = grad_pts(p, w, h)
        st = ''.join(f'<stop offset="{s["position"]}" stop-color="{rgba(s["color"], op)}"/>' for s in p['stops'])
        if t == 'GRADIENT_RADIAL':
            r = math.hypot(x2 - x1, y2 - y1)
            defs.append(f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{x1:.2f}" cy="{y1:.2f}" r="{r:.2f}">{st}</radialGradient>')
        else:
            defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}">{st}</linearGradient>')
        return f"url(#{gid})"
    if t == 'IMAGE':
        GID[0] += 1; gid = f"g{GID[0]}"
        defs.append(f'<pattern id="{gid}" patternUnits="userSpaceOnUse" width="{w}" height="{h}"><image href="{img_url(p)}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice"/></pattern>')
        return f"url(#{gid})"
    return 'none'

# ---------- effects ----------
def shadows(n, inset_ok=True):
    out = []
    for e in n.get('effects', []):
        if not e.get('visible', True): continue
        if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
            o = e.get('offset', {'x': 0, 'y': 0})
            out.append(f"{'inset ' if e['type']=='INNER_SHADOW' else ''}{o['x']:g}px {o['y']:g}px {e.get('radius',0):g}px {e.get('spread',0):g}px {rgba(e['color'])}")
    return out

def blur(n):
    for e in n.get('effects', []):
        if e.get('visible', True) and e['type'] == 'BACKGROUND_BLUR': return f"backdrop-filter:blur({e['radius']/2:g}px);"
        if e.get('visible', True) and e['type'] == 'FOREGROUND_BLUR': return f"filter:blur({e['radius']/2:g}px);"
    return ''

def radius(n):
    if n.get('rectangleCornerRadiiIndependent'):
        r = [n.get('rectangleTopLeftCornerRadius', 0), n.get('rectangleTopRightCornerRadius', 0), n.get('rectangleBottomRightCornerRadius', 0), n.get('rectangleBottomLeftCornerRadius', 0)]
        if any(r): return 'border-radius:' + ' '.join(f'{x:g}px' for x in r) + ';'
        return ''
    r = n.get('cornerRadius', 0)
    return f'border-radius:{r:g}px;' if r else ''

# ---------- interactions ----------
VIDEO_FIX = {}
EXTRA_ATTR = {}; EXTRA_HTML = collections.defaultdict(list)
OPORT_URL = 'https://superacao-ip.github.io/plataforma/'
OVERRIDE_URL = set()
def interactions(n):
    if K(n['guid']) in OVERRIDE_URL: return [{'e': 'c', 'k': 'url', 'u': OPORT_URL}]
    if K(n['guid']) in VIDEO_FIX: return [{'e': 'c', 'k': 'url', 'u': VIDEO_FIX[K(n['guid'])]}]
    acts = []
    for i in n.get('prototypeInteractions', []):
        if i.get('isDeleted'): continue
        ev = i.get('event', {}).get('interactionType')
        if ev not in ('ON_CLICK', 'DRAG', 'ON_PRESS'): continue
        e = 'd' if ev == 'DRAG' else 'c'
        for a in i.get('actions', []):
            ct = a.get('connectionType')
            if ct == 'URL': acts.append({'e': e, 'k': 'url', 'u': a.get('connectionURL', '')})
            elif ct == 'CLOSE': acts.append({'e': e, 'k': 'close'})
            elif ct == 'BACK': acts.append({'e': e, 'k': 'back'})
            elif ct == 'INTERNAL_NODE' and a.get('transitionNodeID'):
                tid = K(a['transitionNodeID'])
                if tid in byid: acts.append({'e': e, 'k': (a.get('navigationType') or 'NAVIGATE').lower(), 't': tid, 'tr': a.get('transitionType', '')})
    return acts

# ---------- text ----------
def num(v):
    t = f'{v:.3f}'.rstrip('0').rstrip('.')
    if t.startswith('0.'): t = t[1:]
    elif t.startswith('-0.'): t = '-' + t[2:]
    return t or '0'

def text_svg(n, w, h):
    td = n['textData']; dt = n.get('derivedTextData', {})
    glyphs = dt.get('glyphs')
    if not glyphs: return None
    sids = td.get('characterStyleIDs', [])
    ov = {s['styleID']: s for s in td.get('styleOverrideTable', [])}
    base_fill = n.get('fillPaints', [])
    def fill_for(sid):
        if sid and sid in ov and 'fillPaints' in ov[sid]: return ov[sid]['fillPaints']
        return base_fill
    groups = collections.defaultdict(list)
    for g in glyphs:
        if 'styleID' in g: sid = g['styleID']
        else:
            fc = g.get('firstCharacter', 0); sid = sids[fc] if fc < len(sids) else 0
        p = path(g['commandsBlob'])
        if not p: continue
        groups[sid].append((p, g))
    defs = []; parts = []
    for sid, gl in groups.items():
        ps = vis_paints(fill_for(sid))
        if not ps: continue
        fill = svg_fill(ps[-1], w, h, defs)
        byfs = collections.defaultdict(list)
        for p, g in gl:
            gid = GLY.setdefault(p, f"y{len(GLY)}")
            fs = g['fontSize']; x, y = g['position']['x'] / fs, -g['position']['y'] / fs
            byfs[fs].append(f'<use href="#{gid}" x="{num(x)}" y="{num(y)}"/>')
        inner_ = ''.join(f'<g transform="scale({fs:g},{-fs:g})">' + ''.join(u) + '</g>' for fs, u in byfs.items())
        parts.append(f'<g fill="{fill}">{inner_}</g>')
    for dec in dt.get('decorations', []):
        ps = vis_paints(fill_for(dec.get('styleID')))
        if not ps: continue
        fill = svg_fill(ps[-1], w, h, defs)
        for r in dec['rects']: parts.append(f'<rect x="{r["x"]:.2f}" y="{r["y"]:.2f}" width="{r["w"]:.2f}" height="{max(r["h"],0.6):.2f}" fill="{fill}"/>')
    return f'<svg class="t" width="{w:g}" height="{h:g}" overflow="visible"><defs>{"".join(defs)}</defs>{"".join(parts)}</svg>'

GLY = {}

def text_overlay(n):
    # transparent, selectable text + hyperlinks
    td = n['textData']; chars = td['characters']
    sids = td.get('characterStyleIDs', [])
    ov = {s['styleID']: s for s in td.get('styleOverrideTable', [])}
    fs = n.get('fontSize', 14)
    out = []; cur = None; buf = ''
    def flush():
        nonlocal buf
        if not buf: return
        t = html.escape(buf).replace(' ', '<br>').replace('\n', '<br>')
        link = ov.get(cur, {}).get('hyperlink', {}).get('url') if cur is not None else None
        out.append(f'<a href="{html.escape(link)}" target="_blank" rel="noopener">{t}</a>' if link else t)
        buf = ''
    for i, c in enumerate(chars):
        s = sids[i] if i < len(sids) else 0
        if s != cur: flush(); cur = s
        buf += c
    flush()
    al = {'LEFT': 'left', 'CENTER': 'center', 'RIGHT': 'right', 'JUSTIFIED': 'justify'}.get(n.get('textAlignHorizontal', 'LEFT'), 'left')
    lh = ''
    bl = n.get('derivedTextData', {}).get('baselines')
    if bl: lh = f"line-height:{bl[0]['lineHeight']:.2f}px;"
    fam = n.get('fontName', {}).get('family', 'Gotham')
    return f'<div class="tx" style="font-size:{fs:g}px;{lh}text-align:{al};font-family:\'{fam}\',Montserrat,sans-serif">{"".join(out)}</div>'

def text_html_fallback(n, w, h):
    ps = vis_paints(n.get('fillPaints'))
    col = rgba(ps[-1]['color']) if ps and ps[-1]['type'] == 'SOLID' else '#000'
    fn = n.get('fontName', {}); st = fn.get('style', '')
    wt = 700 if 'Bold' in st else 500 if 'Medium' in st or 'Semi' in st else 400
    return text_overlay(n).replace('class="tx"', f'class="tf" ').replace('style="', f'style="color:{col};font-weight:{wt};', 1)

# ---------- node render ----------
SHAPES = ('VECTOR', 'ELLIPSE', 'LINE', 'REGULAR_POLYGON', 'STAR', 'BOOLEAN_OPERATION', 'ROUNDED_RECTANGLE', 'RECTANGLE')

def render(n, root=False, fixed_out=None):
    if not n.get('visible', True) or n.get('isSoftDeleted'): return ''
    t = n['type']
    s = n.get('size', {'x': 0, 'y': 0}); w, h = s['x'], s['y']
    st = []
    if not root:
        T = n.get('transform', {'m00': 1, 'm01': 0, 'm02': 0, 'm10': 0, 'm11': 1, 'm12': 0})
        if T['m00'] == 1 and T['m01'] == 0 and T['m10'] == 0 and T['m11'] == 1:
            st.append(f"left:{T['m02']:.2f}px;top:{T['m12']:.2f}px;")
        else:
            st.append(f"transform:matrix({T['m00']:.5f},{T['m10']:.5f},{T['m01']:.5f},{T['m11']:.5f},{T['m02']:.2f},{T['m12']:.2f});")
    st.append(f"width:{w:.2f}px;height:{h:.2f}px;")
    op = n.get('opacity', 1)
    if op < 1: st.append(f"opacity:{op:g};")
    acts = interactions(n)
    attr = f' data-ia="{html.escape(json.dumps(acts))}"' if acts else ''
    attr += EXTRA_ATTR.get(K(n['guid']), '')
    cls = 'n' + (' ia' if acts else '')
    nm = html.escape(n.get('name', ''))[:60]

    if t == 'TEXT':
        svg = text_svg(n, w, h)
        inner = (svg + text_overlay(n)) if svg else text_html_fallback(n, w, h)
        return f'<div class="{cls}" style="{"".join(st)}"{attr}>{inner}</div>'

    simple_box = t in ('ROUNDED_RECTANGLE', 'RECTANGLE') or (t == 'ELLIPSE' and not n.get('arcData', {}).get('innerRadius') and abs(n.get('arcData', {}).get('endingAngle', 6.283) - 6.283) < 0.01)
    if t in SHAPES and not simple_box:
        defs = []; body = []
        for p in vis_paints(n.get('fillPaints')):
            fill = svg_fill(p, w, h, defs)
            for g in n.get('fillGeometry', []):
                body.append(f'<path d="{path(g["commandsBlob"])}" fill="{fill}" fill-rule="{"evenodd" if g.get("windingRule")=="ODD" else "nonzero"}"/>')
        for p in vis_paints(n.get('strokePaints')):
            fill = svg_fill(p, w, h, defs)
            for g in n.get('strokeGeometry', []):
                body.append(f'<path d="{path(g["commandsBlob"])}" fill="{fill}"/>')
        sh = shadows(n)
        if sh: st.append('filter:' + ' '.join(f'drop-shadow({x})' for x in sh) + ';')
        st = [x.replace(f"width:{w:.2f}px;height:{h:.2f}px;", f"width:{max(w,1):.2f}px;height:{max(h,1):.2f}px;") for x in st]
        return f'<svg class="{cls}" style="{"".join(st)}" overflow="visible"{attr}><defs>{"".join(defs)}</defs>{"".join(body)}</svg>'

    # FRAME / box
    bg = css_bg(n.get('fillPaints'), w, h)
    if bg: st.append(f"background:{bg};")
    if t == 'ELLIPSE': st.append('border-radius:50%;')
    else: st.append(radius(n))
    sh = shadows(n)
    sp = vis_paints(n.get('strokePaints'))
    sw = n.get('strokeWeight', 0)
    if sp and sw and sp[-1]['type'] == 'SOLID':
        c = rgba(sp[-1]['color'], sp[-1].get('opacity', 1))
        if n.get('borderStrokeWeightsIndependent'):
            bw = [n.get('borderTopWeight', 0), n.get('borderRightWeight', 0), n.get('borderBottomWeight', 0), n.get('borderLeftWeight', 0)]
            st.append(f"box-sizing:border-box;border-style:solid;border-color:{c};border-width:{' '.join(f'{x:g}px' for x in bw)};")
        else:
            al = n.get('strokeAlign', 'INSIDE')
            if al == 'INSIDE': sh.insert(0, f"inset 0 0 0 {sw:g}px {c}")
            elif al == 'OUTSIDE': sh.insert(0, f"0 0 0 {sw:g}px {c}")
            else: sh.insert(0, f"inset 0 0 0 {sw/2:g}px {c}"); sh.insert(0, f"0 0 0 {sw/2:g}px {c}")
    elif sp and sw and sp[-1]['type'].startswith('GRADIENT'):
        st.append(f"border:{sw:g}px solid transparent;box-sizing:border-box;background:{(bg+',') if bg else ''}{css_grad(sp[-1], w, h)} border-box;background-clip:padding-box,border-box;")
    if sh and not bg and not sp and not any(x.startswith('inset') for x in sh):
        st.append('filter:' + ' '.join('drop-shadow(' + ' '.join(x.split()[:3] + x.split()[4:]) + ')' for x in sh) + ';')
    elif sh: st.append('box-shadow:' + ','.join(sh) + ';')
    st.append(blur(n))
    clip = t == 'FRAME' and not n.get('frameMaskDisabled') and not n.get('resizeToFit')
    if clip: st.append('overflow:hidden;')
    inner = []
    for c in ch(n):
        if root and fixed_out is not None and c.get('scrollBehavior') == 'FIXED_WHEN_CHILD_OF_SCROLLING_FRAME':
            fixed_out.append(render(c)); continue
        inner.append(render(c))
    for _x in EXTRA_HTML.get(K(n['guid']), []): inner.append(_x)
    if K(n['guid']) in FAQ_ADD:
        f = json.loads(json.dumps(byid[FAQ])); f['transform'] = dict(f['transform']); f['transform']['m12'] = FAQ_ADD[K(n['guid'])]
        byid['_faq'] = f; kids[K(f['guid'])] = kids[FAQ]
        inner.append(render(f))
    kc = ch(n)
    if n.get('resizeToFit') and 36 < w < 40 and 36 < h < 40 and len(kc) == 3 and all(k['type'] == 'VECTOR' for k in kc) and shadows(n):
        inner = [f'<div style="position:absolute;inset:0;clip-path:circle(47% at 50% 50%)">{"".join(inner)}</div>']
    return f'<div class="{cls}" style="{"".join(st)}"{attr}>{"".join(inner)}</div>'

# --- fix: "O que pode entrar" (Módulo 2) had stale 2-line glyph layout overlapping the list
_n = byid.get('942:28')
if _n:
    gl = _n['derivedTextData']['glyphs']; l1 = [g for g in gl if g['position']['y'] < 25]; l2 = [g for g in gl if g['position']['y'] >= 25]
    if l2:
        last = l1[-1]; endx = last['position']['x'] + last['advance'] * last['fontSize'] + 0.25 * last['fontSize']
        for g in l2: g['position'] = {'x': g['position']['x'] + endx, 'y': l1[0]['position']['y']}
        _n['size']['x'] = 214; _n['size']['y'] = 22
        _n.setdefault('derivedTextData', {})['decorations'] = []

def _up(i, k):
    for _ in range(k): i = parent.get(i)
    return i
for _n in N:
    if _n['type'] == 'TEXT' and _n['textData']['characters'].strip() == 'Oportunidades':
        a2 = _up(K(_n['guid']), 2); a3 = _up(K(_n['guid']), 3)
        if a2 and byid[a2]['name'] == 'Frame 155': OVERRIDE_URL.add(a2)
        elif a3 and byid[a3]['name'] == 'Frame 68': OVERRIDE_URL.add(a3)
# FAQ button: exists only in one sidebar (1973:403); add to all other sidebars
FAQ = '1973:403'; FAQ_ADD = {}
def _desc(n):
    for c in ch(n):
        yield c; yield from _desc(c)
for _n in N:
    if _n['type'] == 'FRAME' and _n['name'] == 'Frame 161':
        texts = [d.get('textData', {}).get('characters', '') for d in _desc(_n)]
        if any('Tutoriais SIGMA' in t for t in texts) and not any('Perguntas frequentes' in t for t in texts):
            kids_ = ch(_n); bottom = max(c['transform']['m12'] + c['size']['y'] for c in kids_)
            FAQ_ADD[K(_n['guid'])] = bottom + 10
            i = K(_n['guid'])
            for _ in range(4):
                if 'size' not in byid[i]: break
                byid[i]['size'] = dict(byid[i]['size']); byid[i]['size']['y'] += 62
                i = parent.get(i)
                if not i or 'size' not in byid[i]: break
                if byid[i]['name'] == 'Frame 214':
                    if i: byid[i]['size']['y'] += 62
                    break
# Cabeçalho: alinha a faixa azul-escura (Frame 11, 1234 px no Figma) à largura da tela e à faixa do governo
_hdr_icon = None
for _n in N:
    if _n.get('name') == 'Frame 11' and _n['type'] == 'FRAME' and 1200 < _n['size']['x'] < 1260:
        _n['size'] = dict(_n['size']); _n['size']['x'] = 1194
        _n['transform'] = dict(_n['transform']); _n['transform']['m02'] = 0
        _n['cornerRadius'] = 0; _n['rectangleCornerRadiiIndependent'] = False
        for _c in ch(_n):
            if _c.get('name') == 'Frame 10':
                _c['transform'] = dict(_c['transform']); _c['transform']['m02'] = 40
                if any(d.get('name') == 'Frame 886' and any(v['type'] == 'VECTOR' for v in ch(d)) for d in ch(_c)): _hdr_icon = K(_c['guid'])
# Home (todas as posições do carrossel): faixa do governo fixa, em degradê azul, com o texto por cima,
# e a casinha no cabeçalho
_grad = next((n_ for n_ in N if n_.get('name') == 'Frame 855' and n_['type'] == 'FRAME' and any(p['type'].startswith('GRADIENT') for p in n_.get('fillPaints', []))), None)
_FIX = 'FIXED_WHEN_CHILD_OF_SCROLLING_FRAME'
def _fix_rect(r):
    if _grad: r['fillPaints'] = json.loads(json.dumps(_grad['fillPaints']))
    r['transform'] = dict(r['transform']); r['transform']['m02'] = 0
    r['size'] = dict(r['size']); r['size']['x'] = 1194
    r['cornerRadius'] = 0; r['rectangleCornerRadiiIndependent'] = False
def _fix_f11(f):
    f10 = [d for d in ch(f) if d.get('name') == 'Frame 10']
    if _hdr_icon and f10 and not any(d.get('name') == 'Frame 886' and any(v['type'] == 'VECTOR' for v in ch(d)) for d in ch(f10[0])):
        kids[K(f10[0]['guid'])] = kids[_hdr_icon]
for _root_n in N:
    if not (_root_n['type'] == 'FRAME' and _root_n.get('name', '').startswith('Tablet • Home')): continue
    _root = K(_root_n['guid']); top_items = list(kids[_root]); moved = []
    for pos, _c in top_items:
        nm_ = _c.get('name')
        if nm_ == 'Group 354':
            _c['transform'] = dict(_c['transform']); _c['transform']['m02'] = 0
            _c['size'] = dict(_c['size']); _c['size']['x'] = 1194
            for d in ch(_c):
                if d.get('name') == 'Rectangle 45': _fix_rect(d)
                if d.get('name') == 'Frame 11': _fix_f11(d)
        elif nm_ == 'Rectangle 45' and _c['transform']['m12'] < 5:
            _fix_rect(_c); _c['scrollBehavior'] = _FIX
        elif nm_ == 'Frame 11':
            _fix_f11(_c)
        elif nm_ == 'Frame 125' and _c['transform']['m12'] < 40:
            _c['scrollBehavior'] = _FIX; moved.append((pos, _c))
    for it in moved:
        kids[_root].remove(it); kids[_root].append(('~~~~', it[1]))
# Carrossel da Home: marca a faixa de cards (Frame 119) com a posição dela em cada tela
for _n in N:
    if _n.get('name') == 'Frame 119' and _n['type'] == 'FRAME' and _n['size']['x'] > 2000:
        EXTRA_ATTR[K(_n['guid'])] = EXTRA_ATTR.get(K(_n['guid']), '') + f' data-cx="{_n["transform"]["m02"]:.1f}"'
STAGE = [('346:691','453:4218','456:4426'),('346:701','856:6582','583:722'),('346:709','859:6869','583:818'),
         ('346:717','978:1496','583:914'),('346:725','978:1731','583:1010'),('346:738','978:1938','583:1111')]
for card, banner, btn in STAGE:
    for t in (banner, btn):
        if t in byid: byid[t]['fillPaints'] = json.loads(json.dumps(byid[card]['fillPaints']))

# ---------- build ----------
page = [c for c in ch(N[0]) if c['name'] == '2- Telas'][0]
screens = [c for c in ch(page) if c['type'] == 'FRAME' and c.get('visible', True)]
top = {K(c['guid']) for c in screens}
def top_of(id_):
    while id_ and id_ not in top: id_ = parent.get(id_)
    return id_

meta = {}; tpl = []
start = None
for c in screens:
    id_ = K(c['guid'])
    fx = []
    body = render(c, root=True, fixed_out=fx)
    bgc = n_bg = c.get('backgroundColor')
    ob = c.get('overlayBackgroundAppearance')
    meta[id_] = {'n': c['name'], 'w': c['size']['x'], 'h': c['size']['y'],
                 'ob': rgba(ob['backgroundColor']) if ob and ob.get('backgroundType') == 'SOLID_COLOR' else None,
                 'oc': c.get('overlayBackgroundInteraction') == 'CLOSE_ON_CLICK_OUTSIDE'}
    if c.get('prototypeStartingPoint', {}).get('name') == 'Flow 2': start = id_
    tpl.append(f'<template data-n="{html.escape(c["name"])}" id="s{id_.replace(":","_")}"><div class="scr">{body}</div><div class="fx">{"".join(fx)}</div></template>')

# keep only screens reachable from the start screen
import re as _re
_edges = {}
for c in screens:
    ids = set()
    def _w(n):
        for a in interactions(n):
            if 't' in a:
                t_ = top_of(a['t'])
                if t_: ids.add(t_)
        for k_ in ch(n): _w(k_)
    _w(c); _edges[K(c['guid'])] = ids
_seen = {start}; _st = [start]
while _st:
    for t_ in _edges.get(_st.pop(), ()):
        if t_ not in _seen: _seen.add(t_); _st.append(t_)
tpl = [t_ for t_ in tpl if _re.search(r'id="s([0-9_]+)"', t_).group(1).replace('_', ':') in _seen]
meta = {k: v for k, v in meta.items() if k in _seen}
# remap interaction targets that point inside screens
glyph_defs = ''.join(f'<path id="{g}" d="{p}"/>' for p, g in GLY.items())
tmap = {}
for n in N:
    for a_ in interactions(n):
        if 't' in a_: tmap[a_['t']] = top_of(a_['t'])
def post(x):
    x = x.replace('<defs></defs>', '')
    x = _re.sub(r'(\d+\.\d*?)0+px', r'\1px', x).replace('.px', 'px')
    return x
OUT = RAIZ
if os.path.exists(os.path.join(OUT, 'dados')): shutil.rmtree(os.path.join(OUT, 'dados'))
import glob as _glob
for f_ in _glob.glob(os.path.join(OUT, 'img', 'imagem-*.jpg')): os.remove(f_)
os.makedirs(OUT + '/dados', exist_ok=True); os.makedirs(OUT + '/img', exist_ok=True)
for i, b in enumerate(IMG.values()): open(f'{OUT}/img/imagem-{i+1}.jpg', 'wb').write(b)
open(OUT + '/dados/glifos.js', 'w').write(
    '/* Contornos das letras (fonte Gotham) extraídos do Figma. Cada texto das telas reutiliza estes desenhos. */\n'
    'document.body.insertAdjacentHTML("afterbegin", ' + json.dumps('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + glyph_defs + '</defs></svg>') + ');\n')
open(OUT + '/dados/mapa-telas.js', 'w').write(
    '/* META: nome e tamanho de cada tela/popup · START: tela inicial (Home) · TMAP: destino das interações */\n'
    'const META = ' + json.dumps(meta, ensure_ascii=False, indent=1) + ';\nconst START = ' + json.dumps(start) + ';\nconst TMAP = ' + json.dumps(tmap) + ';\n')
TELAS = {}
for t_ in tpl:
    m_ = _re.search(r'id="s([0-9_]+)"><div class="scr">(.*)</div><div class="fx">(.*)</div></template>$', t_, _re.S)
    TELAS[m_.group(1).replace('_', ':')] = post('<div class="scr">' + m_.group(2) + '</div><div class="fx">' + m_.group(3) + '</div>')
with open(OUT + '/dados/telas.js', 'w') as f:
    f.write('/* HTML de cada tela e popup, gerado a partir do Figma por ferramentas/gerar_site.py. Não edite à mão. */\nconst TELAS = {\n')
    for k_, v_ in TELAS.items():
        assert '`' not in v_ and '${' not in v_ and '\\' not in v_
        f.write(f' {json.dumps(k_)}: /* {meta[k_]["n"]} */\n`{v_}`,\n')
    f.write('};\n')
print('screens', len(TELAS), 'glyphs', len(GLY), 'start', start)
