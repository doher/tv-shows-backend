import { FIRST_PAGE } from "./pagination.constants.js";
import type { ShowSearch } from "./tasks/searchShows/index.js";

const firstString = (value: unknown): string => {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" ? first : "";
};

export const parseSearchQuery = (
  params: Record<string, unknown>,
): ShowSearch | null => {
  const query = firstString(params.q).trim();
  if (query === "") {
    return null;
  }

  const genre = firstString(params.genre).trim();
  const requestedPage = firstString(params.page);
  const page = /^\d+$/u.test(requestedPage) ? Number(requestedPage) : FIRST_PAGE;

  return { query, genre, page };
};
