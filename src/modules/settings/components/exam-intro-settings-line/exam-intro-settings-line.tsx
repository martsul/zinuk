import { useState, type FC } from "react";
import Button from "react-bootstrap/esm/Button";
import { Cross } from "../../../../svg/cross";
import styles from "./exam-intro-settings-line.module.css";

interface Props {
  part: number;
  texts: string[];
}

export const ExamIntroSettingsLine: FC<Props> = ({ part, texts }) => {
  const [textItems, setTextItems] = useState<string[]>(texts);

  const handleAddText = () => {
    setTextItems([...textItems, ""]);
  };

  const handleTextChange = (index: number, value: string) => {
    const newTextItems = [...textItems];
    newTextItems[index] = value;
    setTextItems(newTextItems);
  };

  return (
    <tr>
      <td>{part}</td>
      <td>
        <div className="d-flex flex-column gap-2">
          {textItems.map((text, index) => (
            <div className="position-relative" key={index}>
              <button
                className={styles.cross}
                onClick={() => {
                  const newTextItems = textItems.filter((_, i) => i !== index);
                  setTextItems(newTextItems);
                }}
              >
                <Cross />
              </button>
              <textarea
                className={styles.textarea}
                key={index}
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
              ></textarea>
            </div>
          ))}
          <Button onClick={handleAddText}>Add</Button>
        </div>
      </td>
    </tr>
  );
};
