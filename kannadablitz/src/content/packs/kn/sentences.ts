import type { Sentence } from "../../schema";

type Row = [script: string, roman: string, meaning: string, level: number, note?: string];

// Sentences from the Halemane dialogues (Lessons 1–21) plus everyday Bengaluru usage.
// Tokens are split on spaces, so word order is the thing being taught.
const ROWS: Row[] = [
  // Lessons 1–2: zero copula, pronouns, possessives
  ["ನಾನು ಕನ್ನಡ ವಿದ್ಯಾರ್ಥಿ", "naanu kannaDa vidyaarthi", "I am a Kannada student", 4, "No 'am' needed: noun + noun is a full sentence."],
  ["ನಿಮ್ಮ ಹೆಸರು ಏನು", "nimma hesaru eenu", "What is your name?", 4, "Question words go at the end."],
  ["ನನ್ನ ಹೆಸರು ಮಹಾದೇವ", "nanna hesaru mahaadeeva", "My name is Mahadeva", 4],
  ["ನಾನು ಕನ್ನಡ ಅಧ್ಯಾಪಕ", "naanu kannaDa adhyaapaka", "I am a Kannada teacher", 4],
  ["ಇದು ನನ್ನ ಮನೆ", "idu nanna mane", "This is my house", 4],
  ["ಅದು ಯಾವ ಪುಸ್ತಕ", "adu yaava pustaka", "Which book is that?", 4],
  ["ಇವರು ನನ್ನ ಸ್ನೇಹಿತ", "ivaru nanna sneehita", "This is my friend", 6, "ಇವರು is the respectful 'this person'."],
  ["ನಿಮ್ಮ ಊರು ಯಾವುದು", "nimma uuru yaavudu", "Which is your hometown?", 7],
  ["ನನ್ನ ಊರು ಮೈಸೂರು", "nanna uuru maisuuru", "My hometown is Mysuru", 7],
  ["ಅವನು ನನ್ನ ತಮ್ಮ", "avanu nanna tamma", "He is my younger brother", 7],
  ["ಅವಳು ನನ್ನ ಅಕ್ಕ", "avaLu nanna akka", "She is my elder sister", 7],
  ["ಆ ಹುಡುಗ ನಿಮ್ಮ ಮಗನಾ", "aa huDuga nimma maganaa", "Is that boy your son?", 10, "Add -ಆ to make a yes/no question."],
  ["ಹೌದು ಅವನು ನನ್ನ ಮಗ", "havdu avanu nanna maga", "Yes, he is my son", 10],
  // Lessons 4–5: adjectives, location
  ["ನಿಮ್ಮ ಮನೆ ಎಲ್ಲಿ ಇದೆ", "nimma mane elli ide", "Where is your house?", 7, "ಇದೆ means 'is (located)'."],
  ["ಮನೆ ಜಯನಗರದಲ್ಲಿ ಇದೆ", "mane jayanagaradalli ide", "The house is in Jayanagar", 7, "Locative -ಅಲ್ಲಿ = 'in'."],
  ["ಇದು ಹೊಸ ಮನೆ", "idu hosa mane", "This is a new house", 9],
  ["ಅದು ದೊಡ್ಡ ಅರಮನೆ", "adu doDDa aramane", "That is a big palace", 9],
  ["ಬನಶಂಕರಿ ಹತ್ತಿರ ಇದೆ", "banashankari hattira ide", "Banashankari is nearby", 12],
  ["ರಾಜಾಜಿನಗರ ತುಂಬಾ ದೂರ", "raajaajinagara tumbaa duura", "Rajajinagar is very far", 12],
  ["ಪುಸ್ತಕ ಮೇಜಿನ ಮೇಲೆ ಇದೆ", "pustaka meejina meele ide", "The book is on the table", 7, "Postposition ಮೇಲೆ comes after the noun."],
  ["ಮನೆಯ ಮುಂದೆ ತೆಂಗಿನ ಮರ ಇದೆ", "maneya munde tengina mara ide", "There is a coconut tree in front of the house", 9],
  // Lesson 6: dative, numbers, market
  ["ನನಗೆ ಒಂದು ಕಾಫಿ ಬೇಕು", "nanage ondu kaafi beeku", "I want one coffee", 6, "Dative ನನಗೆ ('to me') + ಬೇಕು ('is needed')."],
  ["ಒಂದು ಕೆಜಿ ಬದನೆಕಾಯಿಗೆ ಎಷ್ಟು", "ondu keji badanekaayige eshTu", "How much for a kilo of brinjals?", 11],
  ["ಒಂದು ಕೆಜಿಗೆ ಎಂಟು ರೂಪಾಯಿ", "ondu kejige enTu ruupaayi", "Eight rupees per kilo", 11],
  ["ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಬೆಲೆ ಜಾಸ್ತಿ", "nimma angaDiyalli bele jaasti", "Prices are high in your shop", 11],
  ["ಈಗ ಹಬ್ಬದ ಸೀಸನ್", "iiga habbada siisan", "It is festival season now", 11],
  ["ಎರಡು ಕಂತೆ ಕೊತ್ತುಂಬರಿ ಸೊಪ್ಪು ಕೊಡಿ", "eraDu kante kottumbari soppu koDi", "Give me two bunches of coriander", 11],
  // Lessons 7–8: numerals, colours, modals
  ["ಇವತ್ತು ಮಂಗಳವಾರ", "ivattu mangaLavaara", "Today is Tuesday", 14],
  ["ನಾಳೆ ರಜ", "naaLe raja", "Tomorrow is a holiday", 14],
  ["ಈಗ ಹತ್ತು ಗಂಟೆ", "iiga hattu gaNTe", "It is ten o'clock now", 14],
  ["ನನಗೆ ಕೆಂಪು ಬಣ್ಣ ಇಷ್ಟ", "nanage kempu baNNa ishTa", "I like the colour red", 16, "ಇಷ್ಟ also takes the dative subject."],
  ["ನನಗೆ ಕನ್ನಡ ಗೊತ್ತು", "nanage kannaDa gottu", "I know Kannada", 15],
  ["ನನಗೆ ಸಕ್ಕರೆ ಬೇಡ", "nanage sakkare beeDa", "I don't want sugar", 11],
  ["ಅವನಿಗೆ ಹಾಲು ಸಾಕು", "avanige haalu saaku", "Milk is enough for him", 15],
  // Lessons 9–10: iru, imperative, present-future
  ["ಅವರು ಮನೆಯಲ್ಲಿ ಇದ್ದಾರೆ", "avaru maneyalli iddaare", "They are at home", 9, "ಇರು (to be) agrees with the subject: ಇದ್ದಾರೆ."],
  ["ನಾನು ಕಾಫಿ ಕುಡೀತೀನಿ", "naanu kaafi kuDiitiini", "I drink coffee", 8, "Verb comes last: subject–object–verb."],
  ["ಅವಳು ಪುಸ್ತಕ ಓದ್ತಾಳೆ", "avaLu pustaka oodtaaLe", "She reads a book", 8],
  ["ನಾವು ಬಸ್ಸಿನಲ್ಲಿ ಹೋಗ್ತೀವಿ", "naavu bassinalli hoogtiivi", "We go by bus", 12],
  ["ನೀನು ಇಲ್ಲಿ ಬಾ", "niinu illi baa", "You come here", 8],
  ["ದಯವಿಟ್ಟು ಒಳಗೆ ಬನ್ನಿ", "dayaviTTu oLage banni", "Please come inside", 10],
  ["ನಾವು ನಂದಿ ಬೆಟ್ಟಕ್ಕೆ ಹೋಗೋಣ", "naavu nandi beTTakke hoogooNa", "Let's go to Nandi Hills", 12, "-ಓಣ makes 'let's'."],
  ["ಅವನು ನಾಳೆ ಬರಲಿ", "avanu naaLe barali", "Let him come tomorrow", 15],
  // Lessons 11–13: comparison, gerund, causative
  ["ಮೈಸೂರು ಬೆಂಗಳೂರಿಗಿಂತ ಚಿಕ್ಕದು", "maisuuru bengaLuuriginta cikkadu", "Mysuru is smaller than Bengaluru", 15, "Comparative -ಇಂತ = 'than'."],
  ["ರೈಲು ಬಸ್ಸಿಗಿಂತ ಬೇಗ ಹೋಗುತ್ತೆ", "railu bassiginta beega hoogutte", "The train goes faster than the bus", 12],
  ["ಇಲ್ಲಿ ಧೂಮಪಾನ ಮಾಡಬಾರದು", "illi dhuumapaana maaDabaaradu", "You must not smoke here", 15, "-ಬಾರದು = must not."],
  ["ನೀವು ಬೇಗ ಬರಬೇಕು", "niivu beega barabeeku", "You must come early", 15, "-ಬೇಕು after a verb = must."],
  ["ಕನ್ನಡ ಮಾತಾಡೋದು ಸುಲಭ", "kannaDa maataaDoodu sulabha", "Speaking Kannada is easy", 15, "Gerund -ಓದು turns a verb into a noun."],
  ["ಅವರು ಕನ್ನಡ ಕಲಿಸುತ್ತಾರೆ", "avaru kannaDa kalisuttaare", "They teach Kannada", 15, "-ಇಸು makes a causative: ಕಲಿ → ಕಲಿಸು."],
  ["ದಸರಾ ನಮ್ಮ ನಾಡಹಬ್ಬ", "dasaraa namma naaDahabba", "Dasara is our state festival", 13],
  // Lessons 14–16: past tense
  ["ನಾನು ನಿನ್ನೆ ಮೈಸೂರಿಗೆ ಹೋದೆ", "naanu ninne maisuurige hoode", "I went to Mysuru yesterday", 14],
  ["ಅವಳು ಊಟ ಮಾಡಿದಳು", "avaLu uuTa maaDidaLu", "She had her meal", 14],
  ["ನಾವು ಅರಮನೆ ನೋಡಿದೆವು", "naavu aramane nooDidevu", "We saw the palace", 14],
  ["ಅವನು ಬೆಳಿಗ್ಗೆ ಸ್ನಾನ ಮಾಡಿದ", "avanu beLigge snaana maaDida", "He bathed in the morning", 14],
  ["ನಾನು ಆ ಪುಸ್ತಕ ಓದಲಿಲ್ಲ", "naanu aa pustaka oodalilla", "I did not read that book", 15, "Past negative: -ಅಲಿಲ್ಲ."],
  ["ನಿನ್ನೆ ತುಂಬಾ ಮಳೆ ಬಂತು", "ninne tumbaa maLe bantu", "It rained a lot yesterday", 16],
  // Lessons 17–18: continuous, perfect
  ["ಮಕ್ಕಳು ಆಟ ಆಡ್ತಾ ಇದ್ದಾರೆ", "makkaLu aaTa aaDtaa iddaare", "The children are playing", 17, "Continuous: verb-ತಾ + ಇರು."],
  ["ನಾನು ಕೆಲಸ ಮಾಡ್ತಾ ಇದ್ದೆ", "naanu kelasa maaDtaa idde", "I was working", 17],
  ["ಅವರು ಬೆಂಗಳೂರಿಗೆ ಬಂದಿದ್ದಾರೆ", "avaru bengaLuurige bandiddaare", "They have come to Bengaluru", 18, "Perfect: past participle + ಇರು."],
  ["ನಾನು ಹಂಪಿ ನೋಡಿದ್ದೀನಿ", "naanu hampi nooDiddiini", "I have seen Hampi", 18],
  // Lessons 19–21: relative participle, conditionals
  ["ನಾನು ಓದಿದ ಪುಸ್ತಕ ಇದು", "naanu oodida pustaka idu", "This is the book I read", 18, "Relative participle ಓದಿದ = 'that (I) read'."],
  ["ಕನ್ನಡ ಕಲಿಸುವ ಅಧ್ಯಾಪಕರು ಬಂದರು", "kannaDa kalisuva adhyaapakaru bandaru", "The teacher who teaches Kannada came", 19],
  ["ಬೇಲೂರು ದೇವಸ್ಥಾನ ಜಗತ್ಪ್ರಸಿದ್ಧ", "beeluuru deevasthaana jagatprasiddha", "The Belur temple is world famous", 19],
  ["ಮಳೆ ಬಂದರೆ ನಾನು ಬರಲ್ಲ", "maLe bandare naanu baralla", "If it rains I won't come", 20, "Conditional -ಅರೆ = 'if'."],
  ["ನೀವು ಬಂದರೆ ನಾವು ಹೋಗೋಣ", "niivu bandare naavu hoogooNa", "If you come, let's go", 20],
  ["ಸಮಯ ಇದ್ದಿದ್ದರೆ ನಾನು ಬರುತ್ತಿದ್ದೆ", "samaya iddiddare naanu baruttidde", "If I had had time I would have come", 20, "Unfulfilled conditional (Lesson 21)."],
  ["ಕರ್ನಾಟಕದಲ್ಲಿ ಅನೇಕ ನದಿಗಳು ಇವೆ", "karnaaTakadalli aneeka nadigaLu ive", "There are many rivers in Karnataka", 19],
  ["ಕನ್ನಡಕ್ಕೆ ಎರಡು ಸಾವಿರ ವರ್ಷಗಳ ಇತಿಹಾಸ ಇದೆ", "kannaDakke eraDu saavira varShagaLa itihaasa ide", "Kannada has a two-thousand-year history", 20],
];

export const KN_SENTENCES: Sentence[] = ROWS.map(([script, roman, meaning, level, note], i) => ({
  id: `kn.s.${String(i + 1).padStart(3, "0")}`,
  tokens: script.split(" "),
  roman,
  meaning,
  level,
  note,
}));
