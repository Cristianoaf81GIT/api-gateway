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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros-pipe';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(
    private jogadoresService: JogadoresService,
  ) {}
  
  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criaJogadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criaJogadorDto)}`);
    await this.jogadoresService.criarJogador(criaJogadorDto);    
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('_id') _id: string) {
    this.logger.log(`${JSON.stringify(file.originalname)} - ${_id}}`);
    return this.jogadoresService.uploadArquivo(file, _id);
  }

  @Get()
  async consultarJogadores(@Query('idJogador') _id: string): Promise<Observable<any>> {
    return (await this.jogadoresService.consultarJogadores(_id));
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizaJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    await this.jogadoresService.atualizarJogador(atualizaJogadorDto, _id);
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.jogadoresService.deletarJogador(_id);
  }
}
