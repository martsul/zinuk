import type { FC } from "react";
import type { AudioQuestion } from "../../models/question.models";
import styles from "./question-text-container.module.css";
import { AudioButton } from "../audio-button/audio-button";

interface Props {
  questions: (AudioQuestion | string)[];
}

export const QuestionTextContainer: FC<Props> = ({ questions }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {questions.map((question, index) => {
          const questionUrl: string =
            typeof question === "string" ? question : question.question;
          const audio: string | undefined =
            typeof question === "string" ? undefined : question.audio;

          return (
            <div key={index} className={styles.questionContainer}>
              <div className={styles.imgContainer}>
                <img src={questionUrl} alt="question" className={styles.img} />
              </div>
              {audio && (
                <div className={styles.audio}>
                  <AudioButton audioUrl={audio} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
