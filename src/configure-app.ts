import type { INestApplication } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { TvmazeErrorFilter } from "./tvmaze-error.filter.js";

export const configureApp = (app: INestApplication) => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN?.trim();

  app.setGlobalPrefix("api");
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Cache-Control", "no-store");

    if (frontendOrigin) {
      response.vary("Origin");
    }

    next();
  });
  app.useGlobalFilters(new TvmazeErrorFilter());

  if (frontendOrigin) {
    app.enableCors({
      origin: (
        origin: string | undefined,
        callback: (error: Error | null, allowed: boolean) => void,
      ) => callback(null, origin === frontendOrigin),
      methods: ["GET", "PUT", "DELETE"],
      allowedHeaders: [],
      exposedHeaders: ["Retry-After"],
    });
  }

  return app;
};
