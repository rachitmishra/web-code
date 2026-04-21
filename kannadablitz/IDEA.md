# KannadaBlitz Roadmap Ideas

This file tracks potential features and improvements for future development tracks.

## 1. Spaced Repetition System (SRS)
- **Concept:** Track user performance on specific words and scenarios. Automatically surface difficult words for review at scientifically-proven intervals.
- **Goal:** Improve long-term retention beyond the initial 30-day challenge.
- **Tech:** LocalStorage or Firestore for tracking word-level 'difficulty' and 'last seen' timestamps.

## 2. Audio Playback (Survival Pronunciation)
- **Concept:** Add a "Speaker" icon in Flashcards and Scenarios.
- **Goal:** Help users hear the correct inflection and tone for survival phrases.
- **Tech:** Web Speech API (native browser TTS) or integration with Google Cloud Text-to-Speech.

## 3. "Blitz" Quick-Drills (Endless Mode)
- **Concept:** A randomized, timed game mode (e.g., 60 seconds) to answer as many scenarios as possible.
- **Goal:** Add a high-energy, competitive element that fits the "Blitz" branding.
- **Tech:** New Game View and scoring logic in `useGameLogic`.

## 4. Smart Nudge Customization
- **Concept:** Allow users to schedule their own reminders and customize the text sent to friends.
- **Goal:** Strengthen the habit-building aspect and social engagement.
- **Tech:** Update `useNotifications` and Cloud Functions for scheduled triggers.

## 5. Multi-Source Language Support
- **Concept:** Expand source languages (e.g., "Learn Kannada from Hindi, Telugu, or Tamil").
- **Goal:** Broaden the target audience for newcomers in Bangalore from different states.
- **Tech:** Utilize existing `data_hi.ts` structure and scale data mapping.

## 6. Interactive Pronunciation Feedback
- **Concept:** Let users speak into the microphone to practice phrases.
- **Goal:** Complete the learning loop: Read -> Hear -> Speak.
- **Tech:** Web Speech API (Speech Recognition).

## 7. Collaborative Challenges
- **Concept:** Group challenges where a circle of friends must maintain a combined streak.
- **Goal:** Leverage the existing social system for higher group accountability.
- **Tech:** Firestore group collections and real-time syncing.
