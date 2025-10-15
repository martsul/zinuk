import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./modules/layout/layout";
import { RouterUrl } from "./const/router";
import { IntroLayout } from "./modules/intro-layout/intro-layout";
import { PreviewLayout } from "./modules/preview-layout/preview-layout";
import { IntroType } from "./modules/intro-layout/intro-layout.const";
import { QuestionLayout } from "./modules/question-layout/question-layout";
import { QuestionType } from "./modules/question-layout/question-layout.const";
import { PauseLayout } from "./modules/pause-layout/pause-layout";
import { ResultsLayout } from "./modules/results-layout/results-layout";
import { ResultsDetails } from "./modules/results-content/results-details/results-details";
import { ResultsBase } from "./modules/results-content/results-base/results-base";
import { Settings } from "./modules/settings/settings";

export const App = () => {
  const router = createBrowserRouter([
    {
      path: RouterUrl.ROOT,
      element: <Layout />,
      children: [
        {
          path: `${RouterUrl.PREVIEW}/${RouterUrl.ID}`,
          element: <PreviewLayout />,
        },
        {
          path: `${RouterUrl.QUESTION_INTRO}/${RouterUrl.ID}`,
          element: <IntroLayout type={IntroType.QUESTION} />,
        },
        {
          path: `${RouterUrl.EXAM_INTRO}/${RouterUrl.ID}`,
          element: <IntroLayout type={IntroType.EXAM} />,
        },
        {
          path: `${RouterUrl.EXAM_INTRO}/${RouterUrl.ID}`,
          element: <IntroLayout type={IntroType.EXAM} />,
        },
        {
          path: `${RouterUrl.SIMPLE_QUESTION}/${RouterUrl.ID}`,
          element: <QuestionLayout type={QuestionType.SIMPLE} />,
        },
        {
          path: `${RouterUrl.QUESTION_TEXT}/${RouterUrl.ID}`,
          element: <QuestionLayout type={QuestionType.TEXT} />,
        },
        {
          path: `${RouterUrl.QUESTION_TQ}/${RouterUrl.ID}`,
          element: <QuestionLayout type={QuestionType.TQ} />,
        },
        {
          path: `${RouterUrl.PAUSE}/${RouterUrl.ID}`,
          element: <PauseLayout />,
        },
        {
          path: `${RouterUrl.RESULTS}`,
          element: (
            <ResultsLayout>
              <ResultsBase />
            </ResultsLayout>
          ),
        },
        {
          path: `${RouterUrl.RESULTS_DETAILS}`,
          element: (
            <ResultsLayout>
              <ResultsDetails />
            </ResultsLayout>
          ),
        },
      ],
    },
    {
      path: `${RouterUrl.SETTINGS}`,
      element: <Settings />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
