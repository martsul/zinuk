import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactElement,
} from "react";
import { NavigationContext } from ".";
import { ExamStorageName, ExamType, type ExamDto } from "../../const/exam";
import type { AudioQuestion } from "../../models/question.models";
import { getExamDataUrl, postExamResultUrl } from "../../const/routs";
import { TimeDuration } from "../../modules/question-layout/time-add-modal/time-add-modal.model";

interface Props {
  children: ReactElement;
}

const AvailableAnswers: Set<string> = new Set([
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
]);

const Paragraphs: Record<string, number> = {
  F2: 1,
  F3: 2,
  F4: 3,
  F5: 4,
  F6: 5,
  F7: 6,
  F8: 7,
  F9: 8,
  F10: 9,
};

const formatSecondsToMMSS = (seconds: number | undefined): string => {
  if (!seconds) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return `${mm}:${ss}`;
};

declare global {
  interface Window {
    MS_TEST_ID?: string;
  }
}

export const NavigationContextProvider: FC<Props> = ({ children }) => {
  const testId: string = window.MS_TEST_ID || "1";
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const [timerIsVisible, setTimerIsVisible] = useState<boolean>(true);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [timeVariant, setTimeVariant] = useState<"short" | "full">("full");
  const [pageData, setPageData] = useState<ExamDto>({
    "1": {
      id: 1,
      type: ExamType.WRITING,
      title: "Writing Task 1",
      text: "Please write about the following topic...",
      question: "What is your opinion on this topic?",
      time: 30,
      name: "Writing Task 1",
      questionsPart: "Writing",
    },
  });
  const [activePage, setActivePage] = useState<
    null | number | "results" | string
  >("1");
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [modal, setModal] = useState<"question" | "answer" | null>(null);

  const saveResults = useCallback(() => {
    if (activePage) {
      const currentPage = pageData[activePage];
      if (
        currentPage?.type === ExamType.SIMPLE_QUESTION ||
        currentPage?.type === ExamType.QUESTION_TQ
      ) {
        const storage: Record<string, string | undefined> = JSON.parse(
          sessionStorage.getItem(ExamStorageName) || "{}"
        );
        storage[activePage] = answer;

        sessionStorage.setItem(ExamStorageName, JSON.stringify(storage));
      }
    }
  }, [activePage, pageData, answer]);

  const navigateToNextPage = useCallback(() => {
    if (activePage) {
      saveResults();
      const currentPage = pageData[activePage];
      const nextPageId: number | undefined = currentPage.next;
      if (!nextPageId) {
        setActivePage("results");
        fetch(postExamResultUrl(testId), {
          method: "POST",
          body: sessionStorage.getItem(ExamStorageName) || "{}",
        });
        return;
      }

      setActivePage(nextPageId);
      setAnswer(undefined);
    }
  }, [activePage, pageData, saveResults]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (activePage) {
        const { code, key } = event;
        const currentPage = pageData[activePage];

        if (code === "KeyO") {
          setActivePage("results");
        }

        if (code === "Enter") {
          if (modal) {
            event.preventDefault();
            setModal(null);

            return;
          }

          if (canContinue) {
            navigateToNextPage();
            setError(false);
          } else {
            setError(true);
          }
        } else if (
          AvailableAnswers.has(code) &&
          (currentPage?.type === ExamType.SIMPLE_QUESTION ||
            currentPage?.type === ExamType.QUESTION_TQ)
        ) {
          setAnswer(key);
          setCanContinue(true);
        } else if (code === "Digit5" && currentPage?.type === ExamType.PAUSE) {
          setCanContinue(true);
        } else if (code === "F1") {
          activeAudioRef.current?.play();
        } else if (code === "F11") {
          event.preventDefault();
          activeAudioRef.current?.pause();
        } else if (code === "Space") {
          navigateToNextPage();
        } else if (code === "F12") {
          event.preventDefault();
          setTimerIsVisible((prev) => !prev);
        } else if (
          Paragraphs[code] &&
          (currentPage?.type === ExamType.QUESTION_TEXT ||
            currentPage?.type === ExamType.QUESTION_TQ)
        ) {
          const questions: string[] | AudioQuestion[] = currentPage.questions;
          const number: number =
            questions.length >= Paragraphs[code]
              ? Paragraphs[code]
              : questions.length;
          const selectedQuestion: string | AudioQuestion | undefined =
            questions[number - 1];
          const questionAudioUrl: HTMLAudioElement | null =
            typeof selectedQuestion === "string"
              ? null
              : new Audio(selectedQuestion.audio);
          activeAudioRef.current = questionAudioUrl;
        }
      }
    },
    [activePage, pageData, canContinue, navigateToNextPage, modal]
  );

  useEffect(() => {
    if (activePage) {
      const currentPage = pageData[activePage];
      if (
        currentPage?.type === ExamType.QUESTION_INTRO &&
        (currentPage.questionPart === "Geometry" ||
          currentPage.questionPart === "Algebra")
      ) {
        navigateToNextPage();
      }
    }
  }, [activePage, navigateToNextPage, pageData]);

  useEffect(() => {
    if (activePage) {
      const currentPage = pageData[activePage] || {};
      if ("visible" in currentPage && !currentPage.visible) {
        navigateToNextPage();
      }
    }
  }, [activePage, navigateToNextPage, pageData]);

  useEffect(() => {
    fetch(getExamDataUrl(testId))
      .then(async (r) => {
        const data: ExamDto = await r.json();
        setPageData(data);
        setActivePage(Object.keys(data)[0]);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      navigateToNextPage();
    }
  }, [timer, navigateToNextPage]);

  useEffect(() => {
    if (activePage) {
      const currentPage = pageData[activePage];
      if (
        currentPage?.type === ExamType.PAUSE ||
        currentPage?.type === ExamType.SIMPLE_QUESTION ||
        currentPage?.type === ExamType.QUESTION_TQ ||
        currentPage?.type === ExamType.QUESTION_TEXT ||
        currentPage?.type === ExamType.WRITING
      ) {
        let time: number = currentPage.time;
        if (
          timeVariant !== "full" &&
          currentPage?.type !== ExamType.PAUSE &&
          "question_time_lightweight" in currentPage &&
          typeof currentPage.question_time_lightweight === "number"
        ) {
          time = currentPage.question_time_lightweight;
        }

        setTimer(time * 60);
        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            return typeof prev === "number" ? prev - 1 : undefined;
          });
        }, 1000);
      }
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [activePage, pageData, timeVariant]);

  useEffect(() => {
    if (activePage) {
      const currentPage = pageData[activePage];
      if (
        currentPage?.type === ExamType.PAUSE ||
        currentPage?.type === ExamType.SIMPLE_QUESTION ||
        currentPage?.type === ExamType.QUESTION_TQ
      ) {
        setCanContinue(false);
      }
    }

    return () => {
      setCanContinue(true);
    };
  }, [activePage, pageData]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);


  const addTime = (timeDuration: TimeDuration) => {
    if (timer) {
      switch (timeDuration) {
        case TimeDuration.ONE_MINUTE:
          setTimer((timer + 60));
          break;
        case TimeDuration.TWO_MINUTES:
          setTimer((timer + 120));
          break;
        case TimeDuration.THREE_MINUTES:
          setTimer((timer + 180));
          break;
      }
    }
  }

  return (
    <NavigationContext.Provider
      value={{
        canContinue,
        answer,
        error,
        timer: formatSecondsToMMSS(timer),
        timerIsVisible,
        pageData,
        activePage,
        modal,
        setModal,
        navigateToNextPage,
        setTimeVariant,
        timeVariant,
        addTime,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
