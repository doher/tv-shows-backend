import type { Show } from "../../show.js";
import { filterShowsByGenre } from "./filterShowsByGenre.js";
import { paginateShows } from "./paginateShows.js";

export type ShowSearch = {
  query: string;
  genre: string;
  page: number;
};

type SearchSource = {
  searchShows(query: string): Promise<readonly Show[]>;
};

export const searchShows = async (
  { query, genre, page }: ShowSearch,
  source: SearchSource,
) => {
  const matches = await source.searchShows(query);
  const { genres, selectedGenre, shows } = filterShowsByGenre(matches, genre);

  return { genres, selectedGenre, ...paginateShows(shows, page) };
};
