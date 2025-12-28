import type { FC } from "react";
import styles from "./modal-wrapper.module.css";
import classNames from "classnames";
import { Cross } from "../../svg/cross";

interface Props {
  close: () => void;
  open: boolean;
  children: React.ReactNode;
}

export const ModalWrapper: FC<Props> = ({ close, open, children }) => {
  return (
    <div className={classNames(styles.container, { [styles.open]: open })}>
      <div className={styles.content}>
        <>
          <button onClick={close} className={styles.closeButton}>
            <Cross />
          </button>
          {children}
        </>
      </div>
    </div>
  );
};
