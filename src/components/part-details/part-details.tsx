import { useEffect, useState, type FC } from "react";
import styles from "./part-details.module.css";
import {
  ExamStorageName,
  getPartTitle,
  type SimpleQuestionItem,
  type TQQuestionItem,
} from "../../const/exam";
import classNames from "classnames";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { Select } from "../../svg/select";

interface Props {
  part: number;
  selectedQuestion: SimpleQuestionItem | TQQuestionItem | null;
  onSelectQuestion: (
    question: SimpleQuestionItem | TQQuestionItem | null
  ) => void;
}

export const PartDetails: FC<Props> = ({
  part,
  onSelectQuestion,
  selectedQuestion,
}) => {
  const { pageData } = useNavigationContext();
  const [correctCount, setCorrectCount] = useState({
    correct: 0,
    total: 0,
  });

  const [questions, setQuestions] = useState<
    Record<string, (SimpleQuestionItem | TQQuestionItem)[]>
  >({});
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );

  useEffect(() => {
    let correct = 0;
    let total = 0;
    for (const key in pageData) {
      const element = pageData[key];
      if ("correctAnswer" in element) {
        if (element.part === part && element.visible) {
          total++;
          if (element.correctAnswer === +results[element.id]) {
            correct++;
          }
        }
      }
    }
    setCorrectCount({ total, correct });
  }, [pageData, part]);

  useEffect(() => {
    const questions: Record<string, (SimpleQuestionItem | TQQuestionItem)[]> =
      {};
    for (const key in pageData) {
      const element = pageData[key];
      if ("correctAnswer" in element && element.part === part) {
        if (!questions[element.subgroup]) {
          questions[element.subgroup] = [];
        }

        questions[element.subgroup].push(element);
      }
    }

    setQuestions(questions);
  }, [pageData, part]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>{getPartTitle(pageData, part)}</span>
        <span className={styles.percents}>
          {correctCount.total > 0
            ? Math.round((correctCount.correct * 100) / correctCount.total)
            : 0}
          %
        </span>
      </div>
      <div className={styles.answerContainers}>
        {Object.keys(questions)
          .sort((a, b) => a.localeCompare(b))
          .map((group) => (
            <div className={styles.answerContainer} key={group}>
              <div className={styles.answerContainerHeader}>{group}</div>
              <div className={styles.answers}>
                {questions[group].sort((a, b) => a.order - b.order).map((q, i) => {
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
                      }}
                    >
                      <div className={styles.answerNum}>{i + 1}</div>
                      <div className={styles.answerSq}>
                        <Select
                          className={classNames(styles.check, {
                            [styles.active]: q.id === selectedQuestion?.id,
                          })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
