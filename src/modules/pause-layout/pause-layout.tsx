import { LogoHeader } from "../../components/logo-header/logo-header";
import { Clock } from "../../svg/clock";
import styles from "./pause-layout.module.css";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";
import type { PauseItem } from "../../const/exam";

export const PauseLayout = () => {
  const { timer, timerIsVisible, canContinue, activePage, pageData } = useNavigationContext();

  if (!activePage) {
    return;
  }

  const pauseData = pageData[activePage] as PauseItem;

  return (
    <div className={styles.pauseContainer}>
      <LogoHeader />
      <div className={styles.contentContainer}>
        <img src={pauseData.img} alt="person" className={styles.person} />
        <div className={styles.content}>
          <div className={styles.title}>Pause</div>
          {timerIsVisible && (
            <div className={styles.box}>
              <div className={styles.clock}>
                <Clock color="#30326d" />
              </div>
              <p className={styles.boxTitle}>Time remaining:</p>
              <p className={styles.boxSubtitle}>(F12 to hide the clock)</p>
              <p className={styles.boxTime}>{timer}</p>
            </div>
          )}
          <p className={styles.subBox}>
            To skip a paragraph, press the number &lt;5&gt; followed by
            &lt;Enter&gt;
          </p>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.footerText}>
          To skip a paragraph, press the number
        </span>
        <span className={styles.footerFive}>{canContinue ? "5" : ""}</span>
        <span className={styles.footerText}>followed by &lt;Enter&gt;</span>
      </div>
    </div>
  );
};
