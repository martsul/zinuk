import type { AudioQuestion } from "../models/question.models";
// import previewPerson1 from "@/assets/1-preview.png";
// import previewPerson2 from "@/assets/preview-2.png";
// import previewPerson3 from "@/assets/preview-3.png";
// import examIntro1 from "@/assets/exam-intro-1.png";
// import questionIntro1 from "@/assets/question-intro-1.png";
// import questionIntro2 from "@/assets/question-intro-2.png";
// import questionIntro3 from "@/assets/question-intro-3.png";
// import questionImg from "@/assets/question-text.png";
// import pause1 from "@/assets/pause-1.png";
// import pause2 from "@/assets/pause-2.png";

export const ExamStorageName = "zinukExam";

export enum ExamType {
  PREVIEW = "preview",
  EXAM_INTRO = "examIntro",
  QUESTION_INTRO = "questionIntro",
  SIMPLE_QUESTION = "simpleQuestion",
  QUESTION_TEXT = "questionText",
  QUESTION_TQ = "questionTQ",
  PAUSE = "pause",
}

export interface ExamItem {
  next?: number;
  id: number;
}

export interface PreviewItem extends ExamItem {
  type: ExamType.PREVIEW;
  title: string;
  img: string;
  part: number;
}

export interface IntroItem extends ExamItem {
  type: ExamType.EXAM_INTRO | ExamType.QUESTION_INTRO;
  img: string;
  texts: string[];
  part: number;
  title?: string;
  questionPart?: string;
}

export interface Question extends ExamItem {
  part: number;
  id: number;
  time: number;
  visible?: boolean;
}

export interface SimpleQuestionItem extends Question {
  type: ExamType.SIMPLE_QUESTION;
  question: string | AudioQuestion;
  title: string | AudioQuestion;
  answers: string[];
  correctAnswer: number;
  questionsPart: string;
}

export interface TextQuestionItem extends Question {
  type: ExamType.QUESTION_TEXT;
  questions: string[] | AudioQuestion[];
}

export interface TQQuestionItem extends Question {
  type: ExamType.QUESTION_TQ;
  questions: string[] | AudioQuestion[];
  title: string;
  question: string | AudioQuestion;
  answers: string[];
  correctAnswer: number;
  questionsPart: string;
}

export interface PauseItem extends ExamItem {
  type: ExamType.PAUSE;
  img: string;
  time: number;
}

export type ExamDto = Record<
  string,
  | PreviewItem
  | IntroItem
  | SimpleQuestionItem
  | TextQuestionItem
  | TQQuestionItem
  | PauseItem
>;

