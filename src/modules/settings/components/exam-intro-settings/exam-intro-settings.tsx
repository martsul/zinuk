import { Table } from "react-bootstrap";
import { EXAM, ExamType, type IntroItem } from "../../../../const/exam";
import { ExamIntroSettingsLine } from "../exam-intro-settings-line/exam-intro-settings-line";

const examsIntro: IntroItem[] = [];

for (const key in EXAM) {
  const item = EXAM[key];
  if (item.type === ExamType.EXAM_INTRO) {
    examsIntro.push(item);
  }
}

export const ExamIntroSettings = () => {
  return <Table>
    <thead>
      <tr>
        <th>Part</th>
        <th>Text</th>
      </tr>
    </thead>
    <tbody>
      {[...new Array(3)].map((_, index) => (
        <ExamIntroSettingsLine
          key={index}
          part={index + 1}
          texts={examsIntro[index]?.texts || []}
        />
      ))}
    </tbody>
  </Table>;
}

