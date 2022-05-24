import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';

@Controller('api/v1/rankings')
export class RankingsController {
  private clientRankingsBackend: ClientProxy;

  constructor(private clientProxySmartRanking: ProxyrmqService) {
    this.clientRankingsBackend =
      this.clientProxySmartRanking.getClientProxyRankingsInstance();
  }

  @Get()
  consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ): Observable<any> {
    if (!idCategoria) {
      throw new BadRequestException('O id da categoria é obrigatório!');
    }

    return this.clientRankingsBackend.send('consultar-rankings', {
      idCategoria,
      dataRef: dataRef ? dataRef : '',
    });
  }
}
