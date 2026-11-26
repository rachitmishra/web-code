import re
V = [('aa','ಆ','ಾ'),('ii','ಈ','ೀ'),('uu','ಊ','ೂ'),('ee','ಏ','ೇ'),('oo','ಓ','ೋ'),('ai','ಐ','ೈ'),('au','ಔ','ೌ'),
     ('a','ಅ',''),('i','ಇ','ಿ'),('u','ಉ','ು'),('e','ಎ','ೆ'),('o','ಒ','ೊ'),('R','ಋ','ೃ')]
C = [('kh','ಖ'),('gh','ಘ'),('ch','ಛ'),('Jh','ಝ'),('jh','ಝ'),('Th','ಠ'),('Dh','ಢ'),('th','ಥ'),('dh','ಧ'),('ph','ಫ'),('bh','ಭ'),('sh','ಷ'),
     ('k','ಕ'),('g','ಗ'),('c','ಚ'),('J','ಜ'),('j','ಜ'),('ñ','ಞ'),('T','ಟ'),('D','ಡ'),('N','ಣ'),('t','ತ'),('d','ದ'),('n','ನ'),
     ('p','ಪ'),('b','ಬ'),('m','ಮ'),('y','ಯ'),('r','ರ'),('l','ಲ'),('v','ವ'),('w','ವ'),('S','ಶ'),('s','ಸ'),('h','ಹ'),('L','ಳ'),('f','ಫ'),('z','ಜ')]
def _match(s, i, table):
    for k, *v in table:
        if s.startswith(k, i): return k, v
    return None, None
NASAL = set('nNmñ')
def to_kn(word):
    s = word; i = 0; out = []
    while i < len(s):
        ch = s[i]
        # 'ay'/'av' before consonant or end -> diphthong
        if s.startswith('ay', i) or s.startswith('av', i):
            nxt = s[i+2:i+3]
            if (not nxt or not re.match(r'[aeiouAEIOUR]', nxt)) and nxt != s[i+1]:
                pass
        k, v = _match(s, i, V)
        if k:
            out.append(v[0]); i += len(k); continue
        k, v = _match(s, i, C)
        if k:
            j = i + len(k)
            # anusvara: nasal + different consonant
            if k in NASAL and j < len(s):
                k2, _ = _match(s, j, C)
                if k2 and k2 != k and k2 not in ('y','r','l','v','w','h','L','s','S','sh'):
                    out.append('ಂ'); i = j; continue
            k3, vv = _match(s, j, V)
            if k3:
                # diphthong spellings ay/av at syllable end
                if k3 == 'a' and s[j+1:j+2] in ('y','v') and (j+2 >= len(s) or not re.match(r'[aeiouR]', s[j+2])) and k not in ('y','v'):
                    out.append(v[0] + ('ೈ' if s[j+1]=='y' else 'ೌ')); i = j + 2; continue
                out.append(v[0] + vv[1]); i = j + len(k3)
            else:
                out.append(v[0] + '್'); i = j
            continue
        out.append(ch); i += 1
    r = ''.join(out)
    # word-initial independent vowel + y/v diphthong (e.g. 'avdu')
    return r
def roman_to_kn(text): return ' '.join(to_kn(w) for w in text.split(' '))

# Kannada -> roman (book scheme)
KV = {'ಅ':'a','ಆ':'aa','ಇ':'i','ಈ':'ii','ಉ':'u','ಊ':'uu','ಋ':'ru','ಎ':'e','ಏ':'ee','ಐ':'ai','ಒ':'o','ಓ':'oo','ಔ':'au'}
KM = {'ಾ':'aa','ಿ':'i','ೀ':'ii','ು':'u','ೂ':'uu','ೃ':'ru','ೆ':'e','ೇ':'ee','ೈ':'ai','ೊ':'o','ೋ':'oo','ೌ':'au'}
KC = {'ಕ':'k','ಖ':'kh','ಗ':'g','ಘ':'gh','ಙ':'n','ಚ':'c','ಛ':'ch','ಜ':'j','ಝ':'jh','ಞ':'ñ','ಟ':'T','ಠ':'Th','ಡ':'D','ಢ':'Dh','ಣ':'N',
      'ತ':'t','ಥ':'th','ದ':'d','ಧ':'dh','ನ':'n','ಪ':'p','ಫ':'ph','ಬ':'b','ಭ':'bh','ಮ':'m','ಯ':'y','ರ':'r','ಲ':'l','ವ':'v','ಶ':'sh','ಷ':'Sh','ಸ':'s','ಹ':'h','ಳ':'L'}
NAS = {'k':'n','g':'n','c':'n','j':'n','T':'N','D':'N','t':'n','d':'n','p':'m','b':'m','m':'m'}
def kn_to_roman(text):
    out = []; chars = list(text); i = 0
    while i < len(chars):
        c = chars[i]
        if c in KC:
            out.append(KC[c]); n = chars[i+1] if i+1 < len(chars) else ''
            if n == '್': i += 2; continue
            if n in KM: out.append(KM[n]); i += 2; continue
            out.append('a'); i += 1; continue
        if c in KV: out.append(KV[c]); i += 1; continue
        if c == 'ಂ':
            n = chars[i+1] if i+1 < len(chars) else ''
            out.append(NAS.get(KC.get(n, '')[:1] if n in KC else '', 'm')); i += 1; continue
        if c == 'ಃ': out.append('h'); i += 1; continue
        out.append(c); i += 1
    s = ''.join(out)
    return s
