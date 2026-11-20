import { Injectable } from "@nestjs/common";
import { TvmazeClient } from "../tvmaze/tvmaze.client.js";
import { FavoritesStore } from "./favorites.store.js";
import { addFavorite } from "./tasks/addFavorite.js";
import { listFavorites } from "./tasks/listFavorites.js";
import { removeFavorite } from "./tasks/removeFavorite.js";

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favorites: FavoritesStore,
    private readonly tvmaze: TvmazeClient,
  ) {}

  list() {
    return listFavorites(this.favorites);
  }

  add(id: number) {
    return addFavorite(id, this.favorites, this.tvmaze);
  }

  remove(id: number) {
    return removeFavorite(id, this.favorites);
  }
}
