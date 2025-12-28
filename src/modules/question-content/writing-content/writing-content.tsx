import { useEffect, useState } from "react";
import { WritingContentQuestion } from "./writing-content-question/writing-content-question";
import { WritingContentAnswer } from "./writing-content-answer/writing-content-answer";
import styles from "./writing-content.module.css"
import classNames from "classnames";

enum WritingStep {
  QUESTION = "question",
  ANSWER = "answer",
}

export const WritingContent = () => {
  const [currentStep, setCurrentStep] = useState<WritingStep>(
    WritingStep.QUESTION
  );

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.code === "Enter" && currentStep === WritingStep.QUESTION) {
        event.stopImmediatePropagation();
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
