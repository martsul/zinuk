import { QuestionContainer } from "../../../components/question-container/question-container";
import { type SimpleQuestionItem } from "../../../const/exam";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";

export const SimpleQuestion = () => {
  const { pageData, activePage } = useNavigationContext();

  if (!activePage) {
    return null;
  }

  const questionData: SimpleQuestionItem = pageData[activePage] as SimpleQuestionItem;

  return (
    <QuestionContainer
      question={questionData.question}
      title={questionData.title}
      answers={questionData.answers}
    />
  );
};
