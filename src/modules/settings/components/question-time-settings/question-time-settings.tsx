import { Table } from "react-bootstrap";
import { EXAM, ExamType, type SimpleQuestionItem, type TQQuestionItem } from "../../../../const/exam";
import { QuestionTimeSettingsLine } from "../question-time-settings-line/question-time-settings-line";

const questions: Record<string, SimpleQuestionItem | TQQuestionItem> = {}

for (const key in EXAM) {
  const item = EXAM[key];
  if (item.type === ExamType.SIMPLE_QUESTION || item.type === ExamType.QUESTION_TQ) {
    const key = `${item.part}-${item.questionsPart}`;
    questions[key] = item;
  }
}

export const QuestionTimeSettings = () => {
  return <Table>
    <thead>
      <tr>
        <th>Part</th>
        <th>Type</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
    {Object.keys(questions).map((key) => {
      const item = questions[key];
      return <QuestionTimeSettingsLine key={key} question={item} />;
    })}
    </tbody>
    </Table>;
  };