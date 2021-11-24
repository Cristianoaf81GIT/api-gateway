import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { format } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  Date.prototype.toJSON = (): string =>
    format(this, 'yyyy-MM-dd HH:mm:ss.SS', {
      timeZone: 'America/Sao_Paulo',
      locale: ptBR,
    });
  await app.listen(8080);
}
bootstrap();
