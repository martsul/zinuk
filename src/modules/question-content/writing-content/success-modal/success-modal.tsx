import type { FC } from "react";
import styles from "./success-modal.module.css";
import { SuccessCheck } from "../../../../svg/success-check";
import { ModalWrapper } from "../../../modal-wrapper/modal-wrapper";

interface Props {
  text: string;
  open: boolean;
  close: () => void;
}

export const SuccessModal: FC<Props> = ({ text, open, close }) => {
  return (
    <ModalWrapper close={close} open={open}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <SuccessCheck />
        </div>
        <p className={styles.successText}>{text}</p>
        <button className={styles.continueButton} onClick={close}>
          להמשך
        </button>
      </div>
    </ModalWrapper>
  );
};
