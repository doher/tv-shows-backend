import { isShowId, type Show } from "../shows/show.js";
import { TvmazeError } from "./tvmaze.error.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value !== "";

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const decodeImage = (image: unknown): Show["image"] => {
  if (image == null) {
    return null;
  }

  if (!isRecord(image)) {
    throw new TvmazeError("upstream_error");
  }

  const medium = image.medium ?? "";
  if (typeof medium !== "string") {
    throw new TvmazeError("upstream_error");
  }

  return { medium };
};

const decodeRating = (rating: unknown): Show["rating"] => {
  if (rating == null) {
    return { average: null };
  }

  if (!isRecord(rating)) {
    throw new TvmazeError("upstream_error");
  }

  const average = rating.average ?? null;
  const isInvalidAverage =
    average !== null &&
    (typeof average !== "number" || !Number.isFinite(average));
  if (isInvalidAverage) {
    throw new TvmazeError("upstream_error");
  }

  return { average };
};

const decodeShow = (body: unknown): Show => {
  if (!isRecord(body)) {
    throw new TvmazeError("upstream_error");
  }

  const { id, name, url } = body;
  const genres = body.genres ?? [];
  const premiered = body.premiered ?? null;
  const hasRequiredFields =
    isShowId(id) && isNonemptyString(name) && isNonemptyString(url);
  if (!hasRequiredFields || !isStringList(genres)) {
    throw new TvmazeError("upstream_error");
  }

  if (premiered !== null && typeof premiered !== "string") {
    throw new TvmazeError("upstream_error");
  }

  return {
    id,
    name,
    url,
    genres,
    premiered,
    image: decodeImage(body.image),
    rating: decodeRating(body.rating),
  };
};

export const decodeSearchResults = (body: unknown): Show[] => {
  if (!Array.isArray(body)) {
    throw new TvmazeError("upstream_error");
  }

  return body.map((hit: unknown) => {
    if (!isRecord(hit)) {
      throw new TvmazeError("upstream_error");
    }

    return decodeShow(hit.show);
  });
};

export const decodeShowDetails = (body: unknown, expectedId: number): Show => {
  const show = decodeShow(body);
  if (show.id !== expectedId) {
    throw new TvmazeError("upstream_error");
  }

  return show;
};
