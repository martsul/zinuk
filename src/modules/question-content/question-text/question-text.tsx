import { useParams } from "react-router-dom";
import { QuestionTextContainer } from "../../../components/question-text-container/question-text-container";
import { EXAM, type TextQuestionItem } from "../../../const/exam";

export const QuestionText = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  const questionData: TextQuestionItem = EXAM[id] as TextQuestionItem;

  return <QuestionTextContainer questions={questionData.questions} />;
};
