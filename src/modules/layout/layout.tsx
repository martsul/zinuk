import { Loader } from "../../components/loader/loader";
import { ExamType } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { IntroLayout } from "../intro-layout/intro-layout";
import { IntroType } from "../intro-layout/intro-layout.const";
import { PauseLayout } from "../pause-layout/pause-layout";
import { PreviewLayout } from "../preview-layout/preview-layout";
import { QuestionLayout } from "../question-layout/question-layout";
import { QuestionType } from "../question-layout/question-layout.const";
import { ResultsLayout } from "../results-layout/results-layout";
import styles from "./layout.module.css";

export const Layout = () => {
  const { activePage, pageData } = useNavigationContext();

  if (!activePage) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  const currentPageData =
    activePage === "results" ? null : pageData[activePage];

  return activePage === "results" ? (
    <ResultsLayout />
  ) : (
    <div className={styles.container}>
      {currentPageData?.type === ExamType.PREVIEW && <PreviewLayout />}
      {currentPageData?.type === ExamType.EXAM_INTRO && (
        <IntroLayout type={IntroType.EXAM} />
      )}
      {currentPageData?.type === ExamType.QUESTION_INTRO && (
        <IntroLayout type={IntroType.QUESTION} />
      )}
      {currentPageData?.type === ExamType.SIMPLE_QUESTION && (
        <QuestionLayout type={QuestionType.SIMPLE} />
      )}
      {currentPageData?.type === ExamType.QUESTION_TEXT && (
        <QuestionLayout type={QuestionType.TEXT} />
      )}
      {currentPageData?.type === ExamType.QUESTION_TQ && (
        <QuestionLayout type={QuestionType.TQ} />
      )}
      {currentPageData?.type === ExamType.PAUSE && <PauseLayout />}
    </div>
  );
};
