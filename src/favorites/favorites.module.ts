import { Module } from "@nestjs/common";
import { TvmazeModule } from "../tvmaze/tvmaze.module.js";
import { FavoritesController } from "./favorites.controller.js";
import { FavoritesService } from "./favorites.service.js";
import { FavoritesStore } from "./favorites.store.js";

@Module({
  imports: [TvmazeModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesStore],
})
export class FavoritesModule {}
