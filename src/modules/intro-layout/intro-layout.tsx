import { Decor } from "../../svg/decor";
import styles from "./intro-layout.module.css";
import { BlueDecor } from "../../svg/blue-decor";
import { IntroTitle, type IntroType } from "./intro-layout.const";
import type { FC } from "react";
import { type IntroItem } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

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

  return (
    <div className={styles.introContainer}>
      <div className={styles.header}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={introData.img} alt="person" />
        </div>
        <p className={styles.title}>{title}</p>
        <div className={styles.decor}>
          <Decor />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          {introData.texts.map((text, index) => (
            <p key={index} className={styles.contentText}>
              {text}
            </p>
          ))}
        </div>
        <div className={styles.contentDecor}>
          <BlueDecor />
        </div>
      </div>
    </div>
  );
};
