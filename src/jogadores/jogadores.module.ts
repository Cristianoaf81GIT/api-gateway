import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [JogadoresController],
  providers: [],
})
export class JogadoresModule {}
