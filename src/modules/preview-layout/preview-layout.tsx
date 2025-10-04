import { LogoHeader } from "../../components/logo-header/logo-header";
import { Decor } from "../../svg/decor";
import styles from "./preview-layout.module.css";
import { useParams } from "react-router-dom";
import { EXAM, type PreviewItem } from "../../const/exam";

export const PreviewLayout = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  const previewData: PreviewItem = EXAM[id] as PreviewItem;

  return (
    <div className={styles.previewContainer}>
      <LogoHeader />
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <img
            src={previewData.img}
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
