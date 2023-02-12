export type Results = {
  correct: boolean;
  correctAnswer: (string | null | undefined)[];
  userAnswer: string;
  id: string;
}[];
