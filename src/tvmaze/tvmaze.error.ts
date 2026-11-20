type TvmazeErrorCode =
  | "show_not_found"
  | "rate_limited"
  | "upstream_timeout"
  | "upstream_error";

export class TvmazeError extends Error {
  constructor(
    readonly code: TvmazeErrorCode,
    readonly retryAfter?: string,
  ) {
    super(code);
    this.name = "TvmazeError";
  }
}
