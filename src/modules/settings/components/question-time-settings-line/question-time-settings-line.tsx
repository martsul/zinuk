import { useState, type FC } from "react";
import type { SimpleQuestionItem, TQQuestionItem } from "../../../../const/exam";

interface Props {
  question: SimpleQuestionItem | TQQuestionItem
}

export const QuestionTimeSettingsLine: FC<Props> = ({ question }) => {
  const [customTime, setCustomTime] = useState<string>(String(question.time));

  return (
    <tr>
      <td>{question.part}</td>
      <td>{question.questionsPart}</td>
      <td><input type="number" value={customTime} onChange={(e) => setCustomTime(e.target.value)} /></td>
    </tr>
  );
};
