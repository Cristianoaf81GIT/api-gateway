import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarCategoriaDto } from 'src/categorias/dtos/criar-categoria.dto';
import { lastValueFrom, Observable } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros-pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(private clientProxySmartRanking: ProxyrmqService) {}

  private clienteAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criaJogadorDto: CriarCategoriaDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criaJogadorDto)}`);
    // const categoria = await this.clienteAdminBackend
    //   .send('consultar-categorias', criaJogadorDto.categoria)
    //   .toPromise();

    const categoria = await lastValueFrom(
      this.clienteAdminBackend.send(
        'consultar-categorias',
        criaJogadorDto.categoria,
      ),
    );

    if (categoria)
      this.clienteAdminBackend.emit('criar-jogador', criaJogadorDto);
    else throw new BadRequestException('categoria não cadastrada');
  }

  @Get()
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clienteAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizaJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    // const categoria = await this.clienteAdminBackend
    //   .send('consultar-categorias', atualizaJogadorDto.categoria)
    //   .toPromise();

    const categoria = await lastValueFrom(
      this.clienteAdminBackend.send(
        'consultar-categorias',
        atualizaJogadorDto.categoria,
      ),
    );

    if (categoria)
      this.clienteAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: AtualizarJogadorDto,
      });
    else throw new BadRequestException('Categoria não cadastrada');
  }

  @Delete('/:id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clienteAdminBackend.emit('deletar-jogador', { _id });
  }
}
