import { useEffect, useState, type FC } from "react";
import styles from "./part-item.module.css";
import { ExamStorageName } from "../../const/exam";
import classNames from "classnames";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  type: string;
  part: number;
}

export const PartItem: FC<Props> = ({ type, part }) => {
  const { pageData } = useNavigationContext();
  const [correct, setCorrect] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );
  const percents: number =
    Math.round((100 * correct.correct) / correct.total) || 0;
  const count: number = Math.round(percents / 10);

  useEffect(() => {
    let total = 0;
    let correct = 0;
    for (const key in pageData) {
      const element = pageData[key];
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
  }, [pageData, part, type]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{type}</div>
      <div className={styles.progress}>
        <div className={styles.circles}>
          {[...new Array(10)].map((_, i) => (
            <div
              className={classNames(styles.circle, {
                [styles.active]: count >= i + 1,
              })}
              key={i}
            ></div>
          ))}
        </div>
        <div className={styles.percents}>{percents}%</div>
      </div>
    </div>
  );
};
