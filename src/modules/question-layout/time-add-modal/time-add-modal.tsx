import { useState, type FC } from "react";
import { ModalWrapper } from "../../modal-wrapper/modal-wrapper";
import { Checkbox } from "../../../components/checkbox/checkbox";
import styles from "./time-add-modal.module.css";
import { TimeDuration } from "./time-add-modal.model";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeAddModal: FC<Props> = ({ isOpen, onClose }) => {
  const { addTime } = useNavigationContext();
  const [selectedTime, setSelectedTime] = useState<TimeDuration | null>(null);

  const close = () => {
    setSelectedTime(null);
    onClose();
  };

  const confirm = () => {
    if (selectedTime) {
      addTime(selectedTime);
      setSelectedTime(null);
      close();
    }
  };

  return (
    <ModalWrapper open={isOpen} close={close}>
      <div className={styles.content}>
        <div className={styles.title}>כמה דקות ברצונך להוסיף?</div>
        <div className={styles.checkboxGroup}>
          <Checkbox
            label="דקה אחת"
            checked={selectedTime === TimeDuration.ONE_MINUTE}
            onChange={() => setSelectedTime(TimeDuration.ONE_MINUTE)}
          />
          <Checkbox
            label="שתי דקות"
            checked={selectedTime === TimeDuration.TWO_MINUTES}
            onChange={() => setSelectedTime(TimeDuration.TWO_MINUTES)}
          />
          <Checkbox
            label="שלוש דקות"
            checked={selectedTime === TimeDuration.THREE_MINUTES}
            onChange={() => setSelectedTime(TimeDuration.THREE_MINUTES)}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={close}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            לסגור
          </button>
          <button
            disabled={!selectedTime}
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={confirm}
          >
            להוסיף
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
