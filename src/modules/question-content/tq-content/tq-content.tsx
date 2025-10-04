import { QuestionTextContainer } from "../../../components/question-text-container/question-text-container";
import styles from "./tq-content.module.css";
import { QuestionContainer } from "../../../components/question-container/question-container";
import { useParams } from "react-router-dom";
import { EXAM, type TQQuestionItem } from "../../../const/exam";

export const TqContent = () => {
  const { id } = useParams();

  if (!id) {
    return null
  }

  const questionData: TQQuestionItem = EXAM[id] as TQQuestionItem;

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
