import type { Show } from "../../shows/show.js";

export type FavoriteListStore = {
  list(): readonly Show[];
};

export const listFavorites = (favorites: FavoriteListStore) => ({
  shows: [...favorites.list()].sort((first, second) => first.id - second.id),
});
