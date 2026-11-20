import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from "@nestjs/common";
import { isShowId } from "../shows/show.js";
import { FavoritesService } from "./favorites.service.js";

const parseFavoriteId = (value: string): number => {
  const id = /^\d+$/u.test(value) ? Number(value) : Number.NaN;
  if (!isShowId(id)) {
    throw new BadRequestException({ error: "invalid_id" });
  }

  return id;
};

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list() {
    return this.favorites.list();
  }

  @Put(":id")
  add(@Param("id") id: string) {
    return this.favorites.add(parseFavoriteId(id));
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.favorites.remove(parseFavoriteId(id));
  }
}
