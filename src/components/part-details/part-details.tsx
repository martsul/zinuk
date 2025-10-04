import { useEffect, useState, type FC } from "react";
import styles from "./part-details.module.css";
import {
  EXAM,
  ExamStorageName,
  type SimpleQuestionItem,
  type TQQuestionItem,
} from "../../const/exam";
import classNames from "classnames";

interface Props {
  part: number;
  onSelectQuestion: (
    question: SimpleQuestionItem | TQQuestionItem | null
  ) => void;
  setQuestionNumber: (value: number | null) => void;
}

const results: Record<string, string> = JSON.parse(
  sessionStorage.getItem(ExamStorageName) || "{}"
);

export const PartDetails: FC<Props> = ({ part, onSelectQuestion, setQuestionNumber }) => {
  const [questions, setQuestions] = useState<
    (SimpleQuestionItem | TQQuestionItem)[]
  >([]);

  useEffect(() => {
    const questions: (SimpleQuestionItem | TQQuestionItem)[] = [];
    for (const key in EXAM) {
      const element = EXAM[key];
      if ("correctAnswer" in element && element.part === part) {
        questions.push(element);
      }
    }

    setQuestions(questions);
  }, [part]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>Part {part}</div>
      <div className={styles.answers}>
        {questions.map((q, i) => {
          let status: string;
          if (!results[q.id]) {
            status = "warning";
          } else if (+results[q.id] === q.correctAnswer) {
            status = "correct";
          } else {
            status = "wrong";
          }

          return (
            <div
              key={q.id}
              className={classNames(styles.answer, styles[status])}
              onClick={() => {
                onSelectQuestion(q)
                setQuestionNumber(i + 1)
              }}
            >
              <div className={styles.answerNum}>{i + 1}</div>
              <div className={styles.answerSq}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
