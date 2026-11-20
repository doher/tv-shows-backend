import { Module } from "@nestjs/common";
import { TvmazeClient } from "./tvmaze.client.js";

@Module({
  providers: [TvmazeClient],
  exports: [TvmazeClient],
})
export class TvmazeModule {}
