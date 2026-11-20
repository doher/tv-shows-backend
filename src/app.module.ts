import { Module } from "@nestjs/common";
import { FavoritesModule } from "./favorites/favorites.module.js";
import { HealthController } from "./health.controller.js";
import { ShowsModule } from "./shows/shows.module.js";

@Module({
  imports: [ShowsModule, FavoritesModule],
  controllers: [HealthController],
})
export class AppModule {}
