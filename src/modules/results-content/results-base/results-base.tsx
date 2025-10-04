import { PartBlock } from "../../../components/part-block/part-block";
import { PartsCount } from "../../../const/exam";
import styles from "./results-base.module.css";



export const ResultsBase = () => {
  return (
    <div className={styles.container}>
      {[...new Array(PartsCount)].map((_, i) => {
        return <PartBlock key={i} part={i + 1} />;
      })}
    </div>
  );
};
