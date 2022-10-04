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
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  private readonly logger = new Logger(DesafiosController.name);

  constructor(
     private desafiosService: DesafiosService,     
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    this.logger.log(`criarDesafioDto: [${JSON.stringify(criarDesafioDto)}]`);
    await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query('idJogador') idJogador: string): Promise<any> {
    return (await this.desafiosService.consultarDesafios(idJogador));
  }
  
  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ) {
    this.desafiosService.atualizarDesafio(atualizarDesafioDto, _id);  
  }

  @Post('/:desafio/partida')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ) {
    await this.desafiosService.atribuirDesafioPartida(atribuirDesafioPartidaDto, _id);
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string) {
   await this.desafiosService.deletarDesafio(_id); 
  }
}
