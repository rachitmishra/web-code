import json, re, sys
exec(open(sys.argv[1]).read())  # translit
pdf = json.load(open(sys.argv[2])); ex = json.load(open(sys.argv[3]))
# Core supplement (authored; standard Bangalore-Mysore Kannada)
SUP = [
 ('ಒಂದು','one',5,'numbers'),('ಎರಡು','two',5,'numbers'),('ಮೂರು','three',5,'numbers'),('ನಾಲ್ಕು','four',5,'numbers'),('ಐದು','five',5,'numbers'),
 ('ಆರು','six',5,'numbers'),('ಏಳು','seven',5,'numbers'),('ಎಂಟು','eight',5,'numbers'),('ಒಂಬತ್ತು','nine',5,'numbers'),('ಹತ್ತು','ten',5,'numbers'),
 ('ಇಪ್ಪತ್ತು','twenty',6,'numbers'),('ಐವತ್ತು','fifty',6,'numbers'),('ನೂರು','hundred',6,'numbers'),('ಸಾವಿರ','thousand',6,'numbers'),('ಅರ್ಧ','half',6,'numbers'),
 ('ಅನ್ನ','cooked rice',6,'food'),('ಇಡ್ಲಿ','idli',6,'food'),('ಸಾರು','rasam / thin curry',6,'food'),('ಮೊಸರು','curd',6,'food'),('ಉಪ್ಪು','salt',6,'food'),
 ('ತುಪ್ಪ','ghee',6,'food'),('ಚಹಾ','tea',6,'food'),('ತಿಂಡಿ','snack / tiffin',6,'food'),('ಹಣ್ಣು','fruit',6,'food'),('ಮಾವಿನಹಣ್ಣು','mango',6,'food'),
 ('ಈರುಳ್ಳಿ','onion',6,'food'),('ಆಲೂಗಡ್ಡೆ','potato',6,'food'),('ಸಕ್ಕರೆ','sugar',6,'food'),('ಹಾಲು','milk',8,'food'),
 ('ಆಟೋ','auto-rickshaw',11,'transport'),('ಬಸ್ ನಿಲ್ದಾಣ','bus stand',11,'transport'),('ಟಿಕೆಟ್','ticket',11,'transport'),('ರಸ್ತೆ','road',11,'places'),
 ('ವಿಮಾನ','aeroplane',11,'transport'),('ಕಾರು','car',11,'transport'),('ಎಡಕ್ಕೆ','to the left',11,'directions'),('ಬಲಕ್ಕೆ','to the right',11,'directions'),
 ('ನೇರವಾಗಿ','straight ahead',11,'directions'),('ನಿಲ್ಲಿಸಿ','please stop',11,'transport'),
 ('ನಿನ್ನೆ','yesterday',7,'time'),('ಬೆಳಿಗ್ಗೆ','morning',7,'time'),('ವಾರ','week',7,'time'),('ತಿಂಗಳು','month',7,'time'),('ವರ್ಷ','year',7,'time'),
 ('ಸಂತೋಷ','happiness',16,'emotions'),('ದುಃಖ','sorrow',16,'emotions'),('ಕೋಪ','anger',16,'emotions'),('ಪ್ರೀತಿ','love',16,'emotions'),('ಆಸೆ','desire / wish',16,'emotions'),
 ('ಚೆನ್ನಾಗಿ','well / nicely',16,'adjectives'),('ಬಿಸಿ','hot',16,'adjectives'),('ತಣ್ಣಗೆ','cold',16,'adjectives'),('ಉದ್ದ','long',16,'adjectives'),('ಗಿಡ್ಡ','short',16,'adjectives'),
 ('ತಾಯಿ','mother',3,'family'),('ತಂದೆ','father',3,'family'),('ಅಜ್ಜ','grandfather',3,'family'),('ಅಜ್ಜಿ','grandmother',3,'family'),('ಗಂಡ','husband',3,'family'),
 ('ಹುಡುಗ','boy',2,'people'),('ಮಗು','child',3,'family'),('ಊರು','town / native place',1,'places'),('ಇದು','this',2,'pronouns'),('ಅದು','that',2,'pronouns'),
 ('ಅವನು','he',2,'pronouns'),('ಅವಳು','she',2,'pronouns'),('ನೀನು','you (informal)',2,'pronouns'),('ನಾವು','we',2,'pronouns'),('ಅಲ್ಲ','no / is not',2,'greetings'),
 ('ಇಲ್ಲ','no / there is not',5,'greetings'),('ಧನ್ಯವಾದಗಳು','thank you',1,'greetings'),('ಬನ್ನಿ','please come',10,'verbs'),('ಕೊಡಿ','please give',10,'verbs'),
 ('ನೋಡು','to see',10,'verbs'),('ಮಾಡು','to do',10,'verbs'),('ಬರೆ','to write',10,'verbs'),('ಮಲಗು','to sleep',10,'verbs'),('ಕೂರು','to sit',10,'verbs'),('ಏಳು ','to get up',10,'verbs'),
 ('ಬೇಕು','want / need',8,'verbs'),('ಆನೆ','elephant',5,'animals'),('ಹುಲಿ','tiger',14,'animals'),('ಹಸು','cow',12,'animals'),('ಮರ','tree',7,'nature'),('ಸೂರ್ಯ','sun',14,'nature'),
 ('ಚಂದ್ರ','moon',14,'nature'),('ಹೂವು','flower',11,'nature'),('ದೀಪ','oil lamp',13,'culture'),('ದೋಸೆ','dosa',6,'food'),('ಕಾಫಿ','coffee',6,'food'),('ತೆಂಗಿನಕಾಯಿ','coconut',6,'food'),
 ('ಬಸ್ಸು','bus',11,'transport'),('ರೈಲು','train',11,'transport'),('ಅಂಗಡಿ','shop',6,'market'),('ಕೆಜಿ','kilogram',6,'market'),('ರೂಪಾಯಿ','rupee',6,'market'),
 ('ಬಿಳಿ','white',8,'colors'),('ಕಿತ್ತಳೆ','orange (colour / fruit)',8,'colors'),
]
TOPIC_RULES = [
 ('grammar', r'^(let |not |was |will |i |you |he |she |this |that is|doing|eating|do not|not enough)'),
 ('people', r'^(friend|girl|boy|man|woman|person|people|strangers|citizens|some one)'),
 ('numbers', r'^(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|twenty|fifty|half|lakh|four annas)\b|hundred and|thousand two|number'),
 ('colors', r'\b(white|black|red|green|yellow|blue|colour|color)\b'),
 ('days', r'(monday|tuesday|wednesday|thursday|friday|saturday|sunday)'),
 ('time', r'\b(today|tomorrow|yesterday|date|minute|hour|night|evening|afternoon|morning|week|month|year|now|time|late|early|holiday|birthday|sometime|now and then|once in a while|period|daily|again)\b'),
 ('family', r'\b(sister|brother|son|daughter|wife|husband|children|mother|father|grand|child|family|in - law|sons)\b'),
 ('pronouns', r'^(i|you|he|she|it|we|they|his|her|its|my|your|this|that|he/she|his/her)\b'),
 ('questions', r'^(what|who|which|where|why|how|what type)'),
 ('professions', r'(teacher|student|clerk|doctor|businessman|writer|actor|actress|editor|servant|labourer|officer|patient|potter|cobbler|blacksmith|tailor|carpenter|washerman|sculptor|scholar|journalist|peasant|musician|king|governor|minister|sage|guest|thie|agitator|reformer|leader|commander|riders|citizens|pedestrian|people|person|men|murderer|strangers|demon)'),
 ('food', r'(rice|coffee|tea|tiffin|egg|tomato|vegetable|brinjal|plantain|banana|cucumber|beans|coriander|pickle|meals|milk|sweets|fruit|sugar|water|ragi|cardamom|gram|cashew|jowar|paddy|salt|eat|drink|sugarcane|curd|idli|dosa|mango|onion|potato|ghee|cotton)'),
 ('market', r'(price|cost|how much|bundle|less|fresh|things|rent|money|loan|interest|pay|shop|kilogram|rupee|fare|wealth|share|commercial|valuable|factory|industry|mill|unit)'),
 ('home', r'(house|room|window|mirror|box|wall|table|cot|watch|clock|match box|palace|home|frame)'),
 ('clothing', r'(saree|shirt|cloth|chappal|sandals|skirt|put on clothes)'),
 ('body', r'(leg|hand|head|face|teeth|stomach|wound|cough|bite|ache|madness|ill health|medicine|hunger)'),
 ('animals', r'(dog|cat|elephant|calf|cow|bull|bullock|snake|donkey|goat|bison|deer|cheetah|tiger)'),
 ('nature', r'(tree|forest|grass|flower|rose|crysanth|chrysanth|river|rain|sand|field|plant|crop|garden|sun|moon|eclipse|weather|natural|mineral|iron|ore|hill|teak|confluence|environment|coconut)'),
 ('directions', r'(front|behind|right|left|above|below|inside|outside|near|far|middle|straight|route|way|path|street|centre)'),
 ('places', r'(city|cities|district|country|state|place|extension|college|mines|village|temple|harbour|dam|university|secretariat|sanctuary|station|road|town|kingdom|legislative)'),
 ('transport', r'(bus|train|car|cycle|auto|journey|tour|ticket|aeroplane|stop)'),
 ('emotions', r'(happ|sorrow|anger|love|fear|boredom|confidence|desire|enjoy|doubt|trouble|suffer|discourage|pride|dignity|patience|horrif|beauty)'),
 ('culture', r'(festival|celebration|procession|elephant parade|illumination|worship|god|music|concert|dance|statue|art|carving|idol|architecture|golden age|tradition|penance|award|title|gift|lamp|mythological|literature|literary|caste|religio|charity|saint|culture)'),
 ('language', r'(language|tongue|kannada|dialect|grammar|sentence|translation|speech|book|novel|paper|letter|essay|dictionary|vocabulary|sound|symbol|inscription|writing|read|speak|say|learn|teach|periodicals|media|memory|meaning|name|word)'),
 ('society', r'(government|law|party|independence|suicide|crime|bribe|lie|cheating|stabbing|loot|robbery|protest|punishment|attack|invade|battle|duty|incident|problem|situation|public|local|responsibility|hoodlum|lawless|threaten|escape|detection|innocent|disaster|quarrel|noise|company|companionship|exhibition|inauguration|entertainment|arrangement|sports)'),
 ('adjectives', r'^(good|bad|small|big|old|new|tall|beautiful|easy|simple|fat|dense|superior|fit|rare|plenty|recent|peculiar|capable|fundamental|mature|natural|primary|childish|well|hot|cold|long|short|own|a little|enough|fine|world famous|cultured|tolerant|congenial|beneficial|in plenty|acceptable|unfortunate|un protected|coastal|valuable|well equipped|immortal|leisurely|happily|splendidly|bitterly|in detail|in brief|constantly|dark blue|light blue)'),
 ('greetings', r'(greeting|hello|thank|^yes|^no\b|please)'),
]
def topic_of(en, kn):
    e = en.lower()
    if e.startswith('to ') and not re.search(r'to the (left|right)', e): return 'verbs'
    for t, rx in TOPIC_RULES:
        if re.search(rx, e): return t
    return 'concepts'
