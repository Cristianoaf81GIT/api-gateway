import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';

@Module({
  imports: [ProxyrmqModule],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
