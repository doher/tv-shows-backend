import { Module } from "@nestjs/common";
import { TvmazeModule } from "../tvmaze/tvmaze.module.js";
import { ShowsController } from "./shows.controller.js";
import { ShowsService } from "./shows.service.js";

@Module({
  imports: [TvmazeModule],
  controllers: [ShowsController],
  providers: [ShowsService],
})
export class ShowsModule {}
