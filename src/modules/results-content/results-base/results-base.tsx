import { PartBlock } from "../../../components/part-block/part-block";
import { getPartsCount } from "../../../const/exam";
import { useNavigationContext } from "../../../contexts/navigation-context/use-navigation-context";
import styles from "./results-base.module.css";

export const ResultsBase = ({ openDetails }: { openDetails: () => void }) => {
  const { pageData } = useNavigationContext();
  const partsCount = getPartsCount(pageData);

  return (
    <div className={styles.container}>
      {[...new Array(partsCount)].map((_, i) => {
        return <PartBlock openDetails={openDetails} key={i} part={i + 1} />;
      })}
    </div>
  );
};
