import type { Phrase, PhraseSituation } from "../../schema";

type Row = [script: string, roman: string, meaning: string, context: string, level: number];

const group = (situation: PhraseSituation, rows: Row[]): Phrase[] =>
  rows.map(([script, roman, meaning, context, level], i) => ({
    id: `kn.p.${situation}.${i + 1}`,
    situation,
    script,
    roman,
    meaning,
    context,
    level,
  }));

export const KN_PHRASES: Phrase[] = [
  ...group("greetings", [
    ["ನಮಸ್ಕಾರ", "namaskaara", "Hello / greetings", "Works at any time of day. Pair it with folded hands for elders.", 1],
    ["ಹೇಗಿದ್ದೀರಾ?", "heegiddiiraa?", "How are you? (polite)", "Use with anyone older than you or someone you've just met.", 4],
    ["ಚೆನ್ನಾಗಿದ್ದೀನಿ", "cennaagiddiini", "I'm fine", "The usual reply to ಹೇಗಿದ್ದೀರಾ?", 4],
    ["ನಿಮ್ಮ ಹೆಸರು ಏನು?", "nimma hesaru eenu?", "What is your name?", "Lesson 1 dialogue: ನಿಮ್ಮ is the polite 'your'.", 4],
    ["ನನ್ನ ಹೆಸರು …", "nanna hesaru …", "My name is …", "Add your name at the end. Kannada needs no 'is'.", 4],
    ["ಧನ್ಯವಾದಗಳು", "dhanyavaadagaLu", "Thank you", "Formal. Among friends people often just smile or say 'thanks'.", 6],
    ["ಹೋಗಿ ಬನ್ನಿ", "hoogi banni", "Goodbye (go and come back)", "Said to someone leaving. Kannada avoids a bare 'go'.", 6],
    ["ಮತ್ತೆ ಸಿಗೋಣ", "matte sigooNa", "See you again", "A friendly parting among peers.", 6],
  ]),
  ...group("conversations", [
    ["ನಾನು ಕನ್ನಡ ಕಲೀತಾ ಇದ್ದೀನಿ", "naanu kannaDa kaliitaa iddiini", "I am learning Kannada", "People will slow down and help once you say this.", 6],
    ["ನನಗೆ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಕನ್ನಡ ಬರುತ್ತೆ", "nanage swalpa swalpa kannaDa barutte", "I know a little Kannada", "Literally: 'a little-little Kannada comes to me'.", 6],
    ["ನಿಧಾನವಾಗಿ ಹೇಳಿ", "nidhaanavaagi heeLi", "Please say it slowly", "ಹೇಳಿ is the polite form of ಹೇಳು (to say).", 10],
    ["ಅರ್ಥ ಆಗಲಿಲ್ಲ", "artha aagalilla", "I didn't understand", "From Lesson 12: ಅರ್ಥ ಆಗು (to understand).", 13],
    ["ನಿಮ್ಮ ಊರು ಯಾವುದು?", "nimma uuru yaavudu?", "Where is your hometown?", "A common icebreaker in Karnataka (Lesson 1).", 7],
    ["ಏನು ಸಮಾಚಾರ?", "eenu samaacaara?", "What's the news? / What's up?", "Casual opener between friends.", 13],
    ["ಪರವಾಗಿಲ್ಲ", "paravaagilla", "It's okay / no problem", "Used to reassure someone or accept an apology.", 13],
    ["ಸರಿ", "sari", "Okay / correct", "Everyday agreement word.", 6],
  ]),
  ...group("travel", [
    ["ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", "bas nildaaNa ellide?", "Where is the bus stand?", "ಎಲ್ಲಿ (where) + ಇದೆ (is) merge into ಎಲ್ಲಿದೆ.", 12],
    ["ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಬರ್ತೀರಾ?", "mejesTik-ge bartiiraa?", "Will you come to Majestic?", "How you ask an auto driver to take you somewhere.", 12],
    ["ಮೀಟರ್ ಹಾಕಿ", "miiTar haaki", "Please put the meter on", "Polite but firm with auto drivers.", 12],
    ["ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ", "illee nillisi", "Stop right here, please", "ಇಲ್ಲೇ = right here.", 12],
    ["ಎಷ್ಟು ದೂರ?", "eshTu duura?", "How far is it?", "From Lesson 5 (ಹತ್ತಿರ near / ದೂರ far).", 12],
    ["ಬಲಕ್ಕೆ ತಿರುಗಿ", "balakke tirugi", "Turn right", "Swap in ಎಡಕ್ಕೆ for left.", 12],
  ]),
  ...group("shopping", [
    ["ಇದಕ್ಕೆ ಎಷ್ಟು?", "idakke eshTu?", "How much is this?", "Dative ಇದಕ್ಕೆ = 'for this' (Lesson 6).", 11],
    ["ಒಂದು ಕೆಜಿ ಬದನೆಕಾಯಿಗೆ ಎಷ್ಟು ಬೆಲೆ?", "ondu kejige badanekaayige eshTu bele?", "What's the price of a kilo of brinjals?", "Straight from the Lesson 6 market dialogue.", 11],
    ["ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ", "swalpa kaDime maaDi", "Please reduce it a little", "Bargaining is normal at markets, but not in malls.", 11],
    ["ತುಂಬಾ ಜಾಸ್ತಿ", "tumbaa jaasti", "That's too much", "Say it with a smile.", 11],
    ["ಬೇರೆ ಬಣ್ಣ ಇದೆಯಾ?", "beere baNNa ideyaa?", "Is there another colour?", "Lesson 8 colours + ಇದೆಯಾ (is there?).", 11],
  ]),
  ...group("restaurants", [
    ["ಒಂದು ಕಾಫಿ ಕೊಡಿ", "ondu kaafi koDi", "One coffee, please", "ಕೊಡಿ is the polite 'give'.", 11],
    ["ಮೆನು ಕೊಡಿ", "menu koDi", "Please give me the menu", "In a darshini you usually order at the counter instead.", 11],
    ["ಊಟ ಆಯ್ತಾ?", "uuTa aaytaa?", "Have you eaten?", "A caring greeting at mealtimes, not a literal question.", 13],
    ["ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ", "tumbaa cennaagide", "It's very good", "Compliment the food and you'll make friends.", 11],
    ["ಬಿಲ್ ಕೊಡಿ", "bil koDi", "The bill, please", "English loanwords take Kannada endings easily.", 11],
    ["ಖಾರ ಕಡಿಮೆ ಇರಲಿ", "khaara kaDime irali", "Keep it less spicy", "ಇರಲಿ = 'let it be' (Lesson 10 hortative).", 17],
  ]),
  ...group("cultural", [
    ["ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ", "sirigannaDam gelge", "May glorious Kannada prevail", "A classic rallying line from Kannada literature.", 19],
    ["ಮಳೆ ಬಂದರೆ ಬೆಳೆ", "maLe bandare beLe", "When it rains, crops grow", "Farming proverb using the conditional -ಅರೆ (Lesson 20).", 19],
    ["ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು", "kai kesaraadare baayi mosaru", "If the hand gets muddy, the mouth gets curd", "Hard work brings rewards.", 19],
    ["ಹಬ್ಬದ ಶುಭಾಶಯಗಳು", "habbada shubhaashayagaLu", "Festival greetings", "Said during Ugadi, Dasara, Deepavali.", 13],
    ["ಜೋಗದ ಗುಂಡಿ ನೋಡಲೇಬೇಕು", "joogada guNDi nooDaleebeeku", "You must see Jog Falls", "ನೋಡಲೇಬೇಕು adds strong emphasis to 'must see'.", 18],
  ]),
];
