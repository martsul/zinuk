import { useEffect, useRef, useState, type FC } from "react";
import styles from "./part-block.module.css";
import { ExamStorageName, getPartTitle, getQuestionTypeByParts } from "../../const/exam";
import { PartItem } from "../part-item/part-item";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  part: number;
  openDetails: () => void;
}

const texts = {
  en: {
    part: "Exam Part",
    more: "For more details",
  },
  "he-IL": {
    part: "חלק במבחן",
    more: "למידע נוסף",
  },
};

export const PartBlock: FC<Props> = ({ part, openDetails }) => {
  const { pageData } = useNavigationContext();
  const lang: "en" | "he-IL" = (document.documentElement.lang || 'en') as "en" | "he-IL";
  
  const itemsRef = useRef<HTMLDivElement | null>(null);

  const [correctCount, setCorrectCount] = useState({
    correct: 0,
    total: 0,
  });

  const questionTypeByParts = getQuestionTypeByParts(pageData);
  const items: string[] = questionTypeByParts[part] || [];
  const results: Record<string, string> = JSON.parse(
    sessionStorage.getItem(ExamStorageName) || "{}"
  );

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = itemsRef.current;

      if (!el) return;

      if (e.target instanceof Node && el.contains(e.target)) {
        e.stopPropagation();
        el.scrollBy({ top: e.deltaY, behavior: "smooth" });
      }
    };

    document.addEventListener("wheel", handler, { passive: false });

    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, []);

  useEffect(() => {
    let correct = 0;
    let total = 0;
    for (const key in pageData) {
      const element = pageData[key];
      if ("correctAnswer" in element) {
        if (element.part === part && element.visible) {
          total++;
          if (element.correctAnswer === +results[element.id]) {
            correct++;
          }
        }
      }
    }
    setCorrectCount({ total, correct });
  }, [pageData, part]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          {getPartTitle(pageData, part)}
        </div>
        <div className={styles.headerText}>
          {correctCount.total > 0
            ? Math.round((correctCount.correct * 100) / correctCount.total)
            : 0
          }%
        </div>
      </div>

      <div className={styles.items} ref={itemsRef}>
        {items.map((item, i) => (
          <PartItem type={item} part={part} key={i} />
        ))}
      </div>

      <div className={styles.link} onClick={openDetails}>
        {texts[lang].more}
      </div>
    </div>
  );
};
