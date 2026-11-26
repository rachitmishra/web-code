import type { LevelSpec } from "../../schema";

const L = (n: number, spec: Omit<LevelSpec, "number" | "postcardId">): LevelSpec => ({
  number: n,
  postcardId: `kn.pc.${n}`,
  ...spec,
});

export const KN_LEVELS: LevelSpec[] = [
  L(1, {
    title: "Kannada Foundations", titleScript: "ಕನ್ನಡ ಅಡಿಪಾಯ", difficulty: 1, mode: "letters",
    objective: "Recognise all vowels (ಸ್ವರಗಳು) and the two yogavahas by sight and sound.",
    letterKinds: ["vowel", "yogavaha"],
  }),
  L(2, {
    title: "Consonant Foundations", titleScript: "ವ್ಯಂಜನಗಳು", difficulty: 1, mode: "letters",
    objective: "Learn the consonants (ವ್ಯಂಜನಗಳು) group by group, from velars to the retroflex ಳ.",
    letterKinds: ["consonant"],
  }),
  L(3, {
    title: "Writing Kannada", titleScript: "ಕನ್ನಡ ಬರವಣಿಗೆ", difficulty: 1, mode: "writing",
    objective: "Trace and draw letters with the anti-clockwise strokes, then meet the ottaksharas.",
    letterKinds: ["vowel", "consonant", "conjunct"],
  }),
  L(4, {
    title: "First Words", titleScript: "ಮೊದಲ ಪದಗಳು", difficulty: 1, mode: "vocab",
    objective: "Name yourself, the people around you and everyday things (Lessons 1–2).",
    lessons: [1, 2], topics: ["pronouns", "people", "professions", "greetings", "language", "home"],
    situations: ["greetings"], sentenceLevels: [4, 4],
  }),
  L(5, {
    title: "Numbers & Everyday Things", titleScript: "ಸಂಖ್ಯೆ ಮತ್ತು ವಸ್ತುಗಳು", difficulty: 1, mode: "vocab",
    objective: "Count, name colours and food, and point at the things around you.",
    topics: ["numbers", "colors", "food", "home", "clothing"], lessons: [1, 10],
    sentenceLevels: [4, 6],
  }),
  L(6, {
    title: "Everyday Expressions", titleScript: "ದಿನನಿತ್ಯದ ಮಾತು", difficulty: 2, mode: "mixed",
    objective: "Greet, introduce yourself and be polite like a local.",
    topics: ["greetings", "pronouns", "grammar"], lessons: [1, 8],
    situations: ["greetings", "conversations"], sentenceLevels: [4, 6],
  }),
  L(7, {
    title: "People & Places", titleScript: "ಜನರು ಮತ್ತು ಸ್ಥಳಗಳು", difficulty: 2, mode: "vocab",
    objective: "Talk about family, neighbourhoods and where things are (Lessons 3 & 5).",
    topics: ["family", "people", "places", "directions"], lessons: [1, 13],
    situations: ["conversations"], sentenceLevels: [7, 7],
  }),
  L(8, {
    title: "Actions & Verbs", titleScript: "ಕ್ರಿಯಾಪದಗಳು", difficulty: 2, mode: "vocab",
    objective: "Learn the verb roots you'll use every day and the imperative (Lesson 10).",
    topics: ["verbs"], lessons: [8, 16], sentenceLevels: [8, 8],
  }),
  L(9, {
    title: "Building Sentences", titleScript: "ವಾಕ್ಯ ರಚನೆ", difficulty: 2, mode: "sentences",
    objective: "Put words in subject–object–verb order and use ಇದೆ / ಇದ್ದಾರೆ.",
    topics: ["adjectives", "directions", "pronouns"], lessons: [4, 9], sentenceLevels: [4, 9],
  }),
  L(10, {
    title: "Questions & Answers", titleScript: "ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ", difficulty: 2, mode: "mixed",
    objective: "Ask who, what, where, why and how, and answer with ಹೌದು / ಇಲ್ಲ / ಅಲ್ಲ.",
    topics: ["questions", "pronouns", "grammar"], lessons: [1, 12],
    situations: ["conversations"], sentenceLevels: [4, 10],
  }),
  L(11, {
    title: "Food & Shopping", titleScript: "ಊಟ ಮತ್ತು ಖರೀದಿ", difficulty: 3, mode: "mixed",
    objective: "Order at a darshini, bargain at KR Market, and handle quantities and prices (Lesson 6).",
    topics: ["food", "market", "numbers"], lessons: [5, 22],
    situations: ["shopping", "restaurants"], sentenceLevels: [6, 11],
  }),
  L(12, {
    title: "Travel & Transport", titleScript: "ಪ್ರಯಾಣ", difficulty: 3, mode: "mixed",
    objective: "Take autos, buses and trains, and ask the way (Lesson 11).",
    topics: ["transport", "directions", "places"], lessons: [5, 25],
    situations: ["travel"], sentenceLevels: [7, 12],
  }),
  L(13, {
    title: "Daily Conversations", titleScript: "ದೈನಂದಿನ ಸಂಭಾಷಣೆ", difficulty: 3, mode: "mixed",
    objective: "Make small talk, talk about festivals and say what you don't understand (Lessons 12–13).",
    lessons: [12, 13], topics: ["culture", "emotions", "concepts"],
    situations: ["conversations", "greetings"], sentenceLevels: [9, 13],
  }),
  L(14, {
    title: "Time & Activities", titleScript: "ಸಮಯ ಮತ್ತು ದಿನಚರಿ", difficulty: 3, mode: "mixed",
    objective: "Days, dates and routines, and what you did yesterday (Lessons 7, 14, 16).",
    topics: ["time", "days", "body", "verbs"], lessons: [7, 17], sentenceLevels: [12, 14],
  }),
  L(15, {
    title: "Grammar in Context", titleScript: "ವ್ಯಾಕರಣ", difficulty: 4, mode: "sentences",
    objective: "Cases, must and must-not, comparisons and the past negative (Lessons 11–15).",
    topics: ["grammar", "verbs"], lessons: [10, 18], sentenceLevels: [8, 15],
  }),
  L(16, {
    title: "Descriptions & Feelings", titleScript: "ವರ್ಣನೆ ಮತ್ತು ಭಾವನೆ", difficulty: 4, mode: "vocab",
    objective: "Describe people and places and say how you feel.",
    topics: ["adjectives", "emotions", "colors", "nature", "animals"], lessons: [4, 25],
    sentenceLevels: [9, 16],
  }),
  L(17, {
    title: "Real-World Scenarios", titleScript: "ನಿಜಜೀವನದ ಸನ್ನಿವೇಶಗಳು", difficulty: 4, mode: "mixed",
    objective: "Work, health and public life: what you need at the doctor's, the office and the bank (Lessons 14–18).",
    lessons: [14, 18], topics: ["professions", "society", "body", "market"],
    situations: ["restaurants", "shopping", "travel"], sentenceLevels: [11, 17],
  }),
  L(18, {
    title: "Conversational Fluency", titleScript: "ಸಂಭಾಷಣಾ ಪ್ರಾವೀಣ್ಯ", difficulty: 5, mode: "mixed",
    objective: "Heritage, travel plans and the continuous and perfect tenses (Lessons 17–21).",
    lessons: [17, 21], topics: ["culture", "places", "professions", "concepts"],
    situations: ["cultural", "conversations"], sentenceLevels: [14, 18],
  }),
  L(19, {
    title: "Advanced Comprehension", titleScript: "ಪ್ರೌಢ ಗ್ರಹಿಕೆ", difficulty: 5, mode: "mixed",
    objective: "Read about Karnataka and the Kannada language, and decode proverbs (Lessons 22–23).",
    lessons: [22, 23], topics: ["culture", "language", "society", "nature", "concepts"],
    situations: ["cultural"], sentenceLevels: [16, 20],
  }),
  L(20, {
    title: "Kannada Proficiency", titleScript: "ಕನ್ನಡ ಪಾರಂಗತ", difficulty: 5, mode: "review",
    objective: "Review across script, vocabulary and grammar, then take the final assessment (Lessons 24–25).",
    lessons: [1, 25], situations: ["greetings", "travel", "shopping", "restaurants", "conversations", "cultural"],
    sentenceLevels: [4, 20],
  }),
];
