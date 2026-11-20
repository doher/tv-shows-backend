import type { Show } from "../../shows/show.js";
import { type FavoriteListStore, listFavorites } from "./listFavorites.js";

type AddFavoriteStore = FavoriteListStore & {
  has(id: number): boolean;
  add(show: Show): boolean;
};

type ShowSource = {
  findShow(id: number): Promise<Show>;
};

export const addFavorite = async (
  id: number,
  favorites: AddFavoriteStore,
  source: ShowSource,
) => {
  if (favorites.has(id)) {
    return { ...listFavorites(favorites), changed: false };
  }

  const show = await source.findShow(id);
  const changed = favorites.add(show);

  return { ...listFavorites(favorites), changed };
};
