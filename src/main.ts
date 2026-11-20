import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

const DEFAULT_PORT = 8080;

const bootstrap = async () => {
  const app = configureApp(await NestFactory.create(AppModule));
  const port = Number(process.env.PORT || DEFAULT_PORT);

  await app.listen(port);
};

void bootstrap();
