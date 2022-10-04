import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { lastValueFrom } from 'rxjs';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { Partida } from './interfaces/partida.interface';
import { DesafioStatus } from './desafio-status.emum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

@Injectable()
export class DesafiosService {
  private readonly logger = new Logger(DesafiosService.name);
  private clientDesafios: ClientProxy;
  private clientAdminBackend: ClientProxy;

  constructor(private clientProxySmartRanking: ProxyrmqService) {
    this.clientDesafios =
      this.clientProxySmartRanking.getClientProxyDesafiosInstance();
    this.clientAdminBackend =
      this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  async criarDesafio(criarDesafioDto: CriarDesafioDto) {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`);

    /**
     * validacoes relacionadas ao array de jogadores que participam do desafio
     */
    const jogadores: Jogador[] = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', ''),
    );

    criarDesafioDto.jogadores.forEach((jogadorDto) => {
      const jogadorFilter: Jogador[] = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      this.logger.log(`jogadorFilter: ${JSON.stringify(jogadorFilter)}`);

      /**
       * verificamos se os jogadores do desafio estao cadastrados
       */

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `o jogador ${jogadorFilter[0]._id} não faz parte da categoria informada!`,
        );
      }

      /**
       * verificar se os jogadores fazem parte da categoria informada no desafio
       */

      if (jogadorFilter[0].categoria != criarDesafioDto.categoria) {
        throw new BadRequestException(
          `O jogador ${jogadorFilter[0]._id} não faz parte da categoria informada!`,
        );
      }
    });

    /**
     * verificamos se o solicitando é um jogador da partida
     */
    const solicitanteEhJogadorPartida: Jogador[] =
      criarDesafioDto.jogadores.filter(
        (jogador) => jogador._id == criarDesafioDto.solicitante,
      );

    this.logger.log(
      `solicitanteEhJogadorPartida: ${JSON.stringify(
        solicitanteEhJogadorPartida,
      )}`,
    );

    if (solicitanteEhJogadorPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    /**
     * verificamos se a categoria está cadastrada
     */
    const categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        criarDesafioDto.categoria,
      ),
    );

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    if (!categoria) {
      throw new BadRequestException('Categoria informada não existe');
    }

    this.clientDesafios.emit('criar-desafio', criarDesafioDto);
  }

  async consultarDesafios(idJogador: string): Promise<any> {
    /**
     * verificamos se o jogador esta cadastrado
     */
    if (idJogador) {
      const jogador: Jogador = await lastValueFrom(
        this.clientAdminBackend.send('consultar-jogadores', idJogador),
      );
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

      if (!jogador) {
        throw new BadRequestException('Jogador não cadastrado!');
      }
    }

    return await lastValueFrom(
      this.clientDesafios.send('consultar-desafios', {
        idJogador: idJogador,
        _id: '',
      }),
    );
  }

  async atualizarDesafio(
    atualizarDesafioDto: AtualizarDesafioDto,
    _id: string
  ) {
    /*
     * validacoes em relacao ao desafio
    * */  
   const desafio: Desafio = await lastValueFrom(
    this.clientDesafios.send('consultar-desafios', {idJogador: '', _id: _id})
   );

   this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
   
   /* verificamos se o desafio esta cadastrado */
   if (!desafio) {
    throw new BadRequestException('Desafio não cadastrado');
   }

   /* somente pode ser atualizado desafio com estatus pendente */
   if (desafio.status != DesafioStatus.PENDENTE) {
     throw new BadRequestException('Somente desafios com status PENDENTE poder ser atualizados!');
   }

   await this.clientDesafios.emit('atualizar-desafio', {id: _id, desafio: atualizarDesafioDto});
  }

  
  async atribuirDesafioPartida(
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    _id: string,
  ) {
    const desafio: Desafio = await lastValueFrom(
      this.clientDesafios.send('consultar-desafios', { idJogador: '', _id: _id})
    ); 
    
    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    /*
     *verificamos se o desafio ja está cadastrado
     * */
    if (!desafio) {
      throw new BadRequestException('Desafio não cadastrado!');
    }

    /*
     * verificamos se o desafio ja foi realizado
     * */
     if (desafio.status == DesafioStatus.REALIZADO) {
      throw new BadRequestException('Desafio já realizado');
     } 
    
     /*
      * somente deve ser possivel lancar uma partida para desafio aceito
     * */
     if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        'Partidas somente podem ser lançadas em desafios aceitos pelos adversários'
      );
     }

     /*
      * verificamos se o jogador informado faz parte do desafio
     * */
    if (!desafio.jogadores.includes(atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException(
        'O jogador vencedor da partida deve fazer parte do desafio!'
      );
    }

    /*
     *criamos nosso objeto partida

     * */

    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    partida.def = atribuirDesafioPartidaDto.def;
    partida.desafio = _id;
    partida.jogadores = desafio.jogadores;
    partida.resultado = atribuirDesafioPartidaDto.resultado;

    /*
     *enviamos a partida para o topico  'criar-partida'
     * */
    await this.clientDesafios.emit('criar-partida', partida);

  }

  async deletarDesafio(_id: string) {
    const desafio = await lastValueFrom(
      this.clientDesafios.send('consultar-desafios', {idJogador:'' , _id }),
    );

    /*
     * Verificamos se o desafio esta cadastrado
     * */
    if (!desafio) {
      throw new BadRequestException('Desafio não cadastrado');
    }

    await this.clientDesafios.emit('deletar-desafio', desafio);
  }

}
