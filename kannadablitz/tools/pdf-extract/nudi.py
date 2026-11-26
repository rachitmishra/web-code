import ast, sys
def load(path):
    tree = ast.parse(open(path, encoding='utf-8').read())
    d = {}
    for n in tree.body:
        if isinstance(n, ast.Assign):
            d[n.targets[0].id] = ast.literal_eval(n.value)
    return d
import os
M = load(os.environ['NUDI_MAPPING'])
mappings, broken, dep, vatt, ign = M['mappings'], M['broken_cases'], M['dependent_vowels'], M['vattaksharagalu'], M['ignoreList']
def word(w):
    i = 0; out = []
    while i < len(w):
        if w[i] in ign: i += 1; continue
        if w[i] == 'ð':
            # reph: move ರ್ before the start of the previous akshara
            k = len(out) - 1
            while k > 0 and (out[k] in dep or out[k] in 'ಂಃ' or (out[k-1] == '್')):
                k -= 1 if out[k] in dep or out[k] in 'ಂಃ' else 2
            out[k:k] = ['ರ', '್']; i += 1; continue
        for j in (5,4,3,2,1):
            s = w[i:i+j]
            if s in mappings:
                out += list(mappings[s]); i += j; break
            if j == 1:
                c = w[i]
                if c in vatt:
                    if out and out[-1] in dep:
                        v = out[-1]; out[-1] = '್'; out += [vatt[c], v]
                    else: out += ['್', vatt[c]]
                elif c in broken:
                    if out and out[-1] in broken[c]['mapping']: out[-1] = broken[c]['mapping'][out[-1]]
                    else: out.append(broken[c]['value'])
                else: out.append(c)
                i += 1
    return ''.join(out)
def line(l): return ' '.join(word(x) for x in l.split(' '))
