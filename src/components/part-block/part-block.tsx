import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { RouterUrl } from "../../const/router";
import styles from "./part-block.module.css";
import { EXAM, ExamStorageName, QuestionTypeByParts } from "../../const/exam";
import { PartItem } from "../part-item/part-item";

interface Props {
  part: number;
}

const results: Record<string, string> = JSON.parse(
  sessionStorage.getItem(ExamStorageName) || "{}"
);

export const PartBlock: FC<Props> = ({ part }) => {
  const [correctCount, setCorrectCount] = useState<{
    correct: number;
    total: number;
  }>({
    correct: 0,
    total: 0,
  });
  const items: string[] = QuestionTypeByParts[part] || [];

  useEffect(() => {
    let correct = 0;
    let total = 0;
    for (const key in EXAM) {
      const element = EXAM[key];
      if ("correctAnswer" in element) {
        if (element.part === part) {
          total++;
          if (element.correctAnswer === +results[element.id]) {
            correct++;
          }
        }
      }
    }
    setCorrectCount({ total, correct });
  }, [part]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>Exam Part {part}</div>
        <div className={styles.headerText}>
          {Math.round((correctCount.correct * 100) / correctCount.total)}%
        </div>
      </div>
      <div className={styles.items}>
        {items.map((item, i) => (
          <PartItem type={item} part={part} key={i} />
        ))}
      </div>
      <Link className={styles.link} to={`/${RouterUrl.RESULTS_DETAILS}`}>
        For more details
      </Link>
    </div>
  );
};
