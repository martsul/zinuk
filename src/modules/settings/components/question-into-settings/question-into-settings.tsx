import { Table } from "react-bootstrap";
import { QuestionIntroSettingsLine } from "../question-into-settings-line/question-into-settings-line";
import { EXAM, ExamType, type IntroItem } from "../../../../const/exam";

const intros: IntroItem[] = [];

for (const key in EXAM) {
  const item = EXAM[key];
  if (item.type === ExamType.QUESTION_INTRO) {
    intros.push(item);
  }
}

export const QuestionIntroSettings = () => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Part</th>
          <th>Type</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {intros.map((item) => {
          return <QuestionIntroSettingsLine key={item.id} intro={item} />;
        })}
      </tbody>
    </Table>
  );
};
