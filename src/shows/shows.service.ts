import { Injectable } from "@nestjs/common";
import { TvmazeClient } from "../tvmaze/tvmaze.client.js";
import { searchShows, type ShowSearch } from "./tasks/searchShows/index.js";

@Injectable()
export class ShowsService {
  constructor(private readonly tvmaze: TvmazeClient) {}

  search(search: ShowSearch) {
    return searchShows(search, this.tvmaze);
  }
}
