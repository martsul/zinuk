import { LogoHeader } from "../../components/logo-header/logo-header";
import styles from "./results-layout.module.css";
import { Arrow } from "../../svg/arrow";
import { Home } from "../../svg/home";
import { ExamStorageName, getQuestionCount } from "../../const/exam";
import { useEffect, useState } from "react";
import { ResultsDetails } from "../results-content/results-details/results-details";
import { ResultsBase } from "../results-content/results-base/results-base";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

const texts = {
  en: {
    back: "Back",
    home: "Home",
    percentage: "Percentage score:",
    numerical: "Numerical score:",
  },
  "he-IL": {
    back: "חזרה",
    home: "דף הבית",
    percentage: "ציון באחוזים:",
    numerical: "ציון מספרי:",
  },
};

export const ResultsLayout = () => {
  const { pageData } = useNavigationContext();
  const questionsCount = getQuestionCount(pageData);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";
  const percents: number = Math.round((correctAnswers * 100) / questionsCount);
  const count: number = Math.round((percents / 100) * 600 + 200);
  const [detailsNumber, setDetailsNumber] = useState<number | null>(null)

  useEffect(() => {
    const results: Record<string, string> = JSON.parse(
      sessionStorage.getItem(ExamStorageName) || "{}"
    );

    for (const key in results) {
      const result = results[key];
      if ("correctAnswer" in pageData[key]) {
        if (pageData[key].correctAnswer == +result) {
          setCorrectAnswers((prev) => prev + 1);
        }
      }
    }
  }, [pageData]);

  return (
    <div className={styles.container}>
      <LogoHeader>
        <div className={styles.headerContainer}>
          <div className={styles.actions}>
            <div
              onClick={() => setDetailsNumber(null)}
              className={`${styles.action} ${styles.arrow}`}
            >
              <Arrow />
              <span className={styles.actionText}>{texts[lang].back}</span>
            </div>
            <div className={styles.action}>
              <Home />
              <span className={styles.actionText}>{texts[lang].home}</span>
            </div>
          </div>
          <div className={styles.score}>
            <p className={styles.percent}>
              {texts[lang].percentage}
              {percents}%
            </p>
            <p className={styles.num}>
              {texts[lang].numerical} {count}
            </p>
          </div>
          <div className={styles.empty}></div>
        </div>
      </LogoHeader>
      <div className={styles.content}>
        {detailsNumber ? (
          <ResultsDetails detailsNumber={detailsNumber} />
        ) : (
          <ResultsBase openDetails={setDetailsNumber} />
        )}
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};
