import { useEffect, useState } from "react";
import { Loader } from "../../components/loader/loader";
import { TimeModal } from "../../components/time-modal/time-modal";
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
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    const exitFunction = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", exitFunction);

    return () => window.removeEventListener("beforeunload", exitFunction);
  });

  if (!activePage) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  const currentPageData =
    activePage === "results" ? null : pageData[activePage];

  return (
    <>
      {modalOpen && (
        <TimeModal
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}

      {activePage === "results" ? (
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
          {currentPageData?.type === ExamType.WRITING && (
            <QuestionLayout type={QuestionType.WRITING} />
          )}
          {currentPageData?.type === ExamType.QUESTION_TQ && (
            <QuestionLayout type={QuestionType.TQ} />
          )}
          {currentPageData?.type === ExamType.PAUSE && <PauseLayout />}
        </div>
      )}
    </>
  );
};
