import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { format } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LogginInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LogginInterceptor(), new TimeoutInterceptor());
  Date.prototype.toJSON = (): string => {
    try {
      return format(this, 'yyyy-MM-dd HH:mm:ss.SS', {
        timeZone: 'America/Sao_Paulo',
        locale: ptBR,
      });
    } catch (error: unknown) {
      return this;
    }
  };

  await app.listen(8081);
}
bootstrap();
