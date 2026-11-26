import re, sys, json
sys.argv_ = sys.argv
exec(open(sys.argv[2]).read())  # nudi converter (own code)
lines = open(sys.argv[1], encoding='utf-8').read().split('\n')
lesson = 0; seen_19 = False; res = []
pat = re.compile(r"^\s*([^'’‘`0-9:;=]{1,40}?)\s+['‘’`]([^'‘’`]{1,60})['‘’;]?\s*(?:\((?:n|v|N|V)\))?\s*\)?\s*$")
for ln in lines:
    m = re.match(r'\s*(?:LESSON|¥ÁoÀ)\s*-\s*(\d+)', ln)
    if m:
        n = int(m.group(1))
        if n == 19 and seen_19: n = 20
        if n == 19: seen_19 = True
        lesson = n; continue
    if 'Part II' in ln and lesson == 25: lesson = 26
    m = pat.match(ln)
    if not m or lesson == 0: continue
    term, meaning = m.group(1).strip(), m.group(2).strip()
    is_roman = bool(re.fullmatch(r"[A-Za-zñ .\-/()]+", term))
    kn = None if is_roman else line(term)
    res.append({'lesson': lesson, 'raw': term, 'roman': is_roman, 'kn': kn, 'meaning': meaning})
json.dump(res, open(sys.argv[3], 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(len(res), sorted(Counter(r['lesson'] for r in res).items()))
