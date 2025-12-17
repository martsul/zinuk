import type { ExamDto } from "../../const/exam";

export interface NavigationContextModel {
  answer?: string;
  timer?: string;
  canContinue: boolean;
  error: boolean;
  timerIsVisible: boolean;
  pageData: ExamDto;
  activePage: null | number | "results" | string;
  modal: "question" | "answer" | null;
  setModal: React.Dispatch<React.SetStateAction<"question" | "answer" | null>>;
  navigateToNextPage: () => void;
  setTimeVariant: React.Dispatch<React.SetStateAction<"short" | "full">>
  timeVariant: "short" | "full";
}
