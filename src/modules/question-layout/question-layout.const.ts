import { QuestionText } from "./../question-content/question-text/question-text";
import YellowPerson from "../../assets/yellow-person.svg";
import WhitePerson from "../../assets/white-person.svg";
import type { FC } from "react";
import { SimpleQuestion } from "../question-content/simple-question/simple-question";
import { TqContent } from "../question-content/tq-content/tq-content";
import { WritingContent } from "../question-content/writing-content/writing-content";

export enum QuestionType {
  SIMPLE = "simple",
  TEXT = "text",
  TQ = "tq",
  WRITING = "writing",
}

export const QuestionPersonImg: Record<QuestionType, string> = {
  [QuestionType.SIMPLE]: WhitePerson,
  [QuestionType.TEXT]: WhitePerson,
  [QuestionType.TQ]: YellowPerson,
  [QuestionType.WRITING]: YellowPerson,
};

export const QuestionContent: Record<QuestionType, FC> = {
  [QuestionType.SIMPLE]: SimpleQuestion,
  [QuestionType.TEXT]: QuestionText,
  [QuestionType.TQ]: TqContent,
  [QuestionType.WRITING]: WritingContent,
};
