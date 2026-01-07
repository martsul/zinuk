import { AudioButton } from "../../../../components/audio-button/audio-button";
import { ltrQuestions } from "../../../../components/question-container/question-container.model";
import type { Writing } from "../../../../const/exam";
import { useNavigationContext } from "../../../../contexts/navigation-context/use-navigation-context";
import styles from "./writing-content-question.module.css";

export const WritingContentQuestion = () => {
  const { pageData, activePage } = useNavigationContext();

  if (!activePage) {
    return null;
  }

  const question: Writing = pageData[activePage] as Writing;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{question.title}</div>
      <div
        dangerouslySetInnerHTML={{
          __html: question.text,
        }}
        className={styles.text}
      ></div>
      <div className={styles.audioContainer}>
        {question.question.question && (
          <div className={styles.questionImgContainer}>
            <img
              src={question.question.question}
              alt="question"
              className={styles.questionImg}
            />
          </div>
        )}

        {question.question.audio && (
          <div className={styles.audioButton}>
            <AudioButton
              ltr={ltrQuestions.has(question?.name)}
              audioUrl={question.question.audio}
            />
          </div>
        )}
      </div>
    </div>
  );
};
