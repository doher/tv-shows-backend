import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { TvmazeError } from "./tvmaze/tvmaze.error.js";

const statusByCode: Record<TvmazeError["code"], HttpStatus> = {
  show_not_found: HttpStatus.NOT_FOUND,
  rate_limited: HttpStatus.TOO_MANY_REQUESTS,
  upstream_timeout: HttpStatus.GATEWAY_TIMEOUT,
  upstream_error: HttpStatus.BAD_GATEWAY,
};

@Catch(TvmazeError)
export class TvmazeErrorFilter implements ExceptionFilter<TvmazeError> {
  catch(error: TvmazeError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (error.retryAfter) {
      response.setHeader("Retry-After", error.retryAfter);
    }

    response.status(statusByCode[error.code]).json({ error: error.code });
  }
}
