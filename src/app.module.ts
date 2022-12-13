import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ProxyrmqService } from './proxyrmq/proxyrmq.service';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';
import { DesafiosModule } from './desafios/desafios.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriasModule,
    ProxyrmqModule,
    JogadoresModule,
    AwsModule,
    DesafiosModule,
    RankingsModule,
    AuthModule,
  ],
  providers: [ProxyrmqService],
})
export class AppModule {}
