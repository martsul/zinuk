import type { FC } from "react";
import { Cross } from "../../svg/cross";
import styles from "./time-modal.module.css";
import { Secret } from "../../svg/secret";
import { useNavigationContext } from "../../contexts/navigation-context/use-navigation-context";

interface Props {
  onClose: () => void;
}

export const TimeModal: FC<Props> = ({ onClose }) => {
  const { setTimeVariant } = useNavigationContext();

  return (
    <div
      className={styles.modal}
    >
      <div className={styles.modalWrapper}>
        <button onClick={onClose} className={styles.cross}>
          <Cross />
        </button>
        <div className={styles.content}>
          <Secret />
          <h3 className={styles.title}>האם את.ה זכאי.ת להקראה באנגלית?</h3>
          <p className={styles.subTitle}>
            סימון "כן" יקנה הארכת זמן נוספת בחלק האנגלית כפי שנהוג בבחינת המפע"ם
          </p>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                setTimeVariant("short");
                onClose();
              }}
              className={styles.yes}
            >
              כן
            </button>
            <button
              onClick={() => {
                setTimeVariant("full");
                onClose();
              }}
              className={styles.no}
            >
              לא
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
