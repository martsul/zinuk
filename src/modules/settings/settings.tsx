import "bootstrap/dist/css/bootstrap.min.css";
import { ExamIntroSettings } from "./components/exam-intro-settings/exam-intro-settings";
import { QuestionTimeSettings } from "./components/question-time-settings/question-time-settings";
import { QuestionIntroSettings } from "./components/question-into-settings/question-into-settings";

export const Settings = () => {
  return (
    <div>
      <div>
        <h2>Exam Intro Settings</h2>
        <ExamIntroSettings />
      </div>
      <div>
        <h2>Question Intro Settings</h2>
        <QuestionIntroSettings />
      </div>
      <div>
        <h2>Question Time Settings</h2>
        <QuestionTimeSettings />
      </div>
    </div>
  );
};
