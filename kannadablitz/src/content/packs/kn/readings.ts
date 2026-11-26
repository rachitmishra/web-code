import type { Reading } from "../../schema";

// Reading passages for Levels 19–20, modelled on the Halemane reading lessons 22–25.
export const KN_READINGS: Reading[] = [
  {
    "id": "kn.r.karnataka_pride",
    "title": "Pride of Karnataka",
    "titleScript": "ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆ",
    "script": "ಕರ್ನಾಟಕವು ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಇತಿಹಾಸವುಳ್ಳ ಸುಂದರ ನಾಡು. ಇಲ್ಲಿ ಕಾವೇರಿ, ಕೃಷ್ಣಾ, ತುಂಗಭದ್ರಾ ನದಿಗಳು ಹರಿಯುತ್ತವೆ. ಬೇಲೂರು-ಹಳೇಬೀಡು ದೇವಾಲಯಗಳು ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆಯ ಅದ್ಭುತ ಸಾಕ್ಷಿ. ಮೈಸೂರು ಅರಮನೆ ಮತ್ತು ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥ ವಿಶ್ವವಿಖ್ಯಾತವಾಗಿವೆ. ನಮ್ಮ ನಾಡಿನಲ್ಲಿ ಕನ್ನಡ ಭಾಷೆಗೆ ಎರಡು ಸಾವಿರ ವರ್ಷಗಳ ಭವ್ಯ ಸಾಹಿತ್ಯಿಕ ಪರಂಪರೆ ಇದೆ.",
    "meaning": "Karnataka is a beautiful land with ancient history. Sacred rivers Kaveri, Krishna, and Tungabhadra flow here. The temples of Belur-Halebid stand as magnificent testaments to Hoysala stone architecture. The Mysore Palace and the Hampi Stone Chariot are world-renowned. Our Kannada language holds a glorious two-thousand-year literary heritage.",
    "question": {
      "prompt": "Which rivers flow through Karnataka according to the passage?",
      "options": [
        "Kaveri, Krishna, Tungabhadra",
        "Ganga and Yamuna",
        "Narmada and Tapti",
        "Godavari and Mahanadi"
      ],
      "answer": 0,
      "explanation": "The passage highlights Kaveri, Krishna, and Tungabhadra as Karnataka's life-giving rivers."
    }
  },
  {
    "id": "kn.r.mysuru_dasara",
    "title": "Mysuru Dasara Festival",
    "titleScript": "ಮೈಸೂರು ದಸರಾ ಮಹೋತ್ಸವ",
    "script": "ಮೈಸೂರು ದಸರಾ ನಾಡಹಬ್ಬ ಎಂದು ಪ್ರಸಿದ್ಧವಾಗಿದೆ. ವಿಜಯದಶಮಿಯ ದಿನ ಚಿನ್ನದ ಅಂಬಾರಿಯಲ್ಲಿ ತಾಯಿ ಚಾಮುಂಡೇಶ್ವರಿಯ ವಿಗ್ರಹವನ್ನು ಇಟ್ಟು ಆನೆಯ ಮೇಲೆ ಮೆರವಣಿಗೆ ಮಾಡಲಾಗುತ್ತದೆ. ಇದನ್ನು 'ಜಂಬೂ ಸವಾರಿ' ಎನ್ನುತ್ತಾರೆ. ಅರಮನೆಯು ಲಕ್ಷಾಂತರ ದೀಪಗಳಿಂದ ಕಂಗೊಳಿಸುತ್ತದೆ.",
    "meaning": "Mysore Dasara is celebrated as the Naadahabba (State Festival). On Vijayadashami day, Goddess Chamundeshwari's idol is placed in the golden howdah atop the royal elephant. This royal procession is known as 'Jamboo Savari'. The palace glitters with hundreds of thousands of radiant lights.",
    "question": {
      "prompt": "What is the royal elephant procession in Mysuru Dasara called?",
      "options": [
        "ಜಂಬೂ ಸವಾರಿ (Jamboo Savari)",
        "ರಥೋತ್ಸವ (Rathotsava)",
        "ದೀಪೋತ್ಸವ (Deepotsava)",
        "ವೀರಗಾಸೆ (Veeragase)"
      ],
      "answer": 0,
      "explanation": "'Jamboo Savari' is the world-famous royal elephant procession carrying the golden howdah."
    }
  },
  {
    "id": "kn.r.folk_riddles",
    "title": "Traditional Folk Riddles",
    "titleScript": "ಕನ್ನಡ ಜಾನಪದ ಒಗಟುಗಳು",
    "script": "ಒಗಟು ೧: 'ಅಂಗಿ ಕಳಚಿ ಬಾವಿಗೆ ಹಾರಿತು, ಅದೇನು?' — ಬಾಳೆಹಣ್ಣು!\nಒಗಟು ೨: 'ಮೇಲೆ ಹಸಿರು, ಒಳಗೆ ಕೆಂಪು, ತಿಂದರೆ ತಂಪು, ಅದೇನು?' — ಕಲ್ಲಂಗಡಿ ಹಣ್ಣು!\nಒಗಟು ೩: 'ಕಾಲಿಲ್ಲದೆ ಓಡುತ್ತದೆ, ಕಣ್ಣಿಲ್ಲದೆ ಅಳುತ್ತದೆ, ಅದೇನು?' — ಮಳೆ ಮೋಡ!",
    "meaning": "Riddle 1: 'Took off its coat and leaped into the well, what is it?' — A peeled Banana!\nRiddle 2: 'Green outside, ruby red inside, refreshing and cool to eat, what is it?' — Watermelon!\nRiddle 3: 'Runs without legs, weeps without eyes, what is it?' — Rain cloud!",
    "question": {
      "prompt": "What is the answer to: 'Runs without legs, weeps without eyes'?",
      "options": [
        "ಮಳೆ ಮೋಡ (Rain Cloud)",
        "ನದಿ (River)",
        "ಗಾಳಿ (Wind)",
        "ಸೂರ್ಯ (Sun)"
      ],
      "answer": 0,
      "explanation": "A rain cloud runs across the sky without legs and weeps raindrops without eyes!"
    }
  }
];
