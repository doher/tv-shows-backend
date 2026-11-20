import { type FavoriteListStore, listFavorites } from "./listFavorites.js";

type RemoveFavoriteStore = FavoriteListStore & {
  remove(id: number): boolean;
};

export const removeFavorite = (id: number, favorites: RemoveFavoriteStore) => {
  const changed = favorites.remove(id);
  return { ...listFavorites(favorites), changed };
};
