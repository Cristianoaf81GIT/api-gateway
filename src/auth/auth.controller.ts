import { Controller, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthRegistroUsuarioDto } from './dtos/auth-registro-usuario.dto';
import { AwsCognitoService } from '../aws/aws-cognito.service';
import { AuthLoginUsuarioDto }  from './dtos/auth-login-usuario.dto';

@Controller('api/v1/auth')
export class AuthController {

  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/registro')
  @UsePipes(ValidationPipe)
  async registro(@Body() authRegistroUsuario: AuthRegistroUsuarioDto): Promise<unknown> {
   return (await this.awsCognitoService.registrarUsuario(authRegistroUsuario)); 
  }
  
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUsuario: AuthLoginUsuarioDto):Promise<unknown> {
    return (await this.awsCognitoService.autenticarUsuario(authLoginUsuario));
  }
}
