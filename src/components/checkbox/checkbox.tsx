import type { FC } from "react";
import styles from "./checkbox.module.css";

interface Props {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: FC<Props> = ({ checked, label, onChange }) => {
  return (
    <label className={styles.checkboxLabel}>
      <div className={styles.checkboxContainer}>
        <input
          className={styles.checkboxInput}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          className={styles.checkboxSvg}
        >
          <path
            fill="#20487F"
            d="M15.715 30.06c1.048 0 1.715-.508 2.382-1.526l10.465-16.46c.255-.403.509-.89.509-1.356 0-.975-.848-1.59-1.737-1.59-.572 0-1.102.34-1.483.975L16.278 25.93l-4.936-6.376c-.466-.614-.975-.847-1.547-.847-.932 0-1.673.741-1.673 1.694 0 .466.19.933.508 1.335l5.91 7.33c.573.677 1.123.995 1.823.995"
          />
        </svg>
      </div>
      <span className={styles.checkboxLabelText}>{label}</span>
    </label>
  );
};
