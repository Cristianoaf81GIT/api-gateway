import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LogginInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

// https://gitlab.com/dfs-treinamentos/smart-ranking/smart-ranking-microservices/api-gateway/-/tree/aula-micro-notificacoes/
// https://docs.nestjs.com/cli/usages

// continuar prox aula repassar tudo o que foi feito video em 18:20
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LogginInterceptor(), new TimeoutInterceptor());
  
  await app.listen(8081);
}
bootstrap();
