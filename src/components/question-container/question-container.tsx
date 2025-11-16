import { useEffect, useState, type FC } from "react";
import styles from "./question-container.module.css";
import type { AudioQuestion } from "../../models/question.models";
import { AudioButton } from "../audio-button/audio-button";
import classNames from "classnames";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  question: AudioQuestion | string;
  answers: string[];
  showAnswer?: boolean;
}

const text = {
  en: {
    theAnswer: "The Answer",
    select: "Select the answer and press ENTER",
  },
  "he-IL": {
    theAnswer: "התשובה",
    select: "בחר את התשובה ולחץ על Enter",
  },
};

const ltrQuestions: Set<string> = new Set([
  "english-sentence-completion",
  "english-restatements",
  "english-reading-comprehension",
]);

export const QuestionContainer: FC<Props> = ({
  question,
  answers,
  showAnswer = true,
}) => {
  const { error, answer, pageData, activePage } = useNavigationContext();
  const [formattedAnswers, setFormattedAnswers] = useState<
    { img: string; audio: string }[]
  >([]);
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";
  const currentPage = pageData[activePage || ""];

  useEffect(() => {
    setFormattedAnswers([]);
    for (let index = 0; index < answers.length; index += 2) {
      const img: string = answers[index];
      const audio: string = answers[index + 1];

      setFormattedAnswers((prev) => [...prev, { img, audio }]);
    }
  }, [answers]);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = document.querySelector(`.${styles.contentContainer}`);
      if (el && e.target instanceof Node && el.contains(e.target)) {
        e.stopPropagation();
        el.scrollBy({ top: e.deltaY, behavior: "smooth" });
      }
    };

    document.addEventListener("wheel", handler, { passive: false });

    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.contentContainer, {
          [styles.ltr]: ltrQuestions.has(currentPage?.name),
        })}
      >
        <div className={styles.content}>
          <div className={styles.audioContainer}>
            <div className={styles.questionImgContainer}>
              <img
                src={
                  typeof question === "string" ? question : question.question
                }
                alt="question"
                className={styles.questionImg}
              />
            </div>
            {typeof question !== "string" && question.audio && (
              <div className={styles.audioButton}>
                <AudioButton audioUrl={question.audio} />
              </div>
            )}
          </div>
          <div className={styles.answers}>
            {formattedAnswers.map((answer, index: number) => (
              <div className={styles.answer} key={index}>
                <div>
                  <img className={styles.img} src={answer.img} />
                </div>
                <AudioButton audioUrl={answer.audio} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAnswer && (
        <div className={styles.questionFooter}>
          <div className={styles.questionAnswer}>
            <p className={styles.questionAnswerText}>{text[lang].theAnswer}</p>
            <div
              className={classNames(styles.questionInputContainer, {
                [styles.questionInputError]: error,
              })}
            >
              <input
                type="text"
                value={answer || ""}
                className={styles.questionInput}
                readOnly
              />
            </div>
          </div>
          {error && (
            <div className={styles.questionError}>{text[lang].select}</div>
          )}
        </div>
      )}
    </div>
  );
};
