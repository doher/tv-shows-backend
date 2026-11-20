import { HttpStatus } from "@nestjs/common";
import { Buffer } from "node:buffer";
import { MAX_RESPONSE_BYTES, REQUEST_TIMEOUT_MS } from "./tvmaze.constants.js";
import { TvmazeError } from "./tvmaze.error.js";

const readJson = async (response: Response): Promise<unknown> => {
  if (!response.body) {
    throw new TvmazeError("upstream_error");
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) {
        void reader.cancel().catch(() => undefined);
        throw new TvmazeError("upstream_error");
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(Buffer.concat(chunks, size).toString("utf8"));
};

const readHttpError = (response: Response, allowNotFound: boolean) => {
  if (response.status === HttpStatus.TOO_MANY_REQUESTS) {
    return new TvmazeError(
      "rate_limited",
      response.headers.get("Retry-After") || undefined,
    );
  }

  if (response.status === HttpStatus.NOT_FOUND && allowNotFound) {
    return new TvmazeError("show_not_found");
  }

  return new TvmazeError("upstream_error");
};

export const fetchTvmazeJson = async (
  url: string,
  allowNotFound = false,
): Promise<unknown> => {
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal });
    if (response.status !== HttpStatus.OK) {
      void response.body?.cancel().catch(() => undefined);
      throw readHttpError(response, allowNotFound);
    }

    return await readJson(response);
  } catch (error) {
    if (error instanceof TvmazeError) {
      throw error;
    }

    if (signal.aborted) {
      throw new TvmazeError("upstream_timeout");
    }

    throw new TvmazeError("upstream_error");
  }
};
