import type { Exercise } from "../engine/types";

export interface AnswerInfo {
  correct: boolean;
  /** mistakes made inside a multi-step exercise (matching) */
  mistakes?: number;
  /** self-graded flashcards update SRS without costing lives */
  selfGraded?: boolean;
  /** trace quality 0..1 */
  score?: number;
  /** what the learner chose, for the feedback panel */
  given?: string;
}

export interface ExerciseProps {
  ex: Exercise;
  onAnswer: (a: AnswerInfo) => void;
  /** true once the runner has received an answer (locks the UI) */
  locked: boolean;
}
