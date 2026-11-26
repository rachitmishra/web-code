import json, re, sys
exec(open(sys.argv[2]).read())
d = json.load(open(sys.argv[1]))
OV = {'maatrubhaashe':'ಮಾತೃಭಾಷೆ','maatru bhaashe':'ಮಾತೃಭಾಷೆ'}
out = []; seen = set()
for r in d:
    raw = re.sub(r'\s+', ' ', r['raw']).strip(' .,-/')
    m = re.sub(r'\s+', ' ', r['meaning']).strip(' .,')
    if r['roman']:
        if not re.search(r'[aeiou]', raw) or len(raw) < 2: continue
        kn = OV.get(raw) or roman_to_kn(raw); tr = raw
    else:
        kn = r['kn'].strip(' .,-')
        if re.search(r'[A-Za-z0-9]', kn) or not re.search(r'[ಀ-೿]', kn): continue
        tr = kn_to_roman(kn)
    if len(kn.split()) > 3 or len(m.split()) > 7: continue
    if re.search(r'[ಀ-೿]', m): continue
    key = kn
    if key in seen: continue
    seen.add(key)
    out.append({'lesson': r['lesson'], 'kn': kn, 'tr': tr, 'en': m, 'src': 'roman' if r['roman'] else 'nudi'})
json.dump(out, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
print(len(out))
for i, r in enumerate(out): print(i, r['lesson'], r['kn'], '|', r['tr'], '|', r['en'])
