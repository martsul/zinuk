import type { ExamDto } from "../../const/exam";

export interface NavigationContextModel {
  answer?: string;
  timer?: string;
  canContinue: boolean;
  error: boolean;
  timerIsVisible: boolean;
  pageData: ExamDto;
  activePage: null | number | "results" | string;
}
