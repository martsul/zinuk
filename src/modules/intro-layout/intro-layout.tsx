import { Decor } from "../../svg/decor";
import styles from "./intro-layout.module.css";
import { BlueDecor } from "../../svg/blue-decor";
import { IntroTitle, IntroType } from "./intro-layout.const";
import type { FC } from "react";
import { type IntroItem } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import examIntro1 from "@/assets/exam-intro-1.png";
import questionIntro1 from "@/assets/question-intro-1.png";

interface Props {
  type: IntroType;
}

export const IntroLayout: FC<Props> = ({ type }) => {
  const { pageData, activePage } = useNavigationContext();

  if (!activePage) {
    return;
  }

  const title: string = IntroTitle[type];
  const introData: IntroItem = pageData[activePage] as IntroItem;
  const img: string = type === IntroType.EXAM ? examIntro1 : questionIntro1;

  return (
    <div className={styles.introContainer}>
      <div className={styles.header}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={img} alt="person" />
        </div>
        <p className={styles.title}>{title}</p>
        <div className={styles.decor}>
          <Decor />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          {type === IntroType.EXAM ? (
            <div
              className={styles.contentText}
              dangerouslySetInnerHTML={{ __html: introData.img }}
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
