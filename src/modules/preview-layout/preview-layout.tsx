import { LogoHeader } from "../../components/logo-header/logo-header";
import { Decor } from "../../svg/decor";
import styles from "./preview-layout.module.css";
import { ExamType } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { useEffect, useState } from "react";
import previewPerson1 from "@/assets/1-preview.png";
import previewPerson2 from "@/assets/preview-2.png";
import previewPerson3 from "@/assets/preview-3.png";

const personsImg: Record<number, string> = {
  0: previewPerson1,
  1: previewPerson2,
  2: previewPerson3,
};

const previewTexts: Record<
  "en" | "he-IL",
  {
    title: Record<0 | 1 | 2, string>;
    enter: string;
  }
> = {
  en: {
    title: {
      "0": "Exam Part 1 ",
      "1": "Exam Part 2 ",
      "2": "Exam Part 3 ",
    },
    enter: "To continue, press <Enter>.",
  },
  "he-IL": {
    title: {
      "0": "מילולי",
      "1": "כמותי",
      "2": "אנגלית",
    },
    enter: "להמשך יש להקיש <Enter>",
  },
};

export const PreviewLayout = () => {
  const { pageData, activePage } = useNavigationContext();
  const [previewIndex, setPreviewIndex] = useState(0);
  const lang: "en" | "he-IL" = (document.documentElement.lang || "he-IL") as
    | "en"
    | "he-IL";

  useEffect(() => {
    setPreviewIndex(0);
    for (const key in pageData) {
      const currentItem = pageData[key];
      if (activePage == currentItem.id) {
        return;
      }

      if (currentItem.type === ExamType.PREVIEW) {
        setPreviewIndex((prev) => prev + 1);
      }
    }
  }, [activePage, pageData]);

  if (!activePage) {
    return;
  }

  const data = pageData[activePage];

  if (data.type !== ExamType.PREVIEW) {
    return;
  }

  return (
    <div className={styles.previewContainer}>
      <LogoHeader />
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <img
            src={personsImg[previewIndex] || previewPerson1}
            alt="person"
            className={styles.contentImg}
          />
          <p className={styles.contentTitle}>{data.title}</p>
        </div>
        <div className={styles.contentDecor}>
          <Decor />
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerText}>{previewTexts[lang].enter}</p>
        <div className={styles.footerDecor}>
          <Decor />
        </div>
      </div>
    </div>
  );
};
