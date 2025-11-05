import { useEffect, useState } from "react";
import { PartDetails } from "../../../components/part-details/part-details";
import { QuestionContainer } from "../../../components/question-container/question-container";
import {
  ExamStorageName,
  getPartsCount,
  type SimpleQuestionItem,
  type TQQuestionItem,
} from "../../../const/exam";
import { Check } from "../../../svg/check";
import { Copy } from "../../../svg/copy";
import styles from "./results-details.module.css";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";
import classNames from "classnames";

export const ResultsDetails = () => {
  const { pageData } = useNavigationContext();
  const [selectedQuestion, setSelectedQuestion] = useState<
    SimpleQuestionItem | TQQuestionItem | null
  >(null);
  const [questionNumber, setQuestionNumber] = useState<number | null>(null);
  const partsCount = getPartsCount(pageData);
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );

  useEffect(() => {
    document.addEventListener(
      "wheel",
      (e) => {
        const el = document.querySelector(`.${styles.all}`);
        if (el && e.target instanceof Node && el.contains(e.target)) {
          e.stopPropagation();
          el.scrollTop += e.deltaY;
        }
      },
      { passive: false }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.allContainer}>
        <div className={styles.all}>
          {[...new Array(partsCount)].map((_, i) => (
            <PartDetails
              onSelectQuestion={setSelectedQuestion}
              selectedQuestion={selectedQuestion}
              setQuestionNumber={setQuestionNumber}
              part={i + 1}
            />
          ))}
          <div className={styles.help}>
            <div className={classNames(styles.helpRow, styles.correct)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>Correct Answer</span>
            </div>
            <div className={classNames(styles.helpRow, styles.warning)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>
                The question that was not included in the exam
              </span>
            </div>
            <div className={classNames(styles.helpRow, styles.wrong)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>Incorrect answer</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsTitle}>
              Part {selectedQuestion?.part}, Question{" "}
              {questionNumber ? questionNumber : ""}
            </div>
            <button>
              <Copy />
            </button>
          </div>
          <div className={styles.content}>
            {selectedQuestion && (
              <QuestionContainer
                question={selectedQuestion.question}
                answers={selectedQuestion.answers}
                showAnswer={false}
              />
            )}
          </div>
          <div className={styles.detailsFooter}>
            <div className={styles.footerTexts}>
              <div className={styles.footerText}>
                <span>Correct Answer: </span>
                <span className={styles.footerSq}>
                  {selectedQuestion?.id &&
                  "correctAnswer" in pageData[selectedQuestion.id] ? (
                    <>
                      {
                        (
                          pageData[selectedQuestion.id] as
                            | SimpleQuestionItem
                            | TQQuestionItem
                        ).correctAnswer
                      }
                    </>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <div className={styles.footerText}>
                <span>Your answer:</span>
                <span className={styles.footerSq}>
                  {selectedQuestion ? results[selectedQuestion.id] : ""}
                </span>
              </div>
            </div>
            <Check className={styles.check} />
          </div>
        </div>
      </div>
    </div>
  );
};
