import { Injectable } from "@nestjs/common";
import type { Show } from "../shows/show.js";

@Injectable()
export class FavoritesStore {
  private readonly favorite: Record<number, Show> = {};

  list(): Show[] {
    return Object.values(this.favorite);
  }

  has(id: number): boolean {
    return Object.hasOwn(this.favorite, id);
  }

  add(show: Show): boolean {
    if (this.has(show.id)) {
      return false;
    }

    this.favorite[show.id] = show;
    return true;
  }

  remove(id: number): boolean {
    if (!this.has(id)) {
      return false;
    }

    delete this.favorite[id];
    return true;
  }
}
