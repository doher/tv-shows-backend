import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { parseSearchQuery } from "./parse-search-query.js";
import { ShowsService } from "./shows.service.js";

@Controller("shows")
export class ShowsController {
  constructor(private readonly shows: ShowsService) {}

  @Get()
  search(@Query() params: Record<string, unknown>) {
    const search = parseSearchQuery(params);
    if (search === null) {
      throw new BadRequestException({ error: "invalid_query" });
    }

    return this.shows.search(search);
  }
}
