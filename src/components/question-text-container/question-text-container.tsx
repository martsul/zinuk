import { useEffect, type FC } from "react";
import type { AudioQuestion } from "../../models/question.models";
import styles from "./question-text-container.module.css";
import { AudioButton } from "../audio-button/audio-button";
import classNames from "classnames";
import { ltrQuestions } from "../question-container/question-container.model";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  questions: (AudioQuestion | string)[];
}

export const QuestionTextContainer: FC<Props> = ({ questions }) => {
  const { pageData, activePage } = useNavigationContext();
  const currentPage = pageData[activePage || ""];

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = document.querySelector(`.${styles.container}`);
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
      <div className={styles.content}>
        {questions.map((question, index) => {
          const questionUrl: string =
            typeof question === "string" ? question : question.question;
          const audio: string | undefined =
            typeof question === "string" ? undefined : question.audio;

          return questionUrl ? (
            <div
              key={index}
              className={classNames(styles.questionContainer, {
                [styles.ltr]: ltrQuestions.has(currentPage?.name),
              })}
            >
              <div className={styles.imgContainer}>
                <img
                  src={questionUrl}
                  alt="question"
                  className={styles.img}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              {audio && (
                <div className={styles.audio}>
                  <AudioButton
                    ltr={ltrQuestions.has(currentPage?.name)}
                    audioUrl={audio}
                  />
                </div>
              )}
            </div>
          ) : (
            <></>
          );
        })}
      </div>
    </div>
  );
};
