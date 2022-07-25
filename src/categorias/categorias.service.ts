import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categora.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Injectable()
export class CategoriasService {
  private clientAdminBackend: ClientProxy;

  constructor(private clientProxySmartRanking: ProxyrmqService) {
    this.clientAdminBackend =
      this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  criarCategoria(criarCategoriaDto: CriarCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }

  async consultarCategorias(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-categorias', _id ? _id : ''),
    );
  }

  atualizarCategoria(
    atualizarCategoriaDto: AtualizarCategoriaDto,
    _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}
