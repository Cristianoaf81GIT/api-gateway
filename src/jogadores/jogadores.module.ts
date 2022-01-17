import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [ProxyrmqModule, AwsModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
