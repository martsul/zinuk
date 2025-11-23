import { LogoHeader } from "../../components/logo-header/logo-header";
import { Clock } from "../../svg/clock";
import styles from "./pause-layout.module.css";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { ExamType } from "../../const/exam";
import { useEffect, useState } from "react";
import pause1 from "@/assets/pause-1.png";
import pause2 from "@/assets/pause-2.png";

const examPersons: Record<number, string> = {
  0: pause1,
  1: pause2,
};

const text = {
  en: {
    pause: "Pause",
    timeRemaining: "Time remaining",
    f12: "(F12 to hide the clock)",
    five: "To skip a paragraph, press the number <5> ",
    enter: "followed by <Enter>",
    skip: "To skip a paragraph, press the number <5> followed by <Enter>",
  },
  "he-IL": {
    pause: "הפסקה",
    timeRemaining: "זמן שנותר",
    f12: "(F12 להסתרת השעון)",
    skip: "כדי לדלג על פסקה, לחץ על המספר <5> ואחריו <Enter>",
    five: "כדי לדלג על ההפסקה, לחץ על המספר <5>",
    enter: "ואז על <Enter>",
  },
};

export const PauseLayout = () => {
  const { timer, timerIsVisible, activePage, pageData, canContinue } =
    useNavigationContext();
  const [pauseIndex, setPauseIndex] = useState(0);
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";

  useEffect(() => {
    for (const key in pageData) {
      const currentItem = pageData[key];
      if (currentItem.id === activePage) {
        return;
      }

      if (currentItem.type === ExamType.PAUSE) {
        setPauseIndex((prev) => prev + 1);
      }
    }
  }, [activePage, pageData]);

  if (!activePage) {
    return;
  }

  return (
    <div className={styles.pauseContainer}>
      <LogoHeader />
      <div className={styles.contentContainer}>
        <img
          src={examPersons[pauseIndex] || pause1}
          alt="person"
          className={styles.person}
        />
        <div className={styles.content}>
          <div className={styles.title}>{text[lang].pause}</div>
          {timerIsVisible && (
            <div className={styles.box}>
              <div className={styles.clock}>
                <Clock className={styles.clockSvg} />
              </div>
              <p className={styles.boxTitle}>{text[lang].timeRemaining}:</p>
              <p className={styles.boxSubtitle}>{text[lang].f12}</p>
              <p className={styles.boxTime}>{timer}</p>
            </div>
          )}
          <p className={styles.subBox}>{text[lang].skip}</p>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.footerText}>{text[lang].five}</span>
        <span className={styles.five}>{canContinue && "5"}</span>
        <span className={styles.footerText}>{text[lang].enter}</span>
      </div>
    </div>
  );
};
