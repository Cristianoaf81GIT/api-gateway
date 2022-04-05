import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatus } from './desafio-status.emum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { Partida } from './interfaces/partida.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  private readonly logger = new Logger(DesafiosController.name);

  constructor(
    private clientProxySmartRanking: ProxyrmqService, // @Inject('DESAFIOS') private clientDesafiosSRV: ClientProxy,
  ) {}

  private clienteDesafios: ClientProxy =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientAdminBackend: ClientProxy =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    this.logger.log(`criarDesafioDto: [${JSON.stringify(criarDesafioDto)}]`);
    const jogadores: Jogador[] = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', ''),
    );

    criarDesafioDto.jogadores.forEach((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      this.logger.log(`JogadorFilter: ${JSON.stringify(jogadorFilter)}`);

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não pertence a lista de jogadores!`,
        );
      }

      if (jogadorFilter[0].categoria != criarDesafioDto.categoria)
        throw new BadRequestException(
          `O jogador ${jogadorFilter[0]._id} não faz parte da categoria`,
        );
    });

    const solicitanteEhJogadorDaPartida: Jogador[] =
      criarDesafioDto.jogadores.filter(
        (jogador) => jogador._id == criarDesafioDto.solicitante,
      );

    this.logger.log(
      `solicitanteEhJogadorDaPartida: [${JSON.stringify(
        solicitanteEhJogadorDaPartida,
      )}]`,
    );

    if (solicitanteEhJogadorDaPartida.length == 0)
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );

    const categoria = await lastValueFrom(
      this.clientAdminBackend.send('consultar-categorias', {
        _id: criarDesafioDto.categoria,
      }),
    );

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    if (!categoria) {
      throw new BadRequestException(`A categoria informada não existe`);
    }
    this.clienteDesafios.emit('criar-desafio', criarDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query('idJogador') idJogador: string): Promise<any> {
    if (!idJogador)
      throw new BadRequestException(
        'O Id do jogador deve ser enviado como parâmetro',
      );

    const jogador: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', idJogador),
    );

    if (!jogador) throw new BadRequestException('Jogador não cadastrado');

    return await lastValueFrom(
      this.clienteDesafios.send('consultar-desafios', {
        idJogador: idJogador,
        _id: '',
      }),
    );
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ) {
    const desafio: Desafio = await lastValueFrom(
      this.clienteDesafios.send('consultar-desafios', { idJogador: '', _id }),
    );

    if (!desafio) throw new BadRequestException('Desafio não cadastrado');

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    if (desafio.status != DesafioStatus.PENDENTE)
      throw new BadRequestException(
        'Somente desafios com status pendente podem ser atualizados!',
      );

    this.clienteDesafios.emit('atualizar-desafio', {
      id: _id,
      desafio: atualizarDesafioDto,
    });
  }

  @Post('/:desafio/partida')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ) {
    const desafio: Desafio = await lastValueFrom(
      this.clienteDesafios.send('consultar-desafios', {
        idJogador: '',
        _id: _id,
      }),
    );

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    if (!desafio) throw new BadRequestException(`Desafio não cadastrado`);

    if (desafio.status === DesafioStatus.REALIZADO)
      throw new BadRequestException(`Desafio já realizado`);

    if (desafio.status != DesafioStatus.ACEITO)
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários`,
      );

    if (!desafio.jogadores.includes(atribuirDesafioPartidaDto.def))
      throw new BadRequestException(
        `O vencedor da partida deve fazer parte do desafio!`,
      );

    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    partida.def = atribuirDesafioPartidaDto.def;
    partida.desafio = _id;
    partida.jogadores = desafio.jogadores;
    partida.resultado = atribuirDesafioPartidaDto.resultado;
    await this.clienteDesafios.emit('criar-partida', partida);
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string) {
    const desafio: Desafio = await lastValueFrom(
      this.clienteDesafios.send('consultar-desafios', {
        idJogador: '',
        _id: _id,
      }),
    );

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    if (!desafio) throw new BadRequestException(`Desafio não cadastrado!`);

    await this.clienteDesafios.emit('deletar-desafio', desafio);
  }

  // continuar aqui
  // https://gitlab.com/dfs-treinamentos/smart-ranking/smart-ranking-microservices/api-gateway/-/blob/aula-micro-desafios/src/desafios/desafios.controller.ts
  // file:///C:/Users/cristiano.alexandre/Downloads/Roteiro+-+Migrar+entidades+Desafios+e+Partidas+[API+Gateway+e+Desafios]%20(2).pdf
}
