import { Link } from "react-router-dom";
import { LogoHeader } from "../../components/logo-header/logo-header";
import styles from "./results-layout.module.css";
import { Arrow } from "../../svg/arrow";
import { Home } from "../../svg/home";
import type { FC, ReactElement } from "react";
import { EXAM, ExamStorageName, QuestionsCount } from "../../const/exam";

interface Props {
  children: ReactElement;
}

const results: Record<string, string> = JSON.parse(
  sessionStorage.getItem(ExamStorageName) || "{}"
);
let correctAnswers = 0;

for (const key in results) {
  const result = results[key];
  if ("correctAnswer" in EXAM[key]) {
    if (EXAM[key].correctAnswer == +result) {
      correctAnswers++;
    }
  }
}

export const ResultsLayout: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      <LogoHeader>
        <div className={styles.headerContainer}>
          <div className={styles.actions}>
            <Link to={"/"}>
              <div className={styles.action}>
                <Arrow />
                <span className={styles.actionText}>Back</span>
              </div>
            </Link>
            <Link to={"/"}>
              <div className={styles.action}>
                <Home />
                <span className={styles.actionText}>Home</span>
              </div>
            </Link>
          </div>
          <div className={styles.score}>
            <p className={styles.percent}>
              Percentage score:{" "}
              {Math.round((correctAnswers * 100) / QuestionsCount)}%
            </p>
            <p className={styles.num}>Numerical score: {correctAnswers}</p>
          </div>
          <div className={styles.empty}></div>
        </div>
      </LogoHeader>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}></div>
    </div>
  );
};
