import type { Question } from "../../const/exam";

export const getType = (question: Question): string => {
  if ("questionsPart" in question) {
    return question.questionsPart as string;
  }

  return "Question Type";
};
