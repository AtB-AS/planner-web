export type NoticeFragment = {
  id: string;
  text: string | null;
};

export type SituationFragment = {
  situationNumber: string | null;
  reportType: 'general' | 'incident' | null;
};
