import { QuestionTextContainer } from "../../../components/question-text-container/question-text-container";
import styles from "./tq-content.module.css";
import { QuestionContainer } from "../../../components/question-container/question-container";
import { type TQQuestionItem } from "../../../const/exam";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";

export const TqContent = () => {
  const { pageData, activePage } = useNavigationContext();

  if (!activePage) {
    return null
  }

  const questionData: TQQuestionItem = pageData[activePage] as TQQuestionItem;

  return (
    <div className={styles.container}>
      <QuestionTextContainer questions={questionData.questions} />
      <QuestionContainer
        question={questionData.question}
        title={questionData.title}
        answers={questionData.answers}
      />
    </div>
  );
};
