import type { ExerciseProps } from "./types";
import { ChoiceExercise } from "./Choice";
import { Flashcard, LetterLearn, PhraseReveal, ReadingExercise, RevealWord } from "./Cards";
import { MatchColumns, MatchGrid } from "./Match";
import { SentenceBuild, SentenceFill } from "./Sentence";
import { TraceExercise } from "./Trace";
import { WordSwipe } from "./WordSwipe";
import { DebugLabel } from "../ui/kit";

function exerciseName(type: ExerciseProps["ex"]["type"]): string {
  switch (type) {
    case "letter_learn": return "LetterLearn";
    case "letter_pick": return "ChoiceExercise (letter_pick)";
    case "letter_find": return "ChoiceExercise (letter_find)";
    case "meaning_pick": return "ChoiceExercise (meaning_pick)";
    case "script_pick": return "ChoiceExercise (script_pick)";
    case "letter_trace": return "TraceExercise";
    case "word_intro": return "RevealWord";
    case "word_swipe": return "WordSwipe";
    case "flashcard": return "Flashcard";
    case "match_grid": return "MatchGrid";
    case "match_columns": return "MatchColumns";
    case "sentence_build": return "SentenceBuild";
    case "sentence_fill": return "SentenceFill";
    case "phrase_reveal": return "PhraseReveal";
    case "reading": return "ReadingExercise";
  }
}

export function ExerciseView(props: ExerciseProps) {
  const inner = (() => {
    switch (props.ex.type) {
      case "letter_learn": return <LetterLearn {...props} />;
      case "letter_pick":
      case "letter_find":
      case "meaning_pick":
      case "script_pick": return <ChoiceExercise {...props} />;
      case "letter_trace": return <TraceExercise {...props} />;
      case "word_intro": return <RevealWord {...props} />;
      case "word_swipe": return <WordSwipe {...props} />;
      case "flashcard": return <Flashcard {...props} />;
      case "match_grid": return <MatchGrid {...props} />;
      case "match_columns": return <MatchColumns {...props} />;
      case "sentence_build": return <SentenceBuild {...props} />;
      case "sentence_fill": return <SentenceFill {...props} />;
      case "phrase_reveal": return <PhraseReveal {...props} />;
      case "reading": return <ReadingExercise {...props} />;
    }
  })();
  return (
    <div className="exercise-host">
      <DebugLabel name={exerciseName(props.ex.type)} />
      {inner}
    </div>
  );
}

export type { AnswerInfo } from "./types";
