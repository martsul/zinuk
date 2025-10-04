export enum IntroType {
  QUESTION = "question",
  EXAM = "exam",
}

export const IntroTitle: Record<IntroType, string> = {
  [IntroType.QUESTION]: "Question Part Intro",
  [IntroType.EXAM]: "Exam Part Intro",
};