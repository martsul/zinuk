import type { FC, ReactElement } from "react";
import Logo from "../../assets/logo.png";
import styles from "./logo-header.module.css";

interface Props {
  children?: ReactElement;
}

export const LogoHeader: FC<Props> = ({ children }) => {
  return (
    <div className={styles.logoHeader}>
      {children}
      <svg
        className={styles.trig}
        xmlns="http://www.w3.org/2000/svg"
        width="390"
        height="184"
        fill="none"
        viewBox="0 0 390 184"
      >
        <path fill="#fff" d="m.222-.807 394.385 184.786V-.807z"></path>
      </svg>
      <div className={styles.logoContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="146"
          height="132"
          fill="none"
          viewBox="0 0 146 132"
        >
          <ellipse
            cx="73"
            cy="66"
            fill="#fff"
            rx="73"
            ry="66"
            transform="matrix(-1 0 0 1 146 0)"
          ></ellipse>
        </svg>
        <img className={styles.logo} src={Logo} alt="logo" />
      </div>
    </div>
  );
};
