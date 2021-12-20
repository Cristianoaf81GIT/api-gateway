import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
