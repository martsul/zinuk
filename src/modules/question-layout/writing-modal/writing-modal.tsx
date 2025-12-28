import { type FC } from "react";
import { ModalWrapper } from "../../modal-wrapper/modal-wrapper";
import { WritingContentQuestion } from "../../question-content/writing-content/writing-content-question/writing-content-question";
import styles from "./writing-modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WritingModal: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper open={isOpen} close={onClose}>
      <div className={styles.writingModalContent}>
        <div className={styles.writingModalQuestion}>
          <WritingContentQuestion />
        </div>
        <button className={styles.writingModalCloseButton} onClick={onClose}>לסגור</button>
        <div className={styles.writingModalInstructions}>או לחצו &lt;Enter&gt; כדי לצאת</div>
      </div>
    </ModalWrapper>
  );
};
