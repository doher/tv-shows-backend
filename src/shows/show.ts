export type Show = {
  id: number;
  name: string;
  url: string;
  genres: string[];
  premiered: string | null;
  image: { medium: string } | null;
  rating: { average: number | null };
};

const MIN_SHOW_ID = 1;

export const isShowId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= MIN_SHOW_ID;
