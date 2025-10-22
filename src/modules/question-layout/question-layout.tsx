import type { FC } from "react";
import {
  QuestionContent,
  QuestionPersonImg,
  QuestionType,
} from "./question-layout.const";
import styles from "./question-layout.module.css";
import { Check } from "../../svg/check";
import { Copy } from "../../svg/copy";
import { Document } from "../../svg/document";
import Logo from "../../assets/logo.png";
import { Clock } from "../../svg/clock";
import classNames from "classnames";
import { type Question } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  type: QuestionType;
}

export const QuestionLayout: FC<Props> = ({ type }) => {
  const { pageData, activePage } = useNavigationContext();
  const Content: FC = QuestionContent[type];
  const personImg: string = QuestionPersonImg[type];
  const { timer, timerIsVisible } = useNavigationContext();

  if (!activePage) {
    return null;
  }

  const { part, time }: Question = pageData[activePage] as Question;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionContent}>
        <Content />
      </div>
      <div className={styles.questionAside}>
        <svg
          className={styles.questionAsideTop}
          xmlns="http://www.w3.org/2000/svg"
          width="355"
          height="160"
          fill="none"
          viewBox="0 0 355 160"
        >
          <path fill="#fff" d="m0-4.625 354.75 164.5v-164.5z"></path>
        </svg>
        <div className={styles.questionLogo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="133"
            height="128"
            fill="none"
            viewBox="0 0 133 128"
          >
            <circle
              cx="66.5"
              cy="66.5"
              r="66.5"
              fill="#fff"
              transform="matrix(-1 0 0 1 133 -5)"
            ></circle>
          </svg>
          <img src={Logo} alt="logo" className={styles.questionLogoImage} />
        </div>
        <p className={styles.questionLogoTitle}>Exam Part {part}</p>
        <p className={styles.questionLogoSubtitle}>Question Type</p>
        <div className={styles.questionBox}>
          <div className={styles.questionBoxClock}>
            <Clock />
          </div>
          <p className={styles.questionBoxText}>Time allotted</p>
          <p className={styles.questionBoxTime}>{time}</p>
          <p className={styles.questionBoxText}>Minutes</p>
        </div>
        {timerIsVisible && (
          <div className={classNames(styles.questionBox, styles.yellow)}>
            <div className={styles.questionBoxClock}>
              <Clock color="#ffe700" />
            </div>
            <p className={styles.questionBoxTitle}>Time allotted:</p>
            <p className={styles.questionBoxSubtitle}>
              (F12 to hide the clock)
            </p>
            <p className={styles.questionBoxTime}>{timer}</p>
          </div>
        )}
        <img src={personImg} alt="person" className={styles.person} />
        <svg
          className={styles.questionAsideBottom}
          xmlns="http://www.w3.org/2000/svg"
          width="346"
          height="124"
          fill="none"
          viewBox="0 0 346 124"
        >
          <path fill="#fff" d="M346 124.487 0 0v124z"></path>
        </svg>
      </div>
      <div className={styles.questionFooter}>
        <div className={styles.questionFooterText}>
          <Check />
          Select an answer and press &lt;Enter&gt; to confirm.
        </div>
        {type === QuestionType.TQ && (
          <div className={styles.questionFooterActions}>
            <Document />
            <Copy />
          </div>
        )}
      </div>
    </div>
  );
};
