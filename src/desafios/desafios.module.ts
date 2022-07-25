import { Module } from '@nestjs/common';
// import { ClientsModule } from '@nestjs/microservices';
// import { DesafiosServiceConfig } from 'src/proxyrmq/desafios.config';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';

@Module({
  imports: [
    ProxyrmqModule,
    // ClientsModule.registerAsync([
    //   { name: 'DESAFIOS', useClass: DesafiosServiceConfig },
    // ]),
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
