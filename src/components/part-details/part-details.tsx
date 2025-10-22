import { useEffect, useState, type FC } from "react";
import styles from "./part-details.module.css";
import {
  ExamStorageName,
  type SimpleQuestionItem,
  type TQQuestionItem,
} from "../../const/exam";
import classNames from "classnames";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  part: number;
  onSelectQuestion: (
    question: SimpleQuestionItem | TQQuestionItem | null
  ) => void;
  setQuestionNumber: (value: number | null) => void;
}

export const PartDetails: FC<Props> = ({
  part,
  onSelectQuestion,
  setQuestionNumber,
}) => {
  const { pageData } = useNavigationContext();
  const [questions, setQuestions] = useState<
    (SimpleQuestionItem | TQQuestionItem)[]
  >([]);
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );

  useEffect(() => {
    const questions: (SimpleQuestionItem | TQQuestionItem)[] = [];
    for (const key in pageData) {
      const element = pageData[key];
      if ("correctAnswer" in element && element.part === part) {
        questions.push(element);
      }
    }

    setQuestions(questions);
  }, [pageData, part]);

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
                onSelectQuestion(q);
                setQuestionNumber(i + 1);
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
