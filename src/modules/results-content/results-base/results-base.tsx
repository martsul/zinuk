import { useEffect } from "react";
import { PartBlock } from "../../../components/part-block/part-block";
import { getPartsCount } from "../../../const/exam";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";
import styles from "./results-base.module.css";

export const ResultsBase = ({
  openDetails,
}: {
  openDetails: (num: number) => void;
}) => {
  const { pageData } = useNavigationContext();
  const partsCount = getPartsCount(pageData);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = document.querySelector(`.${styles.wrapper}`);
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {[...new Array(partsCount)].map((_, i) => {
          return (
            <PartBlock
              openDetails={() => openDetails(i + 1)}
              key={i}
              part={i + 1}
            />
          );
        })}
      </div>
    </div>
  );
};
