import { QuestionTextContainer } from "../../../components/question-text-container/question-text-container";
import { type TextQuestionItem } from "../../../const/exam";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";

export const QuestionText = () => {
  const { pageData, activePage } = useNavigationContext();

  if (activePage === null) {
    return null;
  }

  const questionData: TextQuestionItem = pageData[activePage] as TextQuestionItem;

  return <QuestionTextContainer questions={questionData.questions} />;
};
