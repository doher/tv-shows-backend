import { FIRST_PAGE, PAGE_SIZE } from "../../pagination.constants.js";
import type { Show } from "../../show.js";

const EMPTY_RESULT_POSITION = 0;

export const paginateShows = (
  shows: readonly Show[],
  requestedPage: number,
) => {
  const total = shows.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const page = Math.max(FIRST_PAGE, Math.min(requestedPage, pageCount));
  const offset = (page - FIRST_PAGE) * PAGE_SIZE;
  const first = total === 0 ? EMPTY_RESULT_POSITION : offset + 1;
  const last = Math.min(offset + PAGE_SIZE, total);

  return {
    shows: shows.slice(offset, last),
    page,
    pageCount,
    resultRange: { first, last, total },
  };
};
