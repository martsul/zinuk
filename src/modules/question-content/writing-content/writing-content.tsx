import { useEffect, useState } from "react";
import { WritingContentQuestion } from "./writing-content-question/writing-content-question";
import { WritingContentAnswer } from "./writing-content-answer/writing-content-answer";
import styles from "./writing-content.module.css"
import classNames from "classnames";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";

enum WritingStep {
  QUESTION = "question",
  ANSWER = "answer",
}

export const WritingContent = () => {
  const { setCanContinue } = useNavigationContext();
  const [currentStep, setCurrentStep] = useState<WritingStep>(
    WritingStep.QUESTION
  );

  useEffect(() => {
    setCanContinue(currentStep === WritingStep.ANSWER);
  }, [currentStep, setCanContinue])

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        setCurrentStep(WritingStep.ANSWER);
      }
    };

    document.addEventListener("keydown", handle);

    return () => {
      document.removeEventListener("keydown", handle);
    };
  }, [currentStep]);

  return (
    <div className={classNames(styles.writingContent, [styles[currentStep]])}>
      {currentStep === WritingStep.QUESTION ? (
        <WritingContentQuestion />
      ) : (
        <WritingContentAnswer />
      )}
    </div>
  );
};
