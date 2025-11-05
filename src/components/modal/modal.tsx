import type { FC } from "react";
import styles from "./modal.module.css";
import { Cross } from "../../svg/cross";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ children, onClose }) => {
  return (
    <div
      className={styles.modal}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(`.${styles.modalWrapper}`)) {
          onClose();
        }
      }}
    >
      <button onClick={onClose} className={styles.cross}>
        <Cross />
      </button>
      <div className={styles.modalWrapper}>{children}</div>
    </div>
  );
};
