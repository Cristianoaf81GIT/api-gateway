import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: +process.env.TRANSPORT,
      options: {
        urls: [process.env.SERVER_URL],
        queue: process.env.QUEUE_NAME,
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.logger.debug(
      `categoria recebida: ${JSON.stringify(criarCategoriaDto)}`,
    );
    return this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }
}
