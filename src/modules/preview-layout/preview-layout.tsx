import { LogoHeader } from "../../components/logo-header/logo-header";
import { Decor } from "../../svg/decor";
import styles from "./preview-layout.module.css";
import { type PreviewItem } from "../../const/exam";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

export const PreviewLayout = () => {
  const { pageData, activePage } = useNavigationContext();

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
