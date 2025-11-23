import { useEffect, type FC } from "react";
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
import { getPartTitle, type Question } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { QuestionText } from "../question-content/question-text/question-text";
import { SimpleQuestion } from "../question-content/simple-question/simple-question";
import { Modal } from "../../components/modal/modal";

interface Props {
  type: QuestionType;
}

const texts = {
  en: {
    examPart: {
      1: "Exam Part 1",
      2: "Exam Part 2",
      3: "Exam Part 3",
    },
    timeAllotted: "Time allotted",
    timeLeft: "Time left",
    minutes: "Minutes",
    f12: "(F12 to hide the clock)",
    enter: "Select an answer and press <Enter>; to confirm.",
  },
  "he-IL": {
    examPart: {
      1: "מילולי",
      2: "כמותי",
      3: "אנגלית",
    },
    timeLeft: "זמן נותר",
    timeAllotted: "זמן מוקצב",
    minutes: "דקות",
    f12: "(F12 להסתרת השעון)",
    enter: "בחר תשובה ולחץ על <Enter> לאישור.",
  },
};

const getType = (question: Question): string => {
  if ("questionsPart" in question) {
    return question.questionsPart as string;
  }

  return "Question Type";
};

export const QuestionLayout: FC<Props> = ({ type }) => {
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";
  const { pageData, activePage, modal, setModal, timer, timerIsVisible } =
    useNavigationContext();
  const Content: FC = QuestionContent[type];
  const personImg: string = QuestionPersonImg[type];

  useEffect(() => {
    if (activePage) {
      console.log(pageData[activePage]);
    }
  }, [activePage]);

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
            className={styles.circle}
            xmlns="http://www.w3.org/2000/svg"
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
        <p className={styles.questionLogoTitle}>
          {getPartTitle(pageData, part)}
        </p>
        <p className={styles.questionLogoSubtitle}>
          {getType(pageData[activePage] as Question)}
        </p>
        <div className={styles.questionBox}>
          <div className={styles.questionBoxClock}>
            <Clock className={styles.clockSvg} />
          </div>
          <p className={styles.questionBoxText}>{texts[lang].timeAllotted}</p>
          <p className={styles.questionBoxTime}>{time}</p>
          <p className={styles.questionBoxText}>{texts[lang].minutes}</p>
        </div>
        {timerIsVisible && (
          <div className={classNames(styles.questionBox, styles.yellow)}>
            <div className={styles.questionBoxClock}>
              <Clock className={styles.clockSvg} />
            </div>
            <p className={styles.questionBoxTitle}>{texts[lang].timeLeft}:</p>
            <p className={styles.questionBoxSubtitle}>{texts[lang].f12}</p>
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
          <Check className={styles.check} />
          {texts[lang].enter}
        </div>
        {type === QuestionType.TQ && (
          <div className={styles.questionFooterActions}>
            <button onClick={() => setModal("question")}>
              <Document />
            </button>
            <button onClick={() => setModal("answer")}>
              <Copy />
            </button>
          </div>
        )}
      </div>
      {modal === "question" && (
        <Modal onClose={() => setModal(null)}>
          <QuestionText />
        </Modal>
      )}
      {modal === "answer" && (
        <Modal onClose={() => setModal(null)}>
          <SimpleQuestion />
        </Modal>
      )}
    </div>
  );
};
