import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { lastValueFrom, Observable } from 'rxjs';
import { ProxyrmqService } from '../proxyrmq/proxyrmq.service';
import { AwsS3Service } from '../aws/aws-s3.service';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { Categoria } from '../categorias/interfaces/categoria.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JogadoresService {
  private logger = new Logger(JogadoresService.name);
  private clientAdminBackend: ClientProxy;

  constructor(
    private ClientProxySmartRanking: ProxyrmqService,
    private awsS3Service: AwsS3Service,
  ) {
    this.clientAdminBackend =
      this.ClientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  async criarJogador(criarJodadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJodadorDto)}`);
    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        criarJodadorDto.categoria,
      ),
    );

    if (categoria) {
      await lastValueFrom(
        this.clientAdminBackend.emit('criar-jogador', criarJodadorDto),
      );
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  async uploadArquivo(file, _id: string): Promise<any> {
    // verificar se o jogador está cadastrado
    const jogador: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id),
    );

    if (!jogador) {
      throw new BadRequestException('Jogador não encontrado!');
    }

    // enviar o arquivo para s3 e recuperar URL de acesso
    const urlFotoJogador = await this.awsS3Service.uploadArquivo(file, _id);
    // atualizar o atributo URL da entidade jogador
    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.Location;
    await lastValueFrom(
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      }),
    );

    // retorna jogador atualizado para cliente
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id),
    );
  }

  async consultarJogadores(_id: string): Promise<Observable<any>> {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id ? _id : ''),
    );
  }

  async atualizarJogador(
    atualizarJogadorDto: AtualizarJogadorDto,
    _id: string,
  ) {
    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        atualizarJogadorDto.categoria,
      ),
    );

    if (categoria) {
      await lastValueFrom(
        this.clientAdminBackend.emit('atualizar-jogador', {
          id: _id,
          jogador: atualizarJogadorDto,
        }),
      );
    } else {
      throw new BadRequestException('Categoria não cadastrada!');
    }
  }

  async deletarJogador(_id: string) {
    await lastValueFrom(
      this.clientAdminBackend.emit('deletar-jogador', { _id }),
    );
  }
}
