import type { MascotSpec } from "../../schema";
import chinnuHappy from "./mascot/chinnu-happy.jpg";
import chinnuExcited from "./mascot/chinnu-excited.jpg";
import chinnuThinking from "./mascot/chinnu-thinking.jpg";
import chinnuEncouraging from "./mascot/chinnu-encouraging.jpg";

/**
 * Chinnu (ಚಿನ್ನು) — a cheerful Mysuru elephant calf companion.
 * The Indian Elephant is Karnataka's state animal, and "Chinnu" is an affectionate
 * everyday Kannada nickname ("little gold / sweetheart").
 * Structured so future Live Chat can reuse the exact same persona, moods & starters.
 */
export const KN_MASCOT: MascotSpec = {
  name: "Chinnu",
  nameScript: "ಚಿನ್ನು",
  role: "Your Mysuru study buddy",
  avatars: {
    happy: chinnuHappy,
    excited: chinnuExcited,
    proud: chinnuExcited,
    thinking: chinnuThinking,
    curious: chinnuThinking,
    encouraging: chinnuEncouraging,
    sleepy: chinnuEncouraging,
  },
  lines: [
    {
      id: "kn.m.morning.1",
      context: "morning",
      mood: "happy",
      script: "ಶುಭೋದಯ! ಒಂದು ಕಪ್ ಕಾಫಿ ಮತ್ತು ಕನ್ನಡ?",
      roman: "shubhoodaya! ondu kap kaafi mattu kannaDa?",
      meaning: "Good morning! A cup of filter coffee and some Kannada?",
    },
    {
      id: "kn.m.morning.2",
      context: "morning",
      mood: "excited",
      script: "ನಮಸ್ಕಾರ! ಇವತ್ತು ಹೊಸ ಪದ ಕಲಿಯೋಣ!",
      roman: "namaskaara! ivattu hosa pada kaliyooNa!",
      meaning: "Hello! Let's learn a new word today!",
    },
    {
      id: "kn.m.afternoon.1",
      context: "afternoon",
      mood: "curious",
      script: "ನಮಸ್ಕಾರ! ಊಟ ಆಯ್ತಾ? ಸ್ವಲ್ಪ ಅಭ್ಯಾಸ ಮಾಡೋಣ!",
      roman: "namaskaara! uuTa aaytaa? svalpa abhyaasa maaDooNa!",
      meaning: "Hello! Had lunch? Let's practice a little!",
    },
    {
      id: "kn.m.afternoon.2",
      context: "afternoon",
      mood: "happy",
      script: "ಹೇಗಿದ್ದೀರಾ? ಐದು ನಿಮಿಷ ಕನ್ನಡ ಆಟ ಆಡೋಣವಾ?",
      roman: "heegiddiiraa? aidu nimisha kannaDa aaTa aaDooNavaa?",
      meaning: "How are you? Shall we play a 5-minute Kannada game?",
    },
    {
      id: "kn.m.evening.1",
      context: "evening",
      mood: "happy",
      script: "ಶುಭ ಸಂಜೆ! ಇವತ್ತಿನ ಪಾಠ ಶುರು ಮಾಡೋಣವಾ?",
      roman: "shubha sanje! ivattina paaTha shuru maaDooNavaa?",
      meaning: "Good evening! Shall we start today's lesson?",
    },
    {
      id: "kn.m.evening.2",
      context: "evening",
      mood: "sleepy",
      script: "ರಾತ್ರಿ ಮುಂಚೆ ಒಂದು ಚಿಕ್ಕ ಪಾಠ ಸಾಕು!",
      roman: "raatri munce ondu cikka paaTha saaku!",
      meaning: "Just one quick lesson before bedtime!",
    },
    {
      id: "kn.m.streak.1",
      context: "streak",
      mood: "proud",
      script: "ಸೂಪರ್! ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಸಕ್ಕತ್ತಾಗಿದೆ!",
      roman: "suupar! nimma sTriik sakkattaagide!",
      meaning: "Super! Your streak is awesome!",
    },
    {
      id: "kn.m.goal.1",
      context: "goal_done",
      mood: "excited",
      script: "ಭಲೇ! ಇವತ್ತಿನ ಗುರಿ ಮುಗೀತು!",
      roman: "bhalee! ivattina guri mugiitu!",
      meaning: "Bravo! Today's goal is complete!",
    },
    {
      id: "kn.m.correct.1",
      context: "correct",
      mood: "excited",
      script: "ಸಕ್ಕತ್ತಾಗಿದೆ! ಸರಿಯಾದ ಉತ್ತರ!",
      roman: "sakkattaagide! sariyaada uttara!",
      meaning: "Awesome! Spot-on answer!",
    },
    {
      id: "kn.m.correct.2",
      context: "correct",
      mood: "proud",
      script: "ಭಲೇ! ತುಂಬಾ ಚೆನ್ನಾಗಿ ಓದಿದ್ರಿ!",
      roman: "bhalee! tumbaa cennaagi oodidri!",
      meaning: "Bravo! You read that really well!",
    },
    {
      id: "kn.m.wrong.1",
      context: "wrong",
      mood: "encouraging",
      script: "ಪರವಾಗಿಲ್ಲ! ಮತ್ತೆ ಪ್ರಯತ್ನಿಸೋಣ.",
      roman: "paravaagilla! matte prayatnisooNa.",
      meaning: "No worries! Let's try again.",
    },
    {
      id: "kn.m.wrong.2",
      context: "wrong",
      mood: "thinking",
      script: "ತಪ್ಪಿನಿಂದಲೇ ಕಲಿಯೋದು! ಮುಂದೆ ಹೋಗೋಣ.",
      roman: "tappinindalee kaliyoodu! munde hoogooNa.",
      meaning: "We learn from mistakes! Let's keep going.",
    },
    {
      id: "kn.m.idle.1",
      context: "idle",
      mood: "curious",
      script: "ಏನ್ ಸಮಾಚಾರ? ಇವತ್ತು ಏನು ಕಲಿಯೋಣ?",
      roman: "een samaacaara? ivattu eenu kaliyooNa?",
      meaning: "What's the news? What shall we learn today?",
    },
    {
      id: "kn.m.chat.1",
      context: "chat_preview",
      mood: "excited",
      script: "ನನ್ನ ಜೊತೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತಾಡೋಣವಾ?",
      roman: "nanna jote kannaDadalli maataaDooNavaa?",
      meaning: "Want to chat with me in Kannada? Live chat is coming soon!",
    },
  ],
  chatStarters: [
    {
      script: "ನಮಸ್ಕಾರ ಚಿನ್ನು! ಹೇಗಿದ್ದೀಯಾ?",
      roman: "namaskaara cinnu! heegiddiiyaa?",
      meaning: "Hi Chinnu! How are you?",
    },
    {
      script: "ಒಂದು ಫಿಲ್ಟರ್ ಕಾಫಿ ಆರ್ಡರ್ ಮಾಡೋದು ಹೇಗೆ?",
      roman: "ondu filTar kaafi aarDar maaDoodu heege?",
      meaning: "How do I order a filter coffee?",
    },
    {
      script: "ಬೆಂಗಳೂರು ಆಟೋದಲ್ಲಿ ಮಾತಾಡೋಣ!",
      roman: "bengaLuuru aaToodalli maataaDooNa!",
      meaning: "Let's practice talking in a Bengaluru auto!",
    },
  ],
};
