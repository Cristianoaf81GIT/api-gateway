import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service'; // src/proxyrmq/proxyrmq.service
import { AtualizarCategoriaDto } from './dtos/atualizar-categora.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);

  constructor(private proxySmartRanking: ProxyrmqService) {}

  private clientAdminBackend: ClientProxy =
    this.proxySmartRanking.getClientProxyAdminBackendInstance();

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.logger.debug(
      `categoria recebida: ${JSON.stringify(criarCategoriaDto)}`,
    );
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }

  @Get('categorias')
  consultarCategorias(@Query('id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('categorias/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}
