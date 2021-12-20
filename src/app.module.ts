import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ProxyrmqService } from './proxyrmq/proxyrmq.service';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriasModule,
    ProxyrmqModule,
    JogadoresModule,
  ],
  providers: [ProxyrmqService],
})
export class AppModule {}
