const TEST: string = "https://staging-ms.znk.co.il";
// const PROD: string = "https://znk.co.il";

const BASE_URL: string = TEST + "/student/api/v1";

export enum ENDPOINTS {
  TEST = "test",
  RESULTS = "test/results",
}

export const getExamDataUrl = (id: string | number): string =>
  `${BASE_URL}/${ENDPOINTS.TEST}/${id}`;
export const postExamResultUrl = (id: string | number): string =>
  `${BASE_URL}/${ENDPOINTS.TEST}/${id}`;
export const getExamsResults = (): string => `${BASE_URL}/${ENDPOINTS.RESULTS}`;
