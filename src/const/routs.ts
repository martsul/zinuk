const BASE_URL: string = 'https://staging-ms.znk.co.il/student/api/v1';

export enum ENDPOINTS {
  TEST = 'test',
  RESULTS = 'test/results'
}

export const getExamDataUrl = (id: string | number): string => `${BASE_URL}/${ENDPOINTS.TEST}/${id}`;
export const postExamResultUrl = (id: string | number): string => `${BASE_URL}/${ENDPOINTS.TEST}/${id}`;
export const getExamsResults = (): string => `${BASE_URL}/${ENDPOINTS.RESULTS}`;