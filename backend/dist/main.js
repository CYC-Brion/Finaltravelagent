"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const env_loader_1 = require("./common/env-loader");
async function bootstrap() {
    (0, env_loader_1.loadEnvFiles)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map