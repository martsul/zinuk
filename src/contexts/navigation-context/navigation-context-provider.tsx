import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactElement,
} from "react";
import { NavigationContext } from ".";
import { useNavigate, useParams } from "react-router-dom";
import { EXAM, ExamStorageName, ExamType } from "../../const/exam";
import { ExamTypeRoute, RouterUrl } from "../../const/router";
import type { AudioQuestion } from "../../models/question.models";

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

export const NavigationContextProvider: FC<Props> = ({ children }) => {
  const { id } = useParams();
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const [timerIsVisible, setTimerIsVisible] = useState<boolean>(true);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const intervalRef = useRef<number | undefined>(undefined);

  const saveResults = useCallback(() => {
    if (id) {
      const pageData = EXAM[id];
      if (
        pageData.type === ExamType.SIMPLE_QUESTION ||
        pageData.type === ExamType.QUESTION_TQ
      ) {
        const storage: Record<string, string | undefined> = JSON.parse(
          sessionStorage.getItem(ExamStorageName) || "{}"
        );
        storage[id] = answer;

        sessionStorage.setItem(ExamStorageName, JSON.stringify(storage));
      }
    }
  }, [answer, id]);

  const navigateToNextPage = useCallback(() => {
    if (id) {
      saveResults();
      const pageData = EXAM[id];
      const nextPageId: number | undefined = pageData.next;
      if (!nextPageId) {
        navigate(`/${RouterUrl.RESULTS}`);
        return;
      }

      const nextPageData = EXAM[nextPageId];
      const nextPageUrl: string = ExamTypeRoute[nextPageData.type];
      setAnswer(undefined);
      navigate(`/${nextPageUrl}/${nextPageId}`);
    }
  }, [id, navigate, saveResults]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (id) {
        const { code, key } = event;
        const pageData = EXAM[id];

        if (code === "Enter") {
          if (canContinue) {
            navigateToNextPage();
            setError(false);
          } else {
            setError(true);
          }
        } else if (
          AvailableAnswers.has(code) &&
          (pageData.type === ExamType.SIMPLE_QUESTION ||
            pageData.type === ExamType.QUESTION_TQ)
        ) {
          setAnswer(key);
          setCanContinue(true);
        } else if (code === "Digit5" && pageData.type === ExamType.PAUSE) {
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
          (pageData.type === ExamType.QUESTION_TEXT ||
            pageData.type === ExamType.QUESTION_TQ)
        ) {
          const questions: string[] | AudioQuestion[] = pageData.questions;
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
    [canContinue, id, navigateToNextPage]
  );

  useEffect(() => {
    if (timer === 0) {
      navigateToNextPage();
    }
  }, [timer, navigateToNextPage]);

  useEffect(() => {
    if (id) {
      const pageData = EXAM[id];
      if (
        pageData.type === ExamType.PAUSE ||
        pageData.type === ExamType.SIMPLE_QUESTION ||
        pageData.type === ExamType.QUESTION_TQ ||
        pageData.type === ExamType.QUESTION_TEXT
      ) {
        setTimer(pageData.time * 60);
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
  }, [id]);

  useEffect(() => {
    if (id) {
      const pageData = EXAM[id];
      if (
        pageData.type === ExamType.PAUSE ||
        pageData.type === ExamType.SIMPLE_QUESTION ||
        pageData.type === ExamType.QUESTION_TQ
      ) {
        setCanContinue(false);
      }
    }

    return () => {
      setCanContinue(true);
    };
  }, [id]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <NavigationContext.Provider
      value={{
        canContinue,
        answer,
        error,
        timer: formatSecondsToMMSS(timer),
        timerIsVisible,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
