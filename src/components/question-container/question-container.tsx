import type { FC } from "react";
import styles from "./question-container.module.css";
import type { AudioQuestion } from "../../models/question.models";
import { AudioButton } from "../audio-button/audio-button";
import classNames from "classnames";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  question: AudioQuestion | string;
  title: AudioQuestion | string;
  answers: string[];
  showAnswer?: boolean;
}

export const QuestionContainer: FC<Props> = ({
  question,
  title,
  answers,
  showAnswer = true,
}) => {
  const { error, answer } = useNavigationContext();

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
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
          <div className={styles.audioContainer}>
            <p className={styles.questionTitle}>
              {typeof title === "string" ? title : title.question}
            </p>
            {typeof title !== "string" && (
              <div className={styles.audioButton}>
                <AudioButton audioUrl={title.audio} />
              </div>
            )}
          </div>
          <div className={styles.answers}>
            {answers.map((answer: string, index: number) => (
              <p key={index} className={styles.answer}>
                {answer} ({index + 1})
              </p>
            ))}
          </div>
        </div>
      </div>
      {showAnswer && (
        <div className={styles.questionFooter}>
          <div className={styles.questionAnswer}>
            <p className={styles.questionAnswerText}>The answer</p>
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
            <div className={styles.questionError}>
              Select the answer and press ENTER
            </div>
          )}
        </div>
      )}
    </div>
  );
};
