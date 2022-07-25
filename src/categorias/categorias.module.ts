import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [ProxyrmqModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
