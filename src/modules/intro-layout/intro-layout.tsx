import { Decor } from "../../svg/decor";
import styles from "./intro-layout.module.css";
import { BlueDecor } from "../../svg/blue-decor";
import { IntroType } from "./intro-layout.const";
import type { FC } from "react";
import { type IntroItem } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import examIntro1 from "@/assets/exam-intro-1.png";
import questionIntro1 from "@/assets/question-intro-1.png";

interface Props {
  type: IntroType;
}

const texts = {
  en: {
    [IntroType.EXAM]: "Exam Part Intro",
    [IntroType.QUESTION]: "Question Part Intro",
  },
  "he-IL": {
    [IntroType.EXAM]: "מבוא לחלק הבחינה",
    [IntroType.QUESTION]: "מבוא לחלק השאלה",
  },
};

export const IntroLayout: FC<Props> = ({ type }) => {
  const { pageData, activePage, navigateToNextPage } = useNavigationContext();
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";

  if (!activePage) {
    return;
  }

  const introData: IntroItem = pageData[activePage] as IntroItem;
  const img: string = type === IntroType.EXAM ? examIntro1 : questionIntro1;

  if (
    !introData.img &&
    ((Array.isArray(introData) && !introData.texts.length) || !introData.texts)
  ) {
    navigateToNextPage();
    return;
  }

  return (
    <div className={styles.introContainer}>
      <div className={styles.header}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={img} alt="person" />
        </div>
        <p className={styles.title}>{texts[lang][type]}</p>
        <div className={styles.decor}>
          <Decor />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          {type === IntroType.EXAM ? (
            <div
              className={styles.contentText}
              dangerouslySetInnerHTML={{
                __html: introData.img || introData.texts[0],
              }}
            />
          ) : (
            <div
              className={styles.contentText}
              dangerouslySetInnerHTML={{ __html: introData.texts }}
            />
          )}
        </div>
        <div className={styles.contentDecor}>
          <BlueDecor />
        </div>
      </div>
    </div>
  );
};
