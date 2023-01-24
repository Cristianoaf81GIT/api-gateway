import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';

@Injectable()
export class RankingsService {
  private clientRankingsBackend: ClientProxy;

  constructor(private clientProxySmartRanking: ProxyrmqService) {
    this.clientRankingsBackend =
      this.clientProxySmartRanking.getClientProxyRankingsInstance();
  }

  async consultarRankings(idCategoria: string, dataRef: string): Promise<any> {
    if (!idCategoria) {
      throw new BadRequestException('O Id da categoria é obrigatório');
    }

    return await lastValueFrom(
      this.clientRankingsBackend.send('consultar-rankings', {
        idCategoria,
        dataRef: dataRef ? dataRef : '',
      }),
    );
  }
}
