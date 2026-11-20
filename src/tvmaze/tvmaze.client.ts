import { Injectable } from "@nestjs/common";
import type { Show } from "../shows/show.js";
import { createResponseCache } from "./tvmaze.cache.js";
import { decodeSearchResults, decodeShowDetails } from "./tvmaze.shows.js";
import { fetchTvmazeJson } from "./tvmaze.transport.js";

const DEFAULT_TVMAZE_URL = "https://api.tvmaze.com";

@Injectable()
export class TvmazeClient {
  private readonly baseUrl = (
    process.env.TVMAZE_BASE_URL?.trim() || DEFAULT_TVMAZE_URL
  ).replace(/\/+$/, "");

  private readonly searches = createResponseCache<Show[]>();
  private readonly details = createResponseCache<Show>();

  searchShows(query: string): Promise<Show[]> {
    const params = new URLSearchParams({ q: query });
    const url = `${this.baseUrl}/search/shows?${params}`;
    return this.searches(url, async () => {
      const body = await fetchTvmazeJson(url);
      return decodeSearchResults(body);
    });
  }

  findShow(id: number): Promise<Show> {
    const url = `${this.baseUrl}/shows/${id}`;
    return this.details(url, async () => {
      const body = await fetchTvmazeJson(url, true);
      return decodeShowDetails(body, id);
    });
  }
}
