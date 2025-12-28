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
      <div className={styles.text}>{question.text}</div>
      <img src={question.question} alt="question" />
    </div>
  );
};