def pos_of(en, kn, topic):
    e = en.lower()
    if topic == 'verbs' or e.startswith('to ') or e.startswith('please '): return 'verb'
    if topic == 'numbers': return 'number'
    if topic in ('pronouns',): return 'pronoun'
    if topic == 'questions': return 'adverb' if e.split()[0] in ('where','why','how') else 'pronoun'
    if topic == 'adjectives' or topic == 'colors': return 'adjective'
    if len(kn.split()) >= 2 and re.search(r'(ಲಿ|ಗೆ|ಲ್ಲ|ಇಲ್ಲ|ಬೇಕು|ತೀನಿ|ತಾ|ಹೋಗು|ಬಾ)$', kn): return 'phrase'
    if e.startswith(('i ', 'you ', 'he ', 'she ', 'let ', 'this ', 'that ', 'not ', 'was ', 'will ')): return 'phrase'
    return 'noun'
ART = {'ಕಾಫಿ':'kaafi','ದೋಸೆ':'doose','ಆನೆ':'aane','ಹುಲಿ':'huli','ಹಸು':'hasu','ಹೂವು':'huuvu','ಹೂ':'huuvu','ಮರ':'mara','ಸೂರ್ಯ':'suurya','ಮಳೆ':'maLe',
       'ಬದನೆಕಾಯಿ':'badanekaayi','ಪುಸ್ತಕ':'pustaka','ಮನೆ':'mane','ಅರಮನೆ':'aramane','ರೈಲು':'railu','ಬಸ್ಸು':'bassu','ದೇವಸ್ಥಾನ':'deevasthaana','ಬೆಕ್ಕು':'bekku',
       'ಬಾಳೆ ಹಣ್ಣು':'baaLehaNNu','ಬಾಳೆಹಣ್ಣು':'baaLehaNNu','ತೆಂಗಿನಕಾಯಿ':'tenginakaayi','ದೀಪ':'deepa','ಹಣ್ಣು':'seebu','ಕಾದಂಬರಿ':'pustaka','ಗ್ರಂಥ':'pustaka','ಸೀಮೆ ಹಸು':'hasu','ಕರು':'hasu','ತೆಂಗಿನ ಮರ':'mara'}