// export const EXAM: ExamDto = {
//   1: {
//     id: 1,
//     next: 2,
//     title: "Exam Part 1",
//     img: previewPerson1,
//     type: ExamType.PREVIEW,
//   },
//   2: {
//     id: 2,
//     next: 3,
//     type: ExamType.EXAM_INTRO,
//     img: examIntro1,
//     part: 1,
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   3: {
//     id: 3,
//     next: 4,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro1,
//     part: 1,
//     questionPart: "Inference",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   4: {
//     id: 4,
//     next: 5,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 1,
//     time: 4,
//     questionsPart: "Inference",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       "Out of control: to irritate",
//       "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//     ],
//     correctAnswer: 2,
//   },
//   5: {
//     id: 5,
//     next: 6,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro2,
//     part: 1,
//     questionPart: "Reading",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   6: {
//     id: 6,
//     next: 7,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 1,
//     time: 3,
//     questionsPart: "Reading",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       "Out of control: to irritate",
//       "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//     ],
//     correctAnswer: 2,
//   },
//   7: {
//     id: 7,
//     next: 8,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro3,
//     part: 1,
//     questionPart: "Analogies",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   8: {
//     id: 8,
//     next: 9,
//     type: ExamType.QUESTION_TEXT,
//     part: 1,
//     time: 4,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   9: {
//     id: 9,
//     next: 10,
//     type: ExamType.QUESTION_TQ,
//     part: 1,
//     time: 1.5,
//     questionsPart: "Analogies",
//     question: questionImg,
//     title:
//       "Find the relationship between the meanings of the two highlighted words, and choose from the answers?",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   10: {
//     id: 10,
//     next: 11,
//     type: ExamType.QUESTION_TEXT,
//     part: 1,
//     time: 4,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   11: {
//     id: 11,
//     next: 12,
//     type: ExamType.QUESTION_TQ,
//     part: 1,
//     time: 1.5,
//     questionsPart: "Sentence Completion",
//     question: questionImg,
//     title:
//       "Find the relationship between the meanings of the two highlighted words, and choose from the answers?",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   12: {
//     id: 12,
//     next: 13,
//     type: ExamType.PAUSE,
//     img: pause1,
//     time: 5,
//   },
//   13: {
//     id: 13,
//     next: 14,
//     title: "Exam Part 2",
//     img: previewPerson2,
//     type: ExamType.PREVIEW,
//   },
//   14: {
//     id: 14,
//     next: 15,
//     type: ExamType.EXAM_INTRO,
//     img: examIntro1,
//     part: 2,
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   15: {
//     id: 15,
//     next: 16,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro1,
//     part: 2,
//     questionPart: "Graphs",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   16: {
//     id: 16,
//     next: 17,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 2,
//     time: 4,
//     questionsPart: "Graphs",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//   },
//   17: {
//     id: 17,
//     next: 18,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro2,
//     part: 2,
//     questionPart: "Problem Solving",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   18: {
//     id: 18,
//     next: 19,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 2,
//     time: 4,
//     questionsPart: "Problem Solving",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//   },
//   19: {
//     id: 19,
//     next: 20,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro3,
//     part: 2,
//     questionPart: "Geometry",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   20: {
//     id: 20,
//     next: 21,
//     type: ExamType.QUESTION_TEXT,
//     part: 2,
//     time: 4,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   21: {
//     id: 21,
//     next: 22,
//     type: ExamType.QUESTION_TQ,
//     part: 2,
//     time: 4,
//     questionsPart: "Geometry",
//     question: questionImg,
//     title:
//       "Find the relationship between the meanings of the two highlighted words, and choose from the answers?",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   22: {
//     id: 22,
//     next: 23,
//     type: ExamType.QUESTION_TEXT,
//     part: 1,
//     time: 4,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   23: {
//     id: 23,
//     next: 24,
//     type: ExamType.QUESTION_TQ,
//     part: 2,
//     time: 4,
//     questionsPart: "Algebra",
//     question: questionImg,
//     title:
//       "Find the relationship between the meanings of the two highlighted words, and choose from the answers?",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   24: {
//     id: 24,
//     next: 25,
//     type: ExamType.PAUSE,
//     img: pause2,
//     time: 5,
//   },
//   25: {
//     id: 25,
//     next: 26,
//     title: "Exam Part 3",
//     img: previewPerson3,
//     type: ExamType.PREVIEW,
//   },
//   26: {
//     id: 26,
//     next: 27,
//     type: ExamType.EXAM_INTRO,
//     img: examIntro1,
//     part: 3,
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   27: {
//     id: 27,
//     next: 28,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro1,
//     part: 3,
//     questionPart: "Sentenc Completion",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   28: {
//     id: 28,
//     next: 29,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 3,
//     time: 2,
//     questionsPart: "Sentenc Completion",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//   },
//   29: {
//     id: 29,
//     next: 30,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro2,
//     part: 3,
//     questionPart: "Restatements",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   30: {
//     id: 30,
//     next: 31,
//     type: ExamType.SIMPLE_QUESTION,
//     part: 3,
//     time: 4,
//     questionsPart: "Restatements",
//     question: questionImg,
//     title: "Adviser of Justice: To the defense attorney -",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//   },
//   31: {
//     id: 31,
//     next: 32,
//     type: ExamType.QUESTION_INTRO,
//     img: questionIntro3,
//     part: 3,
//     questionPart: "Reading Comprehension",
//     texts: [
//       `At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.
// In the real test, the scores will not appear at the end of the test, but only with the official publication of the scores
// `,
//       `The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.
// As a reminder, unlike in a real psychometric exam, in this test the score in the verbal reasoning area does not include a score on a writing assignment.`,
//     ],
//   },
//   32: {
//     id: 32,
//     next: 33,
//     type: ExamType.QUESTION_TEXT,
//     part: 3,
//     time: 4,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
//   33: {
//     id: 33,
//     type: ExamType.QUESTION_TQ,
//     part: 3,
//     time: 4,
//     questionsPart: "Reading Comprehension",
//     question: questionImg,
//     title:
//       "Find the relationship between the meanings of the two highlighted words, and choose from the answers?",
//     answers: [
//       "Prophet of Wrath: To be destroyed",
//       "Small faith: to believe",
//       "Out of control: to irritate",
//       "To cast a spell: to frighten",
//     ],
//     correctAnswer: 2,
//     questions: [
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//       {
//         question: questionImg,
//         audio:
//           "https://ringtonemaker.com/samples/ringtonemaker/1/body-rock.ogg",
//       },
//     ],
//   },
// };

export const getPartsCount = (exam: ExamDto): number => {
  const parts = new Set<number>();

  for (const key in exam) {
    const element = exam[key];
    if ("part" in element) {
      parts.add(element.part);
    }
  }

  return parts.size;
};

// export const QuestionByQuestionType: Record<string, number[]> = {};

// for (const key in EXAM) {
//   const element = EXAM[key];
//   if ("questionsPart" in element) {
//     if (!QuestionByQuestionType[element.questionsPart]) {
//       QuestionByQuestionType[element.questionsPart] = [];
//     }
//     QuestionByQuestionType[element.questionsPart].push(element.id);
//   }
// }

export const getQuestionTypeByParts = (
  exam: ExamDto
): Record<number, string[]> => {
  const questionTypeByParts: Record<number, string[]> = {};

  for (const key in exam) {
    const element = exam[key];
    if ("questionsPart" in element) {
      const part = element.part;
      if (!questionTypeByParts[part]) {
        questionTypeByParts[part] = [];
      }
      if (!questionTypeByParts[part].includes(element.questionsPart)) {
        questionTypeByParts[part].push(element.questionsPart);
      }
    }
  }

  return questionTypeByParts;
};

export const getQuestionCount = (exam: ExamDto) => {
  const AllQuestions: Record<string, SimpleQuestionItem | TQQuestionItem> = {};
  for (const key in exam) {
    const element = exam[key];
    if ("correctAnswer" in element) {
      AllQuestions[key] = element;
    }
  }

  return Object.keys(AllQuestions).length;
};
export const getPartTitle = (exam: ExamDto, part: number): string => {
  const values = Object.values(exam);
  const preview: PreviewItem = values.find(
    (e) => e.type === ExamType.PREVIEW && e.part == part
  ) as PreviewItem;

  return preview?.title || "";
};
