import { useState, type FC } from "react";
import { type IntroItem } from "../../../../const/exam";
import { Cross } from "../../../../svg/cross";
import styles from "./question-into-settings-line.module.css";
import { Button } from "react-bootstrap";

interface Props {
  intro: IntroItem;
}

export const QuestionIntroSettingsLine: FC<Props> = ({ intro }) => {
  const [textItems, setTextItems] = useState<string[]>(intro.texts);

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
      <td>{intro.part}</td>
      <td>{intro.questionPart}</td>
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
