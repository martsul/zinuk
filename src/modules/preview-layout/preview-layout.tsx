import { LogoHeader } from "../../components/logo-header/logo-header";
import { Decor } from "../../svg/decor";
import styles from "./preview-layout.module.css";
import { ExamType, type PreviewItem } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import { useEffect, useState } from "react";
import previewPerson1 from "@/assets/1-preview.png";
import previewPerson2 from "@/assets/preview-2.png";
import previewPerson3 from "@/assets/preview-3.png";

const personsImg: Record<number, string> = {
  0: previewPerson1,
  1: previewPerson2,
  2: previewPerson3,
}

export const PreviewLayout = () => {
  const { pageData, activePage } = useNavigationContext();
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    for (const key in pageData) {
      const currentItem = pageData[key];
      if (activePage === currentItem.id) {
        return;
      }

      if (currentItem.type === ExamType.PREVIEW) {
        setPreviewIndex((prev) => prev + 1)
      }
    }

  }, [activePage, pageData])

  if (!activePage) {
    return;
  }

  const previewData: PreviewItem = pageData[activePage] as PreviewItem;

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
          <p className={styles.contentTitle}>{previewData.title}</p>
        </div>
        <div className={styles.contentDecor}>
          <Decor />
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerText}>To continue, press &lt;Enter&gt;.</p>
        <div className={styles.footerDecor}>
          <Decor />
        </div>
      </div>
    </div>
  );
};
