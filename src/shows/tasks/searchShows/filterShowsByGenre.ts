import type { Show } from "../../show.js";

export const filterShowsByGenre = (
  matches: readonly Show[],
  requestedGenre: string,
) => {
  const genres = [...new Set(matches.flatMap((show) => show.genres))].sort();
  if (requestedGenre === "" || !genres.includes(requestedGenre)) {
    return { genres, selectedGenre: null, shows: matches };
  }

  return {
    genres,
    selectedGenre: requestedGenre,
    shows: matches.filter((show) => show.genres.includes(requestedGenre)),
  };
};
