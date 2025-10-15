import { ExamType } from "./exam";

export enum RouterUrl {
  ROOT = "/",
  PREVIEW = "preview",
  ID = ":id",
  PREVIEW_NEW = "new",
  QUESTION_INTRO = "question-intro",
  EXAM_INTRO = "exam-intro",
  SIMPLE_QUESTION = "simple-question",
  QUESTION_TEXT = "question-text",
  QUESTION_TQ = "question-tq",
  PAUSE = "pause",
  RESULTS = "results",
  RESULTS_DETAILS = "results-details",
  SETTINGS = "settings",
}

export const ExamTypeRoute: Record<ExamType, RouterUrl> = {
  [ExamType.PREVIEW]: RouterUrl.PREVIEW,
  [ExamType.EXAM_INTRO]: RouterUrl.EXAM_INTRO,
  [ExamType.QUESTION_INTRO]: RouterUrl.QUESTION_INTRO,
  [ExamType.SIMPLE_QUESTION]: RouterUrl.SIMPLE_QUESTION,
  [ExamType.QUESTION_TEXT]: RouterUrl.QUESTION_TEXT,
  [ExamType.QUESTION_TQ]: RouterUrl.QUESTION_TQ,
  [ExamType.PAUSE]: RouterUrl.PAUSE,
}