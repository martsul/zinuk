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
  const [pageData, setPageData] = useState<ExamDto>({
    "1": {
      id: 1,
      type: "examIntro",
      img: "",
      part: 1,
      title: "הוראות כלליות",
      texts: [
        '<h3><strong>הוראות כלליות</strong></h3>\n<p>לפניכם בחינת פסיכומטרי ממוחשבת במהלכה יוצגו שאלות מפרקי הבחינה שנבחרה.</p>\n<ul>\n<li><strong>מטלת הכתיבה נעשית בנפרד לתוכנה כעת, ויש לבצע אותה לפני תחילת התרגול בזמן המוקצב לכם.</strong></li>\n<li>על מנת להזין תשובה, יש להשתמש במספרים 1-4 במקלדת עבור התשובה שלכם.</li>\n<li>לא ניתן לדלג על שאלות, חובה להזין תשובה עבור כל שאלה.</li>\n<li>בשאלות בהם ניתן קטע קריאה, קטע כתיבה או גרף יופיע הקטע או גרף בחלון חדש ולאחר מכן יופיע במסך מפוצל עם השאלה.</li>\n<li>ניתן להעלים את הזמן שנותר לשאלה על ידי לחיצה על F12.</li>\n<li>בסיום הבחינה תנתן לכם האפשרות לעבור על תוצאות הבחינה ועל כל שאלה.</li>\n</ul>\n<h3><strong>קטעי קול</strong></h3>\n<ul>\n<li>ניתן להאזין לשאלות ע&quot;י לחיצה על כפתורי השמע: <img loading="lazy" decoding="async" class=" wp-image-4679 alignnone" src="https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/11/Mask-group.png" alt="" width="37" height="37" /></li>\n<li>ניתן לעצור ולהמשיך את ההקראה בכל עת על ידי לחיצה על כפתור השמע אותו הפעלתם.</li>\n</ul>\n',
      ],
      next: 2,
    },
    "2": {
      id: 2,
      type: "preview",
      img: "<h3><strong>חשיבה מילולית</strong></h3>\n<p>בפרק זה סוגים שונים של שאלות: אנלוגיות, שאלות הבנה והסקה ושאלות הנוגעות לקטע קריאה. לכל שאלה מוצעות ארבע תשובות. עליכם לבחור את התשובה <strong>המתאימה ביותר</strong> לכל שאלה.</p>\n",
      title: "מילולי",
      part: 1,
      next: 3,
    },
    "3": {
      id: 3,
      type: "examIntro",
      img: "<h3><strong>חשיבה מילולית</strong></h3>\n<p>בפרק זה סוגים שונים של שאלות: אנלוגיות, שאלות הבנה והסקה ושאלות הנוגעות לקטע קריאה. לכל שאלה מוצעות ארבע תשובות. עליכם לבחור את התשובה <strong>המתאימה ביותר</strong> לכל שאלה.</p>\n",
      part: 1,
      title: "חשיבה מילולית",
      texts: [
        "At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.",
        "The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.",
      ],
      next: 4,
    },
    "4": {
      type: "questionIntro",
      part: 1,
      questionPart: "Analogies",
      texts:
        '<p>בכל שאלה יש זוג מילים מודגשות. מצאו את היחס בין המשמעויות של שתי המילים האלה, ובחרו מתוך התשובות המוצעות את זוג המילים שהיחס ביניהן הוא <strong>הדומה ביותר</strong> ליחס שמצאתם.</p>\n<p><strong>שימו לב:</strong> יש חשיבות לסדר המילים בזוג.</p>\n<p>הזמן המוקצב לכל שאלה הוא דקה וחצי.</p>\n<div id="gtx-trans" style="position: absolute; left: 340px; top: 8.70139px;">\n<div class="gtx-trans-icon"></div>\n</div>\n',
      title: "חשיבה מילולית - אנלוגיות",
      id: 4,
      next: 5,
    },
    "5": {
      pid: 3847,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 5,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 1 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 6,
    },
    "6": {
      pid: 3846,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 6,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 2 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 7,
    },
    "7": {
      pid: 3845,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 7,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 3 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 8,
    },
    "8": {
      pid: 3844,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 8,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 4 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 9,
    },
    "9": {
      pid: 3843,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 9,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 5 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 10,
    },
    "10": {
      pid: 3842,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 10,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 6 | מילולי | אנלוגיות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 11,
    },
    "11": {
      pid: 3835,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 11,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 31 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 12,
    },
    "12": {
      pid: 3830,
      part: 1,
      time: 1.5,
      questionsPart: "אנלוגיה",
      id: 12,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-analogies",
      title: "שאלה 36 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 13,
    },
    "13": {
      type: "questionIntro",
      part: 1,
      questionPart: "Sentence Completion",
      texts:
        '<p><span style="font-weight: 400;">בכל שאלה יש פסקה שחלק אחד או כמה חלקים ממנה חסרים. עליכם לבחור בתשובה </span><b>המתאימה ביותר</b><span style="font-weight: 400;"> להשלמת החסר.</span><span style="font-weight: 400;"><br />\n</span><span style="font-weight: 400;"><br />\n</span><span style="font-weight: 400;">הזמן המוקצב לכל שאלה הוא 3 דקות.</span></p>\n',
      title: "חשיבה מילולית - השלמת משפטים",
      id: 13,
      next: 14,
    },
    "14": {
      pid: 3841,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 14,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 7 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 15,
    },
    "15": {
      pid: 3840,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 15,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 8 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 16,
    },
    "16": {
      pid: 3839,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 16,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 9 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 17,
    },
    "17": {
      pid: 3838,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 17,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 10 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 18,
    },
    "18": {
      pid: 3837,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 18,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 11 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 19,
    },
    "19": {
      pid: 3836,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 19,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 12 | מילולי | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 20,
    },
    "20": {
      pid: 3832,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 20,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 34 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 21,
    },
    "21": {
      pid: 3831,
      part: 1,
      time: 3,
      questionsPart: "השלמת משפטים",
      id: 21,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-sentence-completion",
      title: "שאלה 35 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 22,
    },
    "22": {
      type: "questionIntro",
      part: 1,
      questionPart: "Inference",
      texts:
        '<p>השאלות הבאות הינן שאלות היגיון.</p>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n<div id="gtx-trans" style="position: absolute; left: 633px; top: 285.965px;">\n<div class="gtx-trans-icon"></div>\n</div>\n',
      title: "חשיבה מילולית - הבנה והסקה",
      id: 22,
      next: 23,
    },
    "23": {
      pid: 3865,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 23,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 13 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 24,
    },
    "24": {
      pid: 3864,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 24,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 14 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 25,
    },
    "25": {
      pid: 3863,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 25,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 15 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 26,
    },
    "26": {
      id: 26,
      type: "pause",
      img: "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/themes/generatepress/assets/img/pause-1.png",
      time: 2.5,
      next: 27,
    },
    "27": {
      pid: 3862,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 27,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 16 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 28,
    },
    "28": {
      pid: 3861,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 28,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 17 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 29,
    },
    "29": {
      pid: 3860,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 29,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 18 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 30,
    },
    "30": {
      pid: 3859,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 30,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 19 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 31,
    },
    "31": {
      pid: 3858,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 31,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 20 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 32,
    },
    "32": {
      pid: 3857,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 32,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 21 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 33,
    },
    "33": {
      pid: 3856,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 33,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 22 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 34,
    },
    "34": {
      pid: 3855,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 34,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 23 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 35,
    },
    "35": {
      pid: 3854,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 35,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 24 | מילולי | הבנה והסקה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 36,
    },
    "36": {
      pid: 3834,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 36,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 32 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 37,
    },
    "37": {
      pid: 3829,
      part: 1,
      time: 4,
      questionsPart: "הבנה והסקה",
      id: 37,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-inference",
      title: "שאלה 37 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 38,
    },
    "38": {
      type: "questionIntro",
      part: 1,
      questionPart: "Reading",
      texts:
        '<p>כעת יופיע לפניך קטע. מוקצבות לך 7 דקות לצורך קריאתו. אח&quot;כ יופיעו בחלקו התחתון של המסך שאלות הנוגעות לקטע. בחלקו העליון של המסך ימשיך הקטע להופיע, וניתן לגלול בו כדי לקרוא את כולו. בנוסף ניתן להשתמש בכפתור הצגת הקטע (<img loading="lazy" decoding="async" class="alignnone size-full wp-image-4742" src="https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/11/Group.png" alt="" width="28" height="35" />) כדי לצפות בקטע בשלמותו.</p>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n<p><strong>לתשומת לבך:</strong></p>\n<ol>\n<li>בתשובתך לכל שאלה יש להתעלם מנתונים המופיעים בשאלות אחרות.</li>\n<li>לחיצה על מקש &quot;Enter&quot; לפני תום הזמן המוקצב לעיון בקטע תביא לידי הופעה מוקדמת יותר של השאלות.</li>\n</ol>\n',
      title: "חשיבה מילולית - קטע קריאה",
      id: 38,
      next: 39,
    },
    "39": {
      pid: 3853,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 39,
      type: "questionText",
      visible: true,
      title: "שאלה 25 | מילולי | קטע קריאה",
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      next: 40,
    },
    "40": {
      pid: 3853,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 25 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 40,
      next: 41,
    },
    "41": {
      pid: 3852,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 26 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 41,
      next: 42,
    },
    "42": {
      pid: 3851,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 27 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      id: 42,
      next: 43,
    },
    "43": {
      pid: 3850,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 28 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      id: 43,
      next: 44,
    },
    "44": {
      pid: 3849,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 29 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 44,
      next: 45,
    },
    "45": {
      pid: 3848,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "verbal-reading",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 30 | מילולי | קטע קריאה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 45,
      next: 46,
    },
    "46": {
      pid: 3833,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 46,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-reading",
      title: "שאלה 33 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 47,
    },
    "47": {
      pid: 3828,
      part: 1,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 47,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "verbal-reading",
      title: "שאלה 38 | מילולי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 48,
    },
    "48": {
      id: 48,
      type: "pause",
      img: "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/themes/generatepress/assets/img/pause-1.png",
      time: 5,
      next: 49,
    },
    "49": {
      id: 49,
      type: "preview",
      img: "<h3><strong>חשיבה כמותית</strong></h3>\n<p>בפרק זה מופיעות שאלות ובעיות של חשיבה כמותית. לכל שאלה מוצעות ארבע תשובות. עליכם לבחור את התשובה הנכונה.</p>\n<ul>\n<li>בחלק זה יש להיעזר בדף הנוסחאות לפרק כמותי המסופק ע&quot;י המרכז הארצי.</li>\n</ul>\n",
      title: "כמותי",
      part: 2,
      next: 50,
    },
    "50": {
      id: 50,
      type: "examIntro",
      img: "<h3><strong>חשיבה כמותית</strong></h3>\n<p>בפרק זה מופיעות שאלות ובעיות של חשיבה כמותית. לכל שאלה מוצעות ארבע תשובות. עליכם לבחור את התשובה הנכונה.</p>\n<ul>\n<li>בחלק זה יש להיעזר בדף הנוסחאות לפרק כמותי המסופק ע&quot;י המרכז הארצי.</li>\n</ul>\n",
      part: 2,
      title: "חשיבה כמותית",
      texts: [
        "At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.",
        "The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.",
      ],
      next: 51,
    },
    "51": {
      type: "questionIntro",
      part: 2,
      questionPart: "Graphs",
      texts:
        '<p>כעת יוצג לפניך תרשים/טבלה. מוקצבות לך 5 דקות לצורך קריאתו. אח&quot;כ יופיעו בחלקו התחתון של המסך שאלות הנוגעות אליו. בחלקו העליון של המסך ימשיך התוכן להופיע, וניתן לגלול בו כדי לקרוא את כולו. בנוסף ניתן להשתמש בכפתור הצגת התוכן (<img loading="lazy" decoding="async" class="alignnone size-full wp-image-4742" src="https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/11/Group.png" alt="" width="28" height="35" />) כדי לצפות בתוכן בשלמותו.</p>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n<p><strong>לתשומת לבך:</strong></p>\n<ol>\n<li>בתשובתך לכל שאלה יש להתעלם מנתונים המופיעים בשאלות אחרות.</li>\n<li>לחיצה על מקש &quot;Enter&quot; לפני תום הזמן המוקצב לעיון בקטע תביא לידי הופעה מוקדמת יותר של השאלות.</li>\n</ol>\n<div id="gtx-trans" style="position: absolute; left: 185px; top: 99.2813px;">\n<div class="gtx-trans-icon"></div>\n</div>\n',
      title: "חשיבה כמותית - הסקה מתרשים/טבלה",
      id: 51,
      next: 52,
    },
    "52": {
      pid: 3827,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      id: 52,
      type: "questionText",
      visible: true,
      title: "שאלה 39 | כמותי | גראפים",
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      next: 53,
    },
    "53": {
      pid: 3827,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      type: "questionTQ",
      visible: true,
      name: "quantitative-graphs",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 39 | כמותי | גראפים",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      id: 53,
      next: 54,
    },
    "54": {
      pid: 3826,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      type: "questionTQ",
      visible: true,
      name: "quantitative-graphs",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 40 | כמותי | גראפים",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      id: 54,
      next: 55,
    },
    "55": {
      pid: 3825,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      type: "questionTQ",
      visible: true,
      name: "quantitative-graphs",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 41 | כמותי | גראפים",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 55,
      next: 56,
    },
    "56": {
      pid: 3824,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      type: "questionTQ",
      visible: true,
      name: "quantitative-graphs",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 42 | כמותי | גראפים",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 56,
      next: 57,
    },
    "57": {
      pid: 3794,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      id: 57,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-graphs",
      title: "שאלה 72 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 58,
    },
    "58": {
      pid: 3790,
      part: 2,
      time: 4,
      questionsPart: "הסקה מתרשים/טבלה",
      id: 58,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-graphs",
      title: "שאלה 76 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 59,
    },
    "59": {
      type: "questionIntro",
      part: 2,
      questionPart: "Problem Solving",
      texts:
        "<p>בחלק זה יופיעו שאלות ובעיות מסוגים שונים.</p>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n",
      title: "חשיבה כמותית - שאלות ובעיות",
      id: 59,
      next: 60,
    },
    "60": {
      pid: 3823,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 60,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 43 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 61,
    },
    "61": {
      pid: 3822,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 61,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 44 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 62,
    },
    "62": {
      pid: 3821,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 62,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 45 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 63,
    },
    "63": {
      pid: 3820,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 63,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 46 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 64,
    },
    "64": {
      pid: 3819,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 64,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 47 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 65,
    },
    "65": {
      pid: 3818,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 65,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 48 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 66,
    },
    "66": {
      pid: 3817,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 66,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 49 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 67,
    },
    "67": {
      pid: 3816,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 67,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 50 | כמותי | פתרון",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 68,
    },
    "68": {
      pid: 3797,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 68,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 69 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 69,
    },
    "69": {
      pid: 3793,
      part: 2,
      time: 4,
      questionsPart: "שאלות ובעיות",
      id: 69,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-problem-solving",
      title: "שאלה 73 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 70,
    },
    "70": {
      type: "questionIntro",
      part: 2,
      questionPart: "Geometry",
      texts: "",
      title: "",
      id: 70,
      next: 71,
    },
    "71": {
      pid: 3815,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 71,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 51 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 72,
    },
    "72": {
      pid: 3814,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 72,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 52 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 73,
    },
    "73": {
      pid: 3813,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 73,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 53 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 74,
    },
    "74": {
      id: 74,
      type: "pause",
      img: "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/themes/generatepress/assets/img/pause-2.png",
      time: 2.5,
      next: 75,
    },
    "75": {
      pid: 3812,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 75,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 54 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 76,
    },
    "76": {
      pid: 3811,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 76,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 55 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 77,
    },
    "77": {
      pid: 3810,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 77,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 56 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 78,
    },
    "78": {
      pid: 3809,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 78,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 57 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 79,
    },
    "79": {
      pid: 3808,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 79,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 58 | כמותי | גאומטריה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 80,
    },
    "80": {
      pid: 3796,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 80,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 70 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 81,
    },
    "81": {
      pid: 3792,
      part: 2,
      time: 4,
      questionsPart: "גאומטריה",
      id: 81,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-geometry",
      title: "שאלה 74 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 82,
    },
    "82": {
      type: "questionIntro",
      part: 2,
      questionPart: "Algebra",
      texts: "",
      title: "",
      id: 82,
      next: 83,
    },
    "83": {
      pid: 3807,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 83,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 59 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 84,
    },
    "84": {
      pid: 3806,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 84,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 60 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 85,
    },
    "85": {
      pid: 3805,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 85,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 61 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 86,
    },
    "86": {
      pid: 3804,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 86,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 62 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 87,
    },
    "87": {
      pid: 3803,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 87,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 63 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 88,
    },
    "88": {
      pid: 3802,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 88,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 64 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 89,
    },
    "89": {
      pid: 3801,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 89,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 65 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 90,
    },
    "90": {
      pid: 3800,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 90,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 66 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 91,
    },
    "91": {
      pid: 3799,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 91,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 67 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 92,
    },
    "92": {
      pid: 3798,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 92,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 68 | כמותי | אלגברה",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 93,
    },
    "93": {
      pid: 3795,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 93,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 71 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 94,
    },
    "94": {
      pid: 3791,
      part: 2,
      time: 4,
      questionsPart: "אלגברה",
      id: 94,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "quantitative-algebra",
      title: "שאלה 75 | כמותי | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 95,
    },
    "95": {
      id: 95,
      type: "pause",
      img: "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/themes/generatepress/assets/img/pause-2.png",
      time: 5,
      next: 96,
    },
    "96": {
      id: 96,
      type: "preview",
      img: '<h3 style="direction: ltr;"><strong>ENGLISH</strong></h3>\n<div style="direction: ltr;">The following section contains three types of questions: Sentence Completion, Restatements, and Reading Comprehension. Each question is followed by four possible responses. Choose the response <strong>which best answers the question</strong>.</div>\n',
      title: "אנגלית",
      part: 3,
      next: 97,
    },
    "97": {
      id: 97,
      type: "examIntro",
      img: '<h3 style="direction: ltr;"><strong>ENGLISH</strong></h3>\n<div style="direction: ltr;">The following section contains three types of questions: Sentence Completion, Restatements, and Reading Comprehension. Each question is followed by four possible responses. Choose the response <strong>which best answers the question</strong>.</div>\n',
      part: 3,
      title: "ENGLISH",
      texts: [
        "At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.",
        "The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.",
      ],
      next: 98,
    },
    "98": {
      type: "questionIntro",
      part: 3,
      questionPart: "Sentence Completion",
      texts:
        '<div style="direction: ltr;">This part consists of sentences with a word or words missing in each. For each question, choose the answer which best completes the sentence.</div>\n<p>הזמן המוקצב לכל שאלה הוא 2 דקות.</p>\n',
      title: "ENGLISH - Sentence Completions",
      id: 98,
      next: 99,
    },
    "99": {
      pid: 3789,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 99,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 77 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 100,
    },
    "100": {
      pid: 3788,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 100,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 78 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 101,
    },
    "101": {
      pid: 3787,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 101,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 79 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 102,
    },
    "102": {
      pid: 3786,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 102,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 80 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 103,
    },
    "103": {
      pid: 3785,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 103,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 81 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 104,
    },
    "104": {
      pid: 3784,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 104,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 82 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 105,
    },
    "105": {
      pid: 3783,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 105,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 83 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 106,
    },
    "106": {
      pid: 3782,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 106,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 84 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 107,
    },
    "107": {
      pid: 3781,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 107,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 85 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 108,
    },
    "108": {
      pid: 3780,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 108,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 86 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 109,
    },
    "109": {
      pid: 3779,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 109,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 87 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 110,
    },
    "110": {
      pid: 3778,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 110,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 88 | אנגלית | השלמת משפט",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 111,
    },
    "111": {
      pid: 3758,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 111,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 108 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 112,
    },
    "112": {
      pid: 3755,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 112,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 111 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 113,
    },
    "113": {
      pid: 3752,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 113,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 114 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 114,
    },
    "114": {
      pid: 3749,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 114,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 117 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 115,
    },
    "115": {
      pid: 3746,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 115,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 120 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 116,
    },
    "116": {
      pid: 3743,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 116,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 123 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 117,
    },
    "117": {
      pid: 3740,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 117,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 126 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 118,
    },
    "118": {
      pid: 3737,
      part: 3,
      time: 2,
      questionsPart: "השלמת משפטים",
      id: 118,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-sentence-completion",
      title: "שאלה 129 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 119,
    },
    "119": {
      type: "questionIntro",
      part: 3,
      questionPart: "Restatements",
      texts:
        '<div style="direction: ltr;">\n<p>This part consists of several sentences, each followed by four possible ways of restating the main idea of that sentence in different words. For each question, choose the one restatement <strong>which best expresses the meaning of the original sentence.</strong></p>\n</div>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n',
      title: "ENGLISH - Restatements",
      id: 119,
      next: 120,
    },
    "120": {
      pid: 3777,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 120,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 89 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 121,
    },
    "121": {
      pid: 3776,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 121,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 90 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 122,
    },
    "122": {
      pid: 3775,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 122,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 91 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 123,
    },
    "123": {
      pid: 3774,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 123,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 92 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 124,
    },
    "124": {
      pid: 3773,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 124,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 93 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 125,
    },
    "125": {
      pid: 3772,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 125,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 94 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 126,
    },
    "126": {
      pid: 3771,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 126,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 95 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 127,
    },
    "127": {
      id: 127,
      type: "pause",
      img: "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/themes/generatepress/assets/img/pause-3.png",
      time: 2.5,
      next: 128,
    },
    "128": {
      pid: 3770,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 128,
      type: "simpleQuestion",
      visible: true,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 96 | אנגלית | החלפות",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 129,
    },
    "129": {
      pid: 3759,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 129,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 107 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 130,
    },
    "130": {
      pid: 3756,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 130,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 110 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 131,
    },
    "131": {
      pid: 3753,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 131,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 113 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 132,
    },
    "132": {
      pid: 3750,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 132,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 116 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 133,
    },
    "133": {
      pid: 3747,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 133,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 119 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 134,
    },
    "134": {
      pid: 3744,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 134,
      type: "questionText",
      visible: false,
      title: "שאלה 122 | אנגלית | מוסתר",
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      next: 135,
    },
    "135": {
      pid: 3744,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      type: "questionTQ",
      visible: false,
      name: "english-restatements",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 122 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 135,
      next: 136,
    },
    "136": {
      pid: 3741,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 136,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 125 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 137,
    },
    "137": {
      pid: 3738,
      part: 3,
      time: 4,
      questionsPart: "ניסוח מחדש",
      id: 137,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-restatements",
      title: "שאלה 128 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 138,
    },
    "138": {
      type: "questionIntro",
      part: 3,
      questionPart: "Reading Comprehension",
      texts:
        '<div style="direction: ltr;">\n<p>This part consists of two passages, each followed by several related questions. For each question, <strong>choose the most appropriate answer based on the text.</strong></p>\n</div>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n<p>הזמן המוקצב לקריאת הקטע הוא 7 דקות. אח&quot;כ יופיעו בחלקו התחתון של המסך שאלות הנוגעות אליו. בחלקו העליון של המסך ימשיך התוכן להופיע, וניתן לגלול בו כדי לקרוא את כולו. בנוסף ניתן להשתמש בכפתור הצגת הקטע (<img loading="lazy" decoding="async" class="alignnone size-full wp-image-4742" src="https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/11/Group.png" alt="" width="28" height="35" />) כדי לצפות בקטע בשלמותו.</p>\n<p>הזמן המוקצב לכל שאלה הוא 4 דקות.</p>\n<p><strong>לתשומת לבך:</strong></p>\n<ol>\n<li>בתשובתך לכל שאלה יש להתעלם מנתונים המופיעים בשאלות אחרות.</li>\n<li>לחיצה על מקש &quot;Enter&quot; לפני תום הזמן המוקצב לעיון בקטע תביא לידי הופעה מוקדמת יותר של השאלות.</li>\n</ol>\n<div id="gtx-trans" style="position: absolute; left: 652px; top: 328.656px;">\n<div class="gtx-trans-icon"></div>\n</div>\n',
      title: "ENGLISH - Reading Comprehension",
      id: 138,
      next: 139,
    },
    "139": {
      pid: 3769,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 139,
      type: "questionText",
      visible: true,
      title: "שאלה 97 | אנגלית | הבנת הנקרא",
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      next: 140,
    },
    "140": {
      pid: 3769,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 97 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 140,
      next: 141,
    },
    "141": {
      pid: 3768,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 98 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 141,
      next: 142,
    },
    "142": {
      pid: 3767,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 99 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      id: 142,
      next: 143,
    },
    "143": {
      pid: 3766,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 100 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      id: 143,
      next: 144,
    },
    "144": {
      pid: 3765,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 101 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 144,
      next: 145,
    },
    "145": {
      pid: 3764,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 102 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 145,
      next: 146,
    },
    "146": {
      pid: 3763,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 103 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      id: 146,
      next: 147,
    },
    "147": {
      pid: 3762,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 104 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      id: 147,
      next: 148,
    },
    "148": {
      pid: 3761,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 105 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      id: 148,
      next: 149,
    },
    "149": {
      pid: 3760,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      type: "questionTQ",
      visible: true,
      name: "english-reading-comprehension",
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      questions: [
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
        {
          question:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he-1-e1762431648345.jpg",
          audio:
            "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
        },
      ],
      title: "שאלה 106 | אנגלית | הבנת הנקרא",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      id: 149,
      next: 150,
    },
    "150": {
      pid: 3757,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 150,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 109 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 151,
    },
    "151": {
      pid: 3754,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 151,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 112 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 152,
    },
    "152": {
      pid: 3751,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 152,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 115 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 153,
    },
    "153": {
      pid: 3748,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 153,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 118 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
      next: 154,
    },
    "154": {
      pid: 3745,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 154,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 121 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 1,
      next: 155,
    },
    "155": {
      pid: 3742,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 155,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 124 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 4,
      next: 156,
    },
    "156": {
      pid: 3739,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 156,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 127 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 3,
      next: 157,
    },
    "157": {
      pid: 3736,
      part: 3,
      time: 4,
      questionsPart: "קטע קריאה",
      id: 157,
      type: "simpleQuestion",
      visible: false,
      question: {
        question:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_p_he.jpg",
        audio:
          "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/q_audio_en.mp3",
      },
      name: "english-reading-comprehension",
      title: "שאלה 130 | אנגלית | מוסתר",
      answers: [
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_options_he-1-e1762430711228.jpg",
        "https://wordpress-1063351-5886060.cloudwaysapps.com/wp-content/uploads/2025/10/a_audio_en.mp3",
      ],
      correctAnswer: 2,
    },
  });
  const [activePage, setActivePage] = useState<
    null | number | "results" | string
  >(1);
  const intervalRef = useRef<number | undefined>(undefined);
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
        currentPage?.type === ExamType.QUESTION_TEXT
      ) {
        setTimer(currentPage.time * 60);
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
  }, [activePage, pageData]);

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
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
