import { QuestionContainer } from "../../../components/question-container/question-container";
import { useParams } from "react-router-dom";
import { EXAM, type SimpleQuestionItem } from "../../../const/exam";

export const SimpleQuestion = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  const questionData: SimpleQuestionItem = EXAM[id] as SimpleQuestionItem;

  return (
    <QuestionContainer
      question={questionData.question}
      title={questionData.title}
      answers={questionData.answers}
    />
  );
};
