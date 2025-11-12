import { useEffect, type FC } from "react";
import styles from "./modal.module.css";
import { Cross } from "../../svg/cross";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const text = {
  en: {
    close: "Close",
    enter: "or press <Enter> to exit",
  },
  "he-IL": {
    close: "לסגור",
    enter: "או לחצו <Enter> כדי לצאת",
  },
};

export const Modal: FC<Props> = ({ children, onClose }) => {
  const lang: "en" | "he-IL" = (document.documentElement.lang || "en") as
    | "en"
    | "he-IL";

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = document.querySelector(`.${styles.content}`);
      if (el && e.target instanceof Node && el.contains(e.target)) {
        e.stopPropagation();
        el.scrollBy({ top: e.deltaY, behavior: "smooth" });
      }
    };

    document.addEventListener("wheel", handler, { passive: false });

    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, []);

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
      <div className={styles.modalWrapper}>
        <div className={styles.content}>{children}</div>
        <button onClick={() => onClose()} className={styles.close}>
          {text[lang].close}
        </button>
        <p className={styles.enter}>{text[lang].enter}</p>
      </div>
    </div>
  );
};
