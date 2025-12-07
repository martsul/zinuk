import { useEffect, useState, type FC } from "react";
import { PartDetails } from "../../../components/part-details/part-details";
import { QuestionContainer } from "../../../components/question-container/question-container";
import {
  ExamStorageName,
  ExamType,
  getPartsCount,
  type SimpleQuestionItem,
  type TQQuestionItem,
} from "../../../const/exam";
import { Check } from "../../../svg/check";
import { Copy } from "../../../svg/copy";
import styles from "./results-details.module.css";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";
import classNames from "classnames";
import { CrossStatus } from "../../../svg/cross-status";
import { getTitle } from "../../question-layout/question-layout.util";

const texts = {
  en: {
    correct: "Correct Answer",
    notIncluded: "The question that was not included in the exam",
    incorrect: "Incorrect answer",
    part: "Part",
    questions: "Question",
    yourAnswer: "Your answer",
  },
  "he-IL": {
    correct: "תשובה נכונה",
    notIncluded: "שאלה שלא נכללה במבחן",
    incorrect: "תשובה שגויה",
    part: "חלק",
    questions: "שאלה",
    yourAnswer: "התשובה שלך",
  },
};

interface Props {
  detailsNumber: number;
}

export const ResultsDetails: FC<Props> = ({ detailsNumber }) => {
  const { pageData } = useNavigationContext();
  const [selectedQuestion, setSelectedQuestion] = useState<
    SimpleQuestionItem | TQQuestionItem | null
  >(null);
  const [questionNumber, setQuestionNumber] = useState<number | null>(1);
  const partsCount = getPartsCount(pageData);
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );

  useEffect(() => {
    const values = Object.values(pageData);
    const firstQuestion: SimpleQuestionItem | TQQuestionItem | undefined =
      values.find((v) => {
        if (
          (v.type === ExamType.SIMPLE_QUESTION && v.part === detailsNumber) ||
          (v.type === ExamType.QUESTION_TQ && v.part === detailsNumber)
        ) {
          return true;
        }

        return false;
      }) as SimpleQuestionItem | TQQuestionItem | undefined;
    setSelectedQuestion(firstQuestion || null);
  }, [detailsNumber, pageData]);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = document.querySelector(`.${styles.all}`);
      if (el && e.target instanceof Node && el.contains(e.target)) {
        e.stopPropagation();
        el.scrollBy({ top: e.deltaY, behavior: "smooth" });
      }
    };

    document.addEventListener("wheel", handler, { passive: false });

    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.allContainer}>
        <div className={styles.all}>
          <div className={styles.help}>
            <div className={classNames(styles.helpRow, styles.correct)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>{texts[lang].correct}</span>
            </div>
            <div className={classNames(styles.helpRow, styles.warning)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>{texts[lang].notIncluded}</span>
            </div>
            <div className={classNames(styles.helpRow, styles.wrong)}>
              <div className={styles.answerSq}></div>
              <span className={styles.helpText}>{texts[lang].incorrect}</span>
            </div>
          </div>
          {[...new Array(partsCount)].map((_, i) => (
            <PartDetails
              onSelectQuestion={setSelectedQuestion}
              selectedQuestion={selectedQuestion}
              setQuestionNumber={setQuestionNumber}
              part={i + 1}
            />
          ))}
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsTitle}>
              {selectedQuestion ? getTitle(selectedQuestion) : ''},{" "}
              {texts[lang].questions} {questionNumber ? questionNumber : ""}
            </div>
            <button className={styles.copyButton}>
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
                <span>{texts[lang].correct}: </span>
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
                <span>{texts[lang].yourAnswer}:</span>
                <span className={styles.footerSq}>
                  {selectedQuestion ? results[selectedQuestion.id] : ""}
                </span>
              </div>
            </div>
            {results[selectedQuestion?.id || 0] &&
              +results[selectedQuestion?.id || 0] ===
                selectedQuestion?.correctAnswer && (
                <Check className={styles.check} />
              )}
            {results[selectedQuestion?.id || 0] &&
              +results[selectedQuestion?.id || 0] !==
                selectedQuestion?.correctAnswer && <CrossStatus />}
          </div>
        </div>
      </div>
    </div>
  );
};
