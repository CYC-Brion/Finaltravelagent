import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadEnvFiles } from "./common/env-loader";

async function bootstrap() {
  loadEnvFiles();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
}

bootstrap();
