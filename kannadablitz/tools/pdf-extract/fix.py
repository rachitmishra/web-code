import json, sys, re
exec(open(sys.argv[2]).read())
d = json.load(open(sys.argv[1]))
DROP = {118, 144, 166, 179, 273, 322, 410, 0, 1, 27, 28}
KN = {71:'ಇವಳು ನನ್ನ ಮಗಳು', 180:'ಕಪ್ಪು', 212:'ಕೇಳು', 147:'ಜನ್ಮದಿನ', 153:'ವಾರ್ಷಿಕೋತ್ಸವ', 346:'ಸೂರ್ಯಗ್ರಹಣ', 541:'ಸುಸಂಸ್ಕೃತ',
      586:'ವೈಜ್ಞಾನಿಕ ದೃಷ್ಟಿಕೋನ', 639:'ಜ್ಞಾಪಕ', 200:'ಮಧ್ಯಾಹ್ನ', 68:'ಪಟ್ಟಣ', 382:'ಮಾಡ್ತಾ ಇಲ್ಲ', 384:'ಮಾಡ್ತಾ ಇರಲಿಲ್ಲ', 386:'ಮಾಡ್ತಾ ಇರಲ್ಲ',
      406:'ಮೋಸ', 347:'ಹಾವು', 396:'ಯುದ್ಧ', 265:'ಬುದ್ಧಿವಾದ', 127:'ತರಕಾರಿ', 115:'ಐದು ನೂರ ಹತ್ತು', 113:'ನೂರ ಒಂದು', 244:'ತಿನ್ನುವುದು', 245:'ಮಾಡುವುದು',
      110:'ಸೈಕಲ್', 112:'ಶರ್ಟು', 239:'ಬೈ', 126:'ಟೊಮ್ಯಾಟೊ', 72:'ಈ ಮಗು ನನ್ನದು'}
EN = {9:'hello / greetings', 180:'black', 412:'rare', 471:'acting', 23:'writer (fem.)', 20:'clerk', 320:'hunger', 302:'to interview',
      421:'platform', 435:'title', 442:'circular', 503:'cheetah', 490:'coastal', 479:'wildlife sanctuary', 545:'beneficial', 620:'pedestrians',
      607:'disaster at every moment', 611:'daily disaster', 514:'itinerant', 242:'chrysanthemum', 72:'This child is mine', 71:'She is my daughter',
      5:'he/she (honorific)', 4:'his/her (honorific)', 6:'his/her (this person)', 179:None, 104:'sandals', 57:'residential extension', 163:'Saturday',
      164:'Friday', 153:'annual day', 339:'prize', 241:'beautiful woman', 240:'beautiful', 26:'friend (fem.)', 18:'friend (masc.)', 17:'student (masc.)',
      2:'teacher (masc.)', 3:'teacher (fem.)', 12:'you (polite)', 344:'independence', 448:'stone-carved maidens', 299:'installation', 116:'one thousand and two',
      201:'residence / living', 559:'to undergo', 556:'beginning', 213:'to take away', 214:'bring (it)', 133:'banana', 309:'labourer', 372:'speech',
      64:'actor', 65:'actress', 156:'hour / bell', 140:'three people', 141:'ten people', 142:'hundred people'}
out = []
for i, r in enumerate(d):
    if i in DROP: continue
    kn = KN.get(i, r['kn']); en = EN.get(i, r['en'])
    if not en: continue
    en = re.sub(r'\s*/\s*', ' / ', en).strip(' ;')
    en = en[0].lower() + en[1:] if not re.match(r'^(I|[A-Z][a-z]+day|Nandi|A\.D)', en) else en
    if 'Õ' in kn or 'ø' in kn or re.search(r'[A-Za-z]', kn): print('BAD', i, kn); continue
    out.append({'lesson': r['lesson'], 'kn': kn, 'tr': kn_to_roman(kn), 'en': en})
json.dump(out, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
print(len(out))
