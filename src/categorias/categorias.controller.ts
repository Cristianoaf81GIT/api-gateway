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
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categora.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);

  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.logger.debug(
      `categoria recebida: ${JSON.stringify(criarCategoriaDto)}`,
    );
    this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(@Query('_id') _id: string) {
    return (await this.categoriasService.consultarCategorias(_id));
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.categoriasService.atualizarCategoria(atualizarCategoriaDto, _id);
  }
}