ex_by_kn = {v['native_script']: v for v in ex['vocab']}
entries = []; seen = set()
def add(kn, en, lesson, src, topic=None):
    kn = kn.strip()
    if kn in seen: return
    seen.add(kn)
    t = topic or topic_of(en, kn)
    entries.append({'kn': kn, 'en': en, 'lesson': lesson, 'src': src, 'topic': t})
for r in pdf: add(r['kn'], r['en'], r['lesson'], 'halemane')
for kn, en, lvl, t in SUP: add(kn, en, lvl, 'core', t)
for v in ex['vocab']: add(v['native_script'], v['meaning'].lower(), max(1, v['levelHint']), 'core')
out = []
used = set()
for i, e in enumerate(entries):
    tr = kn_to_roman(e['kn'])
    base = re.sub(r'[^a-z0-9]', '', tr.lower().replace('ñ','n'))[:24] or f'w{i}'
    vid = f'kn.{base}'; k = 2
    while vid in used: vid = f'kn.{base}{k}'; k += 1
    used.add(vid)
    exv = ex_by_kn.get(e['kn'])
    item = {'id': vid, 'script': e['kn'], 'roman': tr, 'meaning': e['en'], 'pos': pos_of(e['en'], e['kn'], e['topic']),
            'topic': e['topic'], 'lesson': e['lesson'], 'source': e['src']}
    if e['kn'] in ART: item['art'] = ART[e['kn']]
    if exv and exv.get('example_sentence'):
        es = exv['example_sentence']; item['example'] = {'script': es['native_script'], 'meaning': es['meaning']}
    out.append(item)
json.dump(out, open(sys.argv[4], 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(len(out)); print(Counter(o['topic'] for o in out).most_common()); print(Counter(o['pos'] for o in out))
print([ (o['script'],o['meaning']) for o in out if o['topic']=='concepts'][:80])
