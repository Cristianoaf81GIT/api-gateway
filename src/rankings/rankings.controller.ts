import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  private clientRankingsBackend: ClientProxy;

  constructor(private rankingsService: RankingsService) {}

  @Get()
  async consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ): Promise<any> {
    return this.rankingsService.consultarRankings(idCategoria, dataRef);
  }
}
