import { useEffect, useState, type FC } from "react";
import styles from "./part-item.module.css";
import { EXAM, ExamStorageName } from "../../const/exam";
import classNames from "classnames";

interface Props {
  type: string;
  part: number;
}

const results: Record<string, string> = JSON.parse(
  sessionStorage.getItem(ExamStorageName) || "{}"
);

export const PartItem: FC<Props> = ({ type, part }) => {
  const [correct, setCorrect] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  useEffect(() => {
    let total = 0;
    let correct = 0;
    for (const key in EXAM) {
      const element = EXAM[key];
      if ("correctAnswer" in element) {
        if (element.part === part && element.questionsPart === type) {
          total++;
          if (element.correctAnswer === +results[element.id]) {
            correct++;
          }
        }
      }
    }
    setCorrect({ total, correct });
  }, [part, type]);

  console.log(correct)

  return (
    <div className={styles.container}>
      <div className={styles.title}>{type}</div>
      <div className={styles.progress}>
        <div className={styles.circles}>
          {[...new Array(correct.total)].map((_, i) => (
            <div
              className={classNames(styles.circle, {
                [styles.active]: correct.correct > i,
              })}
              key={i}
            ></div>
          ))}
        </div>
        <div className={styles.percents}>
          {Math.round((100 * correct.correct) / correct.total) || 0}%
        </div>
      </div>
    </div>
  );
};
