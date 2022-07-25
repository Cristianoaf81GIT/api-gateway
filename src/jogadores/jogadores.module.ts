import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';
import { AwsModule } from '../aws/aws.module';
import { JogadoresService } from './jogadores.service';

@Module({
  imports: [ProxyrmqModule, AwsModule],
  controllers: [JogadoresController],
  providers: [JogadoresService],
})
export class JogadoresModule {}
